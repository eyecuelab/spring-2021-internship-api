/**
 *  see https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
 *  except you don't need to install the cli, just use
 * `npx typeorm migration:create -n <WhatMigrationDoes>`
 *  */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

export class UserRefactoring1618961501384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnOptions: TableColumnOptions = {
      name: 'email',
      type: 'text',
      isUnique: true,
      default: "'example@email.com'",
    };
    const emailColumn = new TableColumn(columnOptions);
    await queryRunner.addColumn('user', emailColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'email');
  }
}
