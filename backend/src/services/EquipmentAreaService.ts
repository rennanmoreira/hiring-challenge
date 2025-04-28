import { EquipmentArea } from "../models/EquipmentArea";
import { DatabaseContext } from "../config/database-context";
import { Repository, IsNull, Not } from "typeorm";
import { ExpressRequestWithUser } from "../middleware/authentication";
import { ApiError } from "../utils/ApiError";

export class EquipmentAreaService {
  private equipmentAreaRepository: Repository<EquipmentArea>;

  constructor() {
    this.equipmentAreaRepository =
      DatabaseContext.getInstance().getRepository(EquipmentArea);
  }

  async create(data: Partial<EquipmentArea>, request: ExpressRequestWithUser) {
    if (!request.user || !request.user.id) {
      throw ApiError.unauthorized("User not authenticated");
    }
    if (!data.equipmentId || !data.areaId) {
      throw ApiError.validation(
        "Equipment ID and area ID are required",
        { equipmentId: !data.equipmentId ? "Required" : undefined, 
          areaId: !data.areaId ? "Required" : undefined }
      );
    }

    const existingRelation = await this.equipmentAreaRepository.findOne({
      where: {
        equipmentId: data.equipmentId,
        areaId: data.areaId,
        deletedAt: IsNull(),
      },
    });

    if (existingRelation) {
      throw ApiError.conflict(
        "This equipment-area relationship already exists",
        { equipmentId: data.equipmentId, areaId: data.areaId }
      );
    }

    const equipmentRepo =
      DatabaseContext.getInstance().getRepository("Equipment");
    const areaRepo = DatabaseContext.getInstance().getRepository("Area");
    const areaNeighborRepo =
      DatabaseContext.getInstance().getRepository("AreaNeighbor");

    const equipment = await equipmentRepo.findOne({
      where: { id: data.equipmentId },
    });
    const area = await areaRepo.findOne({ where: { id: data.areaId } });

    if (!equipment) {
      throw ApiError.validation("Equipment does not exist", { equipmentId: data.equipmentId });
    }

    if (!area) {
      throw ApiError.validation("Area does not exist", { areaId: data.areaId });
    }

    const existingEquipmentAreas = await this.equipmentAreaRepository.find({
      where: {
        equipmentId: data.equipmentId,
        deletedAt: IsNull(),
      },
    });

    if (existingEquipmentAreas.length > 0) {
      let isNeighbor = false;

      for (const equipmentArea of existingEquipmentAreas) {
        const neighborRelation = await areaNeighborRepo.findOne({
          where: [
            {
              areaId: data.areaId,
              neighborAreaId: equipmentArea.areaId,
              deletedAt: IsNull(),
            },
            {
              areaId: equipmentArea.areaId,
              neighborAreaId: data.areaId,
              deletedAt: IsNull(),
            },
          ],
        });

        if (neighborRelation) {
          isNeighbor = true;
          break;
        }
      }

      if (!isNeighbor) {
        throw ApiError.validation(
          "Equipment can only be associated with neighboring areas",
          { equipmentId: data.equipmentId, areaId: data.areaId, existingAreas: existingEquipmentAreas.map(ea => ea.areaId) }
        );
      }
    }

    // Adiciona automaticamente o usuário que está criando a relação
    const entity = this.equipmentAreaRepository.create({
      equipmentId: data.equipmentId,
      areaId: data.areaId,
      createdByUserId: request.user.id,
      updatedByUserId: request.user.id,
    });
    return this.equipmentAreaRepository.save(entity);
  }

