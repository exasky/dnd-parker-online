package com.exasky.dnd.liquibase;

import liquibase.change.custom.CustomTaskChange;
import liquibase.database.Database;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.CustomChangeException;
import liquibase.exception.DatabaseException;
import liquibase.exception.SetupException;
import liquibase.exception.ValidationErrors;
import liquibase.resource.ResourceAccessor;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Liquibase1587720426093 implements CustomTaskChange {
    @Override
    public void execute(Database database) throws CustomChangeException {
        JdbcConnection connection = (JdbcConnection) database.getConnection();
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT * FROM layer_element")) {
            while (resultSet.next()) {
                String type = resultSet.getString("type");
                if (type.contains("DOOR") || type.contains("TRAP")) {
                    try (Statement deleteStatement = connection.createStatement()) {
                        deleteStatement.executeUpdate("DELETE FROM layer_element " +
                                "WHERE id = " + resultSet.getLong("id"));
                    }
                }
            }
        } catch (SQLException | DatabaseException throwables) {
            throwables.printStackTrace();
        }
    }

    @Override
    public String getConfirmationMessage() {
        return null;
    }

    @Override
    public void setUp() throws SetupException {
        /*
         * Implementation mandatory but not useful here
         */
    }

    @Override
    public void setFileOpener(ResourceAccessor resourceAccessor) {
        /*
         * Implementation mandatory but not useful here
         */
    }

    @Override
    public ValidationErrors validate(Database database) {
        return null;
    }
}
