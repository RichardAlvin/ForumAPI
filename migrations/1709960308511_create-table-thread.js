/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true
        },
        ownerId: {
            type: 'varchar(50)',
            references: 'users',
            onDelete: 'cascade',
            notNull: false,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    })
};

exports.down = (pgm) => {
    pgm.dropTable('threads');
};