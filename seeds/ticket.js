/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ticket').del()
  await knex('ticket').insert([
    {draw_id: 1, email: 'john@email.com', number_selected: 1234567890, status: 'WON'},
    {draw_id: 1, email: 'mary@email.com', number_selected: 1234567890, status: 'WON'},
    {draw_id: 2, email: 'tom@email.com', number_selected: 3456789012, status: 'LOST'},
    {draw_id: 3, email: 'tony@email.com', number_selected: 9999987654, status: 'WON'},
  ]);
};
