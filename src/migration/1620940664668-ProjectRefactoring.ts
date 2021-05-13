import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

export class ProjectRefactoring1620940664668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hourlyColumnOptions: TableColumnOptions = {
      name: "hourly",
      type: "numeric (8,2)",
      default: "0.00",
    };
    const unitsColumnOptions: TableColumnOptions = {
      name: "units",
      type: "numeric (8,2)",
      default: "1.00",
    };
    const markupColumnOptions: TableColumnOptions = {
      name: "markup",
      type: "numeric (8,2)",
      default: "0.00",
    };
    const hourlyColumn = new TableColumn(hourlyColumnOptions);
    const unitsColumn = new TableColumn(unitsColumnOptions);
    const markupColumn = new TableColumn(markupColumnOptions);
    await queryRunner.addColumn("project", hourlyColumn);
    await queryRunner.addColumn("project", unitsColumn);
    await queryRunner.addColumn("project", markupColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("project", "hourly");
    await queryRunner.dropColumn("project", "units");
    await queryRunner.dropColumn("project", "markup");
  }
}
