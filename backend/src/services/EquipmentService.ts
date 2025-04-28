import { Equipment } from "../models/Equipment";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError } from "typeorm";
import { ApiError } from "../utils/ApiError";

export class EquipmentService {
    private equipmentRepository: Repository<Equipment>;

    constructor() {
        this.equipmentRepository = DatabaseContext.getInstance().getRepository(Equipment);
    }

    public async findAll(): Promise<Equipment[]> {
        return this.equipmentRepository.find({
            relations: ["area", "parts"]
        });
    }

    public async findById(id: string): Promise<Equipment> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id },
            relations: ["area", "parts"]
        });
        if (!equipment) {
            throw ApiError.notFound("Equipment not found", { id });
        }
        return equipment;
    }

    public async create(data: Omit<Equipment, "id" | "createdAt" | "updatedAt">): Promise<Equipment> {
        try {
            const equipment = this.equipmentRepository.create(data);
            const savedEquipment = await this.equipmentRepository.save(equipment);
            return this.equipmentRepository.findOne({
                where: { id: savedEquipment.id },
                relations: ["area"]
            }) as Promise<Equipment>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw ApiError.validation("Invalid area ID", { areaId: data.areaId, error: error.message });
            }
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid equipment data", { data, error: error.message });
            }
            throw error;
        }
    }

    public async update(id: string, data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>): Promise<Equipment> {
        try {
            const equipment = await this.equipmentRepository.findOne({ 
                where: { id },
                relations: ["area"]
            });
            if (!equipment) {
                throw ApiError.notFound("Equipment not found", { id });
            }

            Object.assign(equipment, data);
            await this.equipmentRepository.save(equipment);
            return this.equipmentRepository.findOne({
                where: { id: equipment.id },
                relations: ["area"]
            }) as Promise<Equipment>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw ApiError.validation("Invalid area ID", { areaId: data.areaId, error: error.message });
            }
            if (error instanceof QueryFailedError) {
                throw ApiError.validation("Invalid equipment data", { data, error: error.message });
            }
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        // Buscar equipamento com suas partes
        const equipment = await this.equipmentRepository.findOne({ 
            where: { id },
            relations: ["parts"]
        });
        
        if (!equipment) {
            throw ApiError.notFound("Equipment not found", { id });
        }

        // Verificar se o equipamento possui partes associadas
        if (equipment.parts && equipment.parts.length > 0) {
            const partNames = equipment.parts.map(part => part.name);
            throw ApiError.dependencyConflict(
                "Cannot delete equipment with associated parts", 
                { 
                    equipmentId: id, 
                    equipmentName: equipment.name,
                    dependentParts: partNames,
                    partCount: equipment.parts.length 
                }
            );
        }

        try {
            await this.equipmentRepository.remove(equipment);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw ApiError.dependencyConflict(
                    "Cannot delete equipment due to database constraints", 
                    { error: error.message }
                );
            }
            throw error;
        }
    }
} 