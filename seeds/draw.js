/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('draw').del()
  await knex('draw').insert([
    {status: 'end', number_drawn: '1234567'},
    {status: 'end', number_drawn: '2345678'},
    {status: 'end', number_drawn: '3456789'}
  ]);
};
