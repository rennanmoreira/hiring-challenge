import { Area } from "../models/Area";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError } from "typeorm";
import { ApiError } from "../utils/ApiError";

export class AreaService {
    private areaRepository: Repository<Area>;

    constructor() {
        this.areaRepository = DatabaseContext.getInstance().getRepository(Area);
    }

    public async findAll(): Promise<Area[]> {
        return this.areaRepository.find({
            relations: ["plant", "equipment", "equipment.parts"]
        });
    }

    public async findById(id: string): Promise<Area> {
        const area = await this.areaRepository.findOne({
            where: { id },
            relations: ["plant", "equipment", "equipment.parts"]
        });
        if (!area) {
            throw ApiError.notFound("Area not found", { id });
        }
        return area;
    }

    public async create(data: Pick<Area, "name" | "locationDescription" | "plantId">): Promise<Area> {
        try {
            const area = this.areaRepository.create(data);
            const savedArea = await this.areaRepository.save(area);
            return this.areaRepository.findOne({
                where: { id: savedArea.id },
                relations: ["plant"]
            }) as Promise<Area>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw ApiError.validation("Invalid plant ID", { plantId: data.plantId, error: error.message });
            }
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid area data", { data, error: error.message });
            }
            throw error;
        }
    }

    public async update(id: string, data: Partial<Pick<Area, "name" | "locationDescription">>): Promise<Area> {
        try {
            const area = await this.areaRepository.findOne({ 
                where: { id },
                relations: ["plant"]
            });
            if (!area) {
                throw ApiError.notFound("Area not found", { id });
            }

            Object.assign(area, data);
            await this.areaRepository.save(area);
            return this.areaRepository.findOne({
                where: { id: area.id },
                relations: ["plant"]
            }) as Promise<Area>;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid area data", { data, error: error.message });
            }
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        // Buscar área com equipamentos e vizinhos associados
        const area = await this.areaRepository.findOne({ 
            where: { id },
            relations: ["equipment", "neighbors", "neighborOf"]
        });
        
        if (!area) {
            throw ApiError.notFound("Area not found", { id });
        }

        // Verificar se a área possui equipamentos associados
        if (area.equipment && area.equipment.length > 0) {
            const equipmentNames = area.equipment.map(eq => eq.name);
            throw ApiError.dependencyConflict(
                "Cannot delete area with associated equipment", 
                { 
                    areaId: id, 
                    areaName: area.name,
                    dependentEquipment: equipmentNames,
                    equipmentCount: area.equipment.length 
                }
            );
        }

        // Verificar se a área possui relacionamentos de vizinhança
        const hasNeighborRelationships = 
            (area.neighbors && area.neighbors.length > 0) || 
            (area.neighborOf && area.neighborOf.length > 0);

        if (hasNeighborRelationships) {
            const neighborCount = (area.neighbors?.length || 0) + (area.neighborOf?.length || 0);
            throw ApiError.dependencyConflict(
                "Cannot delete area with neighbor relationships", 
                { 
                    areaId: id, 
                    areaName: area.name,
                    neighborCount: neighborCount
                }
            );
        }

        try {
            await this.areaRepository.remove(area);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.dependencyConflict(
                    "Cannot delete area due to database constraints", 
                    { error: error.message }
                );
            }
            throw error;
        }
    }
} 