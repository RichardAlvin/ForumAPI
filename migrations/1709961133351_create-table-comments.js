/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        threadId: {
            type: 'varchar(50)',
            references: 'threads',
            onDelete: 'cascade',
            notNull: false,
        },
        // ownerId: {
        //     type: 'varchar(50)',
        //     references: 'users',
        //     onDelete: 'cascade',
        //     notNull: false,
        // },
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
    pgm.dropTable('comments');
};
