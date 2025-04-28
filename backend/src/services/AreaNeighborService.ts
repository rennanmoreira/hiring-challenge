import { AreaNeighbor } from "../models/AreaNeighbor";
import { AppDataSource } from "../config/database";
import { Repository, IsNull, Not } from "typeorm";
import { ApiError } from "../utils/ApiError";
import { ExpressRequestWithUser } from "src/middleware/authentication";
import { User } from "../models/User";

export class AreaNeighborService {
  private repo: Repository<AreaNeighbor>;

  constructor() {
    this.repo = AppDataSource.getRepository(AreaNeighbor);
  }

  async create(data: Partial<AreaNeighbor>, request: ExpressRequestWithUser) {
    if (!request.user || !request.user.id) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Validar dados obrigatórios
    if (!data.areaId || !data.neighborAreaId) {
      throw ApiError.validation(
        "Area ID, neighbor area ID, and created by user ID are required",
        { providedData: data }
      );
    }

    // Verificar se as áreas são diferentes
    if (data.areaId === data.neighborAreaId) {
      throw ApiError.validation("An area cannot be a neighbor to itself", {
        areaId: data.areaId,
        neighborAreaId: data.neighborAreaId,
      });
    }

    // Verificar se já existe uma relação entre essas áreas
    const existing = await this.repo.findOne({
      where: [
        {
          areaId: data.areaId,
          neighborAreaId: data.neighborAreaId,
        },
        {
          areaId: data.neighborAreaId,
          neighborAreaId: data.areaId,
        },
      ],
    });

    if (existing) {
      throw ApiError.conflict("These areas are already neighbors", {
        areaId: data.areaId,
        neighborAreaId: data.neighborAreaId,
        existingRelationId: existing.id,
      });
    }

    // Verificar se as áreas existem e pertencem à mesma planta
    const areaRepo = AppDataSource.getRepository("Area");
    const area = await areaRepo.findOne({ where: { id: data.areaId } });
    const neighborArea = await areaRepo.findOne({
      where: { id: data.neighborAreaId },
    });

    if (!area || !neighborArea) {
      throw ApiError.validation("One or both areas do not exist", {
        areaId: data.areaId,
        neighborAreaId: data.neighborAreaId,
        areaExists: !!area,
        neighborAreaExists: !!neighborArea,
      });
    }

    // Verificar se as áreas pertencem à mesma planta
    if (area.plantId !== neighborArea.plantId) {
      throw ApiError.validation(
        "Areas must belong to the same plant to be neighbors",
        {
          areaId: data.areaId,
          areaPlantId: area.plantId,
          neighborAreaId: data.neighborAreaId,
          neighborAreaPlantId: neighborArea.plantId,
        }
      );
    }

    // Criar a relação direta (A -> B)
    const entity = this.repo.create({
      ...data,
      createdByUserId: request.user.id,
      updatedByUserId: request.user.id,
    });
    const savedEntity = await this.repo.save(entity);

    // Criar a relação inversa (B -> A) com os mesmos usuários de criação/atualização
    const inverseRelation = this.repo.create({
      areaId: data.neighborAreaId,
      neighborAreaId: data.areaId,
      createdByUserId: request.user.id,
      updatedByUserId: request.user.id,
    });

    await this.repo.save(inverseRelation);

    return savedEntity;
  }

