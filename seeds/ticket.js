/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ticket').del()
  await knex('ticket').insert([
    {draw_id: 1, email: 'mock@email.com', number_selected: 1234567890, status: 'WON'},
    {draw_id: 1, email: 'mock2@email.com', number_selected: 1234567890, status: 'WON'},
    {draw_id: 1, email: 'mock3@email.com', number_selected: 3456789012, status: 'LOST'}
  ]);
};
