import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('contacts', (table) => {
      table.uuid('id').unique().notNullable().primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      // table.string('email').unique().notNullable();
      table.string('email').notNullable();
      table.string('company').notNullable();
      table.decimal('balance').notNullable().defaultTo(0.0);
      table.jsonb('history').defaultTo([]);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.string('created_at').notNullable().defaultTo(new Date().getTime());
      table.string('updated_at').notNullable().defaultTo(new Date().getTime());
    })
    .createTable('transfers', (table) => {
      table.uuid('id').unique().notNullable().primary().defaultTo(uuidv4());
      table
        .uuid('from_contact_id')
        .references('id')
        .inTable('contacts')
        .notNullable()
        .onDelete('CASCADE');
      table
        .uuid('to_contact_id')
        .references('id')
        .inTable('contacts')
        .notNullable()
        .onDelete('CASCADE');
      table.decimal('amount').notNullable().checkPositive();
      table.string('created_at').notNullable().defaultTo(new Date().getTime());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transfers').dropTable('contacts');
}
