import {MigrationInterface, QueryRunner} from "typeorm";

export class removeToken1620832814428 implements MigrationInterface {
    name = 'removeToken1620832814428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "boards"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`ALTER TABLE "temporary_boards" RENAME TO "boards"`);
        await queryRunner.query(`CREATE TABLE "temporary_boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "boards"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`ALTER TABLE "temporary_boards" RENAME TO "boards"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boards" RENAME TO "temporary_boards"`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "temporary_boards"`);
        await queryRunner.query(`DROP TABLE "temporary_boards"`);
        await queryRunner.query(`ALTER TABLE "boards" RENAME TO "temporary_boards"`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "temporary_boards"`);
        await queryRunner.query(`DROP TABLE "temporary_boards"`);
    }

}
