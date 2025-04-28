import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAreaNeighbor1745792621529 implements MigrationInterface {
    name = 'AddAreaNeighbor1745792621529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "area_neighbor" ("id" varchar PRIMARY KEY NOT NULL, "areaId" varchar NOT NULL, "neighborAreaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`CREATE TABLE "temporary_area_neighbor" ("id" varchar PRIMARY KEY NOT NULL, "areaId" varchar NOT NULL, "neighborAreaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_7b2f42220600b5334c8a9daf24c" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6dc78b0db96f8239e6772e93bf0" FOREIGN KEY ("neighborAreaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3992c90eb13ce8c933e5eff5b59" FOREIGN KEY ("createdByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_823795c1baafda79eccd361edbc" FOREIGN KEY ("updatedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_area_neighbor"("id", "areaId", "neighborAreaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt") SELECT "id", "areaId", "neighborAreaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt" FROM "area_neighbor"`);
        await queryRunner.query(`DROP TABLE "area_neighbor"`);
        await queryRunner.query(`ALTER TABLE "temporary_area_neighbor" RENAME TO "area_neighbor"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area_neighbor" RENAME TO "temporary_area_neighbor"`);
        await queryRunner.query(`CREATE TABLE "area_neighbor" ("id" varchar PRIMARY KEY NOT NULL, "areaId" varchar NOT NULL, "neighborAreaId" varchar NOT NULL, "createdByUserId" varchar NOT NULL, "updatedByUserId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "area_neighbor"("id", "areaId", "neighborAreaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt") SELECT "id", "areaId", "neighborAreaId", "createdByUserId", "updatedByUserId", "createdAt", "updatedAt", "deletedAt" FROM "temporary_area_neighbor"`);
        await queryRunner.query(`DROP TABLE "temporary_area_neighbor"`);
        await queryRunner.query(`DROP TABLE "area_neighbor"`);
    }

}
