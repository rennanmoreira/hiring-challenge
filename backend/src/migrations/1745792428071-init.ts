import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745792428071 implements MigrationInterface {
    name = 'Init1745792428071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "part" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL DEFAULT ('mechanical'), "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "installationDate" date NOT NULL, "equipmentId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "area" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "locationDescription" varchar NOT NULL, "plantId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "plant" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "address" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_part" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL DEFAULT ('mechanical'), "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "installationDate" date NOT NULL, "equipmentId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_81a77b358baac63794a45618222" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_part"("id", "name", "type", "manufacturer", "serialNumber", "installationDate", "equipmentId", "createdAt", "updatedAt") SELECT "id", "name", "type", "manufacturer", "serialNumber", "installationDate", "equipmentId", "createdAt", "updatedAt" FROM "part"`);
        await queryRunner.query(`DROP TABLE "part"`);
        await queryRunner.query(`ALTER TABLE "temporary_part" RENAME TO "part"`);
        await queryRunner.query(`CREATE TABLE "temporary_equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment" RENAME TO "equipment"`);
        await queryRunner.query(`CREATE TABLE "temporary_area" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "locationDescription" varchar NOT NULL, "plantId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_e3964d97d9242c9b40f15cee3e1" FOREIGN KEY ("plantId") REFERENCES "plant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_area"("id", "name", "locationDescription", "plantId", "createdAt", "updatedAt") SELECT "id", "name", "locationDescription", "plantId", "createdAt", "updatedAt" FROM "area"`);
        await queryRunner.query(`DROP TABLE "area"`);
        await queryRunner.query(`ALTER TABLE "temporary_area" RENAME TO "area"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area" RENAME TO "temporary_area"`);
        await queryRunner.query(`CREATE TABLE "area" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "locationDescription" varchar NOT NULL, "plantId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "area"("id", "name", "locationDescription", "plantId", "createdAt", "updatedAt") SELECT "id", "name", "locationDescription", "plantId", "createdAt", "updatedAt" FROM "temporary_area"`);
        await queryRunner.query(`DROP TABLE "temporary_area"`);
        await queryRunner.query(`ALTER TABLE "equipment" RENAME TO "temporary_equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "temporary_equipment"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment"`);
        await queryRunner.query(`ALTER TABLE "part" RENAME TO "temporary_part"`);
        await queryRunner.query(`CREATE TABLE "part" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL DEFAULT ('mechanical'), "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "installationDate" date NOT NULL, "equipmentId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "part"("id", "name", "type", "manufacturer", "serialNumber", "installationDate", "equipmentId", "createdAt", "updatedAt") SELECT "id", "name", "type", "manufacturer", "serialNumber", "installationDate", "equipmentId", "createdAt", "updatedAt" FROM "temporary_part"`);
        await queryRunner.query(`DROP TABLE "temporary_part"`);
        await queryRunner.query(`DROP TABLE "plant"`);
        await queryRunner.query(`DROP TABLE "area"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TABLE "part"`);
    }

}
