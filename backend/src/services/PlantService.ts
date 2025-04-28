import { Plant } from "../models/Plant";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError } from "typeorm";
import { ApiError } from "../utils/ApiError";

export class PlantService {
    private plantRepository: Repository<Plant>;

    constructor() {
        this.plantRepository = DatabaseContext.getInstance().getRepository(Plant);
    }

    public async findAll(): Promise<Plant[]> {
        return this.plantRepository.find({
            relations: ["areas", "areas.equipment"]
        });
    }

    public async findById(id: string): Promise<Plant> {
        const plant = await this.plantRepository.findOne({
            where: { id },
            relations: ["areas", "areas.equipment"]
        });
        if (!plant) {
            throw ApiError.notFound("Plant not found", { id });
        }
        return plant;
    }

    public async create(data: Pick<Plant, "name" | "address">): Promise<Plant> {
        try {
            const plant = this.plantRepository.create(data);
            return await this.plantRepository.save(plant);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid plant data", { error: error.message, data });
            }
            throw error;
        }
    }

    public async update(id: string, data: Partial<Pick<Plant, "name" | "address">>): Promise<Plant> {
        const plant = await this.plantRepository.findOne({ where: { id } });
        if (!plant) {
            throw ApiError.notFound("Plant not found", { id });
        }

        try {
            Object.assign(plant, data);
            return await this.plantRepository.save(plant);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid plant data", { error: error.message, data });
            }
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        const plant = await this.plantRepository.findOne({ 
            where: { id },
            relations: ["areas"]
        });
        if (!plant) {
            throw ApiError.notFound("Plant not found", { id });
        }

        // Verificar se a planta possui áreas associadas antes de tentar excluir
        if (plant.areas && plant.areas.length > 0) {
            const areaNames = plant.areas.map(area => area.name);
            throw ApiError.dependencyConflict(
                "Cannot delete plant with associated areas", 
                { 
                    plantId: id, 
                    plantName: plant.name,
                    dependentAreas: areaNames,
                    areaCount: plant.areas.length 
                }
            );
        }

        try {
            await this.plantRepository.remove(plant);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.dependencyConflict(
                    "Cannot delete plant due to database constraints", 
                    { error: error.message }
                );
            }
            throw error;
        }
    }
} 