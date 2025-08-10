import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAccessTokenColumn1754807366392
  implements MigrationInterface
{
  name = 'UpdateAccessTokenColumn1754807366392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "accessToken" TO "accessTokenEncrypted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "accessTokenEncrypted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "accessTokenEncrypted" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "accessTokenEncrypted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "accessTokenEncrypted" character varying(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "accessTokenEncrypted" TO "accessToken"`,
    );
  }
}
