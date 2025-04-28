import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Plant } from "./Plant";
import { Equipment } from "./Equipment";
import { AreaNeighbor } from "./AreaNeighbor";

@Entity()
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    locationDescription!: string;

    @ManyToOne(() => Plant, plant => plant.areas)
    plant?: Plant;

    @Column()
    plantId!: string;

    @OneToMany(() => Equipment, equipment => equipment.area)
    equipment?: Equipment[];

    @OneToMany(() => AreaNeighbor, neighbor => neighbor.area)
    neighbors?: AreaNeighbor[];

    @OneToMany(() => AreaNeighbor, neighbor => neighbor.neighborArea)
    neighborOf?: AreaNeighbor[];

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
} 