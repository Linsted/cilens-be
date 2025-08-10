import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1754153737638 implements MigrationInterface {
  name = 'CreateUserTable1754153737638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "githubId" character varying(64) NOT NULL, "username" character varying(255) NOT NULL, "accessToken" character varying(500) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_42148de213279d66bf94b363bf" ON "users" ("githubId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42148de213279d66bf94b363bf"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
