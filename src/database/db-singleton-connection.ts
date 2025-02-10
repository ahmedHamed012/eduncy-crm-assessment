import knex, { Knex } from 'knex';
import knexConfig from '../config/knex_orm/knex.config';

class Database {
  private static instance: Database;
  private connection: Knex;

  private constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = knex(knexConfig);
    Database.instance = this;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getConnection(): Knex {
    return this.connection;
  }
}

export default Database.getInstance().getConnection();
