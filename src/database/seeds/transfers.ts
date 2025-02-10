import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('transfers').del();

  // Get all contacts
  const contacts = await knex('contacts').select('id');

  if (contacts.length < 2) {
    console.error('Not enough contacts to create transfers');
    return;
  }

  // Insert seed entries
  const transfers = Array.from({ length: 50 }).map(() => {
    let from_contact, to_contact;
    do {
      from_contact = contacts[Math.floor(Math.random() * contacts.length)].id;
      to_contact = contacts[Math.floor(Math.random() * contacts.length)].id;
    } while (from_contact === to_contact);

    return {
      id: uuidv4(),
      from_contact_id: from_contact,
      to_contact_id: to_contact,
      amount: (Math.random() * 500).toFixed(2),
      created_at: new Date(),
    };
  });

  await knex('transfers').insert(transfers);
}
