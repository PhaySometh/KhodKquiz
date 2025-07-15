export const getRolePrivileges = async (req, res) => {
    try {
        const sequelize = req.db;

        const grantee = req.query.grantee;

        const results = await sequelize.query(
            `
            SELECT grantee, table_schema, table_name, privilege_type
            FROM information_schema.role_table_grants
            WHERE grantee = :grantee
            `,
            {
                replacements: { grantee },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Error in getRolePrivileges:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateRolePrivileges = async (req, res) => {
    try {
        const sequelize = req.db;
        const { roleName, privileges } = req.body;

        if (!roleName || !Array.isArray(privileges)) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const transaction = await sequelize.transaction();

        try {
            // 1. Get all distinct tables from current privileges
            const allTables = await sequelize.query(
                `
                SELECT DISTINCT table_schema, table_name
                FROM information_schema.role_table_grants
                WHERE grantee = :roleName
                `,
                {
                    replacements: { roleName },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                }
            );

            // 2. Revoke all privileges on each table
            for (const { table_schema, table_name } of allTables) {
                await sequelize.query(
                    `REVOKE ALL PRIVILEGES ON TABLE "${table_schema}"."${table_name}" FROM "${roleName}"`,
                    { transaction }
                );
            }

            // 3. Grant selected privileges
            for (const { table_schema, table_name, privilege_type } of privileges) {
                await sequelize.query(
                    `GRANT ${privilege_type} ON TABLE "${table_schema}"."${table_name}" TO "${roleName}"`,
                    { transaction }
                );
            }

            await transaction.commit();
            return res.status(200).json({ success: true, message: 'Privileges updated successfully' });
        } catch (err) {
            await transaction.rollback();
            console.error('Error updating privileges:', err);
            return res.status(500).json({ success: false, message: 'Failed to update privileges' });
        }
    } catch (error) {
        console.error('Error in updateRolePrivileges:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};