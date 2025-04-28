import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEquipmentArea1745792677309 implements MigrationInterface {
    name = 'AddEquipmentArea1745792677309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "equipment_area" ("id" varchar PRIMARY KEY NOT NULL, "equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`CREATE TABLE "temporary_equipment_area" ("id" varchar PRIMARY KEY NOT NULL, "equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_a2400abdd75322f143b9409dbbc" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b1a2a1204c1352ac82e9090637c" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_231424276d2071307750990f91c" FOREIGN KEY ("createdByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f2069de69c1ae38fd1891ef8c72" FOREIGN KEY ("updatedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_equipment_area"("id", "equipmentId", "areaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt") SELECT "id", "equipmentId", "areaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt" FROM "equipment_area"`);
        await queryRunner.query(`DROP TABLE "equipment_area"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment_area" RENAME TO "equipment_area"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipment_area" RENAME TO "temporary_equipment_area"`);
        await queryRunner.query(`CREATE TABLE "equipment_area" ("id" varchar PRIMARY KEY NOT NULL, "equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "equipment_area"("id", "equipmentId", "areaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt") SELECT "id", "equipmentId", "areaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt" FROM "temporary_equipment_area"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment_area"`);
        await queryRunner.query(`DROP TABLE "equipment_area"`);
    }

}
