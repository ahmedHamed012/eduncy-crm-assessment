import { Injectable } from '@nestjs/common';
import * as knex from '../../database/db-singleton-connection';

@Injectable()
export class SqlService {
  constructor() {}

  async insert(tableName: string, payload: any) {
    return knex.default(tableName).insert(payload);
  }
  //----------------------------------------------------------------------------------------

  async update(tableName: string, payload: any, whereClause: any) {
    return knex.default(tableName).where(whereClause).update(payload);
  }
  //----------------------------------------------------------------------------------------

  async deleteSelected(tableName: string, whereClause: any) {
    return knex.default(tableName).where(whereClause).update({
      is_deleted: true,
    });
  }
  //----------------------------------------------------------------------------------------

  async select(tableName: string, attributesArray: string[], whereClause: any) {
    return knex.default
      .select(attributesArray)
      .from(tableName)
      .where({ ...whereClause, is_deleted: false });
  }
  //----------------------------------------------------------------------------------------

  async selectAll(
    tableName: string,
    attributesArray: string[],
    whereClause: any,
  ) {
    return knex.default
      .select(attributesArray)
      .from(tableName)
      .where(whereClause);
  }
  //----------------------------------------------------------------------------------------

  async checkExistenceRecord(tableName: string, whereClause: any) {
    const query = await knex.default
      .select(['*'])
      .from(tableName)
      .where(whereClause);
    return query.length > 0 ? true : false;
  }
  //----------------------------------------------------------------------------------------
}
