import {MigrationInterface, QueryRunner} from "typeorm";

export class init1620805495013 implements MigrationInterface {
    name = 'init1620805495013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenId" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "imgUrl" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenId" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tokens"("id", "tokenId", "createdAt", "userId") SELECT "id", "tokenId", "createdAt", "userId" FROM "tokens"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`ALTER TABLE "temporary_tokens" RENAME TO "tokens"`);
        await queryRunner.query(`CREATE TABLE "temporary_boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, CONSTRAINT "FK_1ce74d5411749b559748b9f3276" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "boards"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`ALTER TABLE "temporary_boards" RENAME TO "boards"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boards" RENAME TO "temporary_boards"`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" varchar PRIMARY KEY NOT NULL, "data" text, "meta" text, "access" text array, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "boards"("id", "data", "meta", "access", "createdAt", "updatedAt", "userId") SELECT "id", "data", "meta", "access", "createdAt", "updatedAt", "userId" FROM "temporary_boards"`);
        await queryRunner.query(`DROP TABLE "temporary_boards"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME TO "temporary_tokens"`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenId" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "tokens"("id", "tokenId", "createdAt", "userId") SELECT "id", "tokenId", "createdAt", "userId" FROM "temporary_tokens"`);
        await queryRunner.query(`DROP TABLE "temporary_tokens"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
