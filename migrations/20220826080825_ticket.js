/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('ticket', t => {
        t.increments('id')
        t.integer('draw_id').references('id').inTable('draw')
        t.string('email')
        t.string('number_selected')
        t.string('status')
        t.unique(['draw_id', 'email']);
    })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('ticket')
};
