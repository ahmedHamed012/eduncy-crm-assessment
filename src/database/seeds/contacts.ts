import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('contacts').del();

  // Insert seed entries
  const contacts = Array.from({ length: 50 }).map(() => ({
    id: uuidv4(),
    first_name: `FirstName${Math.floor(Math.random() * 1000)}`,
    last_name: `LastName${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    company: `Company${Math.floor(Math.random() * 100)}`,
    balance: (Math.random() * 1000).toFixed(2),
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await knex('contacts').insert(contacts);
}