  async findAll() {
    return this.equipmentAreaRepository.find({
      relations: ["equipment", "area", "createdByUser", "updatedByUser"],
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: string) {
    const relation = await this.equipmentAreaRepository.findOne({
      relations: ["equipment", "area", "createdByUser", "updatedByUser"],
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!relation) {
      throw ApiError.notFound("Equipment-area relationship not found", { id });
    }

    return relation;
  }

  async findByEquipmentId(equipmentId: string) {
    return this.equipmentAreaRepository.find({
      relations: ["equipment", "area", "createdByUser", "updatedByUser"],
      where: {
        equipmentId,
        deletedAt: IsNull(),
      },
    });
  }

  async findByAreaId(areaId: string) {
    return this.equipmentAreaRepository.find({
      relations: ["equipment", "area", "createdByUser", "updatedByUser"],
      where: {
        areaId,
        deletedAt: IsNull(),
      },
    });
  }

  async update(
    id: string,
    data: Partial<EquipmentArea>,
    request: ExpressRequestWithUser
  ) {
    if (!request.user || !request.user.id) {
      throw new Error("User not found");
    }

    const relation = await this.findById(id);

    if (
      (data.equipmentId && data.equipmentId !== relation.equipmentId) ||
      (data.areaId && data.areaId !== relation.areaId)
    ) {
      const newEquipmentId = data.equipmentId || relation.equipmentId;
      const newAreaId = data.areaId || relation.areaId;

      const existingRelation = await this.equipmentAreaRepository.findOne({
        where: {
          equipmentId: newEquipmentId,
          areaId: newAreaId,
          id: Not(id),
          deletedAt: IsNull(),
        },
      });

      if (existingRelation) {
        throw ApiError.conflict(
          "This equipment-area relationship already exists",
          { equipmentId: data.equipmentId, areaId: data.areaId }
        );
      }

      if (data.equipmentId) {
        const equipmentRepo =
          DatabaseContext.getInstance().getRepository("Equipment");
        const equipment = await equipmentRepo.findOne({
          where: { id: data.equipmentId },
        });
        if (!equipment) {
          throw ApiError.validation("Equipment does not exist", { equipmentId: data.equipmentId });
        }
      }

      if (data.areaId) {
        const areaRepo = DatabaseContext.getInstance().getRepository("Area");
        const areaNeighborRepo =
          DatabaseContext.getInstance().getRepository("AreaNeighbor");
        const area = await areaRepo.findOne({ where: { id: data.areaId } });
        if (!area) {
          throw ApiError.validation("Area does not exist", { areaId: data.areaId });
        }

        const equipmentId = data.equipmentId || relation.equipmentId;

        const otherEquipmentAreas = await this.equipmentAreaRepository.find({
          where: {
            equipmentId,
            id: Not(id),
            deletedAt: IsNull(),
          },
        });

        if (otherEquipmentAreas.length > 0) {
          // Verificar se a nova área é vizinha de pelo menos uma das outras áreas do equipamento
          let isNeighbor = false;

          for (const equipmentArea of otherEquipmentAreas) {
            // Buscar relação de vizinhança entre a nova área e a área existente
            const neighborRelation = await areaNeighborRepo.findOne({
              where: [
                {
                  areaId: data.areaId,
                  neighborAreaId: equipmentArea.areaId,
                  deletedAt: IsNull(),
                },
                {
                  areaId: equipmentArea.areaId,
                  neighborAreaId: data.areaId,
                  deletedAt: IsNull(),
                },
              ],
            });

            if (neighborRelation) {
              isNeighbor = true;
              break;
            }
          }

          if (!isNeighbor) {
            throw ApiError.validation(
              "Equipment can only be associated with neighboring areas",
              { equipmentId, areaId: data.areaId, existingAreas: otherEquipmentAreas.map(ea => ea.areaId) }
            );
          }
        }
      }
    }

    Object.assign(relation, {
      equipmentId: data.equipmentId || relation.equipmentId,
      areaId: data.areaId || relation.areaId,
      updatedByUserId: request.user.id,
    });
    return this.equipmentAreaRepository.save(relation);
  }

  async delete(id: string) {
    const relation = await this.findById(id);

    const equipmentAreas = await this.equipmentAreaRepository.count({
      where: {
        equipmentId: relation.equipmentId,
        deletedAt: IsNull(),
      },
    });

    if (equipmentAreas <= 1) {
      throw ApiError.validation(
        "Cannot remove the last area from an equipment. Equipment must have at least one area.",
        { equipmentId: relation.equipmentId, remainingAreas: equipmentAreas }
      );
    }

    return this.equipmentAreaRepository.softDelete(id);
  }
}
