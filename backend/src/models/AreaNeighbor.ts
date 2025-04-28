import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from "typeorm";
import { Area } from "./Area";
import { User } from "./User";

@Entity()
export class AreaNeighbor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Area)
  area!: Area;

  @Column()
  areaId!: string;

  @ManyToOne(() => Area)
  neighborArea!: Area;

  @Column()
  neighborAreaId!: string;

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