  async findAll() {
    return this.repo.find({
      relations: ["area", "neighborArea", "createdByUser", "updatedByUser"],
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: string) {
    const relation = await this.repo.findOne({
      relations: ["area", "neighborArea", "createdByUser", "updatedByUser"],
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!relation) {
      throw ApiError.notFound("Area neighbor relationship not found", { id });
    }

    return relation;
  }

  async findByAreaId(areaId: string) {
    return this.repo.find({
      relations: ["area", "neighborArea", "createdByUser", "updatedByUser"],
      where: [{ areaId, deletedAt: IsNull() }],
    });
  }

  async update(
    id: string,
    data: Partial<AreaNeighbor>,
    request: ExpressRequestWithUser
  ) {
    if (!request.user || !request.user.id) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const relation = await this.findById(id);

    // Verificar se os dados de atualização são válidos
    if (
      data.areaId &&
      data.neighborAreaId &&
      data.areaId === data.neighborAreaId
    ) {
      throw ApiError.validation("An area cannot be a neighbor to itself", {
        areaId: data.areaId,
        neighborAreaId: data.neighborAreaId,
      });
    }

    // Se estiver alterando alguma das áreas, verificar se a nova relação já existe
    if (
      (data.areaId && data.areaId !== relation.areaId) ||
      (data.neighborAreaId && data.neighborAreaId !== relation.neighborAreaId)
    ) {
      const newAreaId = data.areaId || relation.areaId;
      const newNeighborAreaId = data.neighborAreaId || relation.neighborAreaId;

      const existingRelation = await this.repo.findOne({
        where: [
          { areaId: newAreaId, neighborAreaId: newNeighborAreaId, id: Not(id) },
          { areaId: newNeighborAreaId, neighborAreaId: newAreaId, id: Not(id) },
        ],
      });

      if (existingRelation) {
        throw ApiError.conflict("This neighbor relationship already exists", {
          areaId: newAreaId,
          neighborAreaId: newNeighborAreaId,
          existingRelationId: existingRelation.id,
        });
      }

      // Verificar se as novas áreas existem e pertencem à mesma planta
      if (data.areaId || data.neighborAreaId) {
        const areaRepo = AppDataSource.getRepository("Area");
        let area, neighborArea;

        // Obter a área atual ou a nova área
        if (data.areaId) {
          area = await areaRepo.findOne({ where: { id: data.areaId } });
          if (!area) {
            throw ApiError.validation("Area does not exist", {
              areaId: data.areaId,
            });
          }
        } else {
          area = await areaRepo.findOne({ where: { id: relation.areaId } });
        }

        // Obter a área vizinha atual ou a nova área vizinha
        if (data.neighborAreaId) {
          neighborArea = await areaRepo.findOne({
            where: { id: data.neighborAreaId },
          });
          if (!neighborArea) {
            throw ApiError.validation("Neighbor area does not exist", {
              neighborAreaId: data.neighborAreaId,
            });
          }
        } else {
          neighborArea = await areaRepo.findOne({
            where: { id: relation.neighborAreaId },
          });
        }

        // Verificar se as áreas pertencem à mesma planta
        if (area && neighborArea && area.plantId !== neighborArea.plantId) {
          throw ApiError.validation(
            "Areas must belong to the same plant to be neighbors",
            {
              areaId: area.id,
              areaPlantId: area.plantId,
              neighborAreaId: neighborArea.id,
              neighborAreaPlantId: neighborArea.plantId,
            }
          );
        }
      }
    }

    // Encontrar a relação inversa existente
    const inverseRelation = await this.repo.findOne({
      where: {
        areaId: relation.neighborAreaId,
        neighborAreaId: relation.areaId,
        updatedByUserId: request.user.id,
        deletedAt: IsNull(),
      },
    });

    // Atualizar a relação direta
    Object.assign(relation, { ...data, updatedByUserId: request.user.id });
    const updatedRelation = await this.repo.save(relation);

    // Se encontrou a relação inversa, atualizá-la também
    if (inverseRelation) {
      // Atualizar a relação inversa com os dados invertidos
      Object.assign(inverseRelation, {
        areaId: updatedRelation.neighborAreaId,
        neighborAreaId: updatedRelation.areaId,
        updatedByUserId: data.updatedByUserId,
      });
      await this.repo.save(inverseRelation);
    } else {
      // Se não existir uma relação inversa, criar uma nova
      const newInverseRelation = this.repo.create({
        areaId: updatedRelation.neighborAreaId,
        neighborAreaId: updatedRelation.areaId,
        createdByUserId: updatedRelation.createdByUserId,
        updatedByUserId: updatedRelation.updatedByUserId,
      });
      await this.repo.save(newInverseRelation);
    }

    return updatedRelation;
  }

  async delete(id: string) {
    // Verificar se a relação existe
    const relation = await this.findById(id);

    // Encontrar a relação inversa
    const inverseRelation = await this.repo.findOne({
      where: {
        areaId: relation.neighborAreaId,
        neighborAreaId: relation.areaId,
        deletedAt: IsNull(),
      },
    });

    // Excluir a relação direta
    await this.repo.softDelete(id);

    // Se encontrou a relação inversa, excluí-la também
    if (inverseRelation) {
      await this.repo.softDelete(inverseRelation.id);
    }

    return true;
  }

  /**
   * Retorna o histórico completo de alterações de vizinhança para uma área específica,
   * incluindo registros excluídos
   * @param areaId ID da área para buscar o histórico
   * @returns Lista de registros de vizinhança com informações sobre criação, atualização e exclusão
   */
  async getAreaNeighborHistory(areaId: string) {
    // Buscar todas as relações onde a área é a principal ou a vizinha, incluindo excluídas
    const relations = await this.repo
      .createQueryBuilder("areaNeighbor")
      .leftJoinAndSelect("areaNeighbor.area", "area")
      .leftJoinAndSelect("areaNeighbor.neighborArea", "neighborArea")
      .leftJoinAndSelect("areaNeighbor.createdByUser", "createdByUser")
      .leftJoinAndSelect("areaNeighbor.updatedByUser", "updatedByUser")
      .where("(areaNeighbor.areaId = :areaId)")
      .withDeleted() // Incluir registros excluídos
      .setParameter("areaId", areaId)
      .orderBy("areaNeighbor.createdAt", "DESC")
      .getMany();

    // Processar os resultados para incluir informações sobre o status (criado, atualizado, excluído)
    const history: (AreaNeighbor & {
      eventType: string;
      eventDate: Date;
      eventUser: User;
    })[] = [];
    relations.forEach((relation) => {
      // Determinar o tipo de evento (criação, atualização, exclusão)
      let eventType = "created";
      let eventDate = relation.createdAt;
      let eventUser = relation.createdByUser;

      if (relation.deletedAt) {
        // Não temos usuário que excluiu, então usamos o último que atualizou
        history.push({
          ...relation,
          eventType: "deleted",
          eventDate: relation.deletedAt,
          eventUser: relation.updatedByUser || relation.createdByUser,
        });
      } else {
        if (relation.updatedAt > relation.createdAt) {
          eventType = "updated";
          eventDate = relation.updatedAt;
          if (relation.updatedByUser) {
            eventUser = relation.updatedByUser;
          }
        }
      }

      history.push({
        ...relation,
        eventType,
        eventDate,
        eventUser,
      });
    });
    return history.sort(
      (a, b) => b.eventDate.getTime() - a.eventDate.getTime()
    );
  }
}
