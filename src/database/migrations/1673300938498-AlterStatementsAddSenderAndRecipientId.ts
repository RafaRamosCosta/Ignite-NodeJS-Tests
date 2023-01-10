import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterStatementsAddSenderAndRecipientId1673300938498
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("statements", [
      new TableColumn({ name: "recipient_id", type: "uuid", isNullable: true }),
      new TableColumn({ name: "sender_id", type: "uuid", isNullable: true }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "recipient_id");
    await queryRunner.dropColumn("statements", "sender_id");
  }
}
