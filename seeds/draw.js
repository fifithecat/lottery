/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('draw').del()
  await knex('draw').insert([
    {status: 'CLOSE', number_drawn: '1234567890'},
    {status: 'CLOSE', number_drawn: '2345678901'},
    {status: 'OPEN'}
  ]);
};
