import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from "typeorm";
import { Equipment } from "./Equipment";
import { Area } from "./Area";
import { User } from "./User";

@Entity()
export class EquipmentArea {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Equipment)
  equipment!: Equipment;

  @Column()
  equipmentId!: string;

  @ManyToOne(() => Area)
  area!: Area;

  @Column()
  areaId!: string;

  @ManyToOne(() => User)
  createdByUser!: User;

  @Column()
  createdByUserId!: string;

  @ManyToOne(() => User)
  updatedByUser?: User;

  @Column()
  updatedByUserId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
