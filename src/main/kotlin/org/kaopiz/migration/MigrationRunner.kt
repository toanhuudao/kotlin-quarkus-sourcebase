package org.kaopiz.migration

import org.flywaydb.core.Flyway

object MigrationRunner {
    @JvmStatic
    fun main(args: Array<String>) {
        val flyway =
            Flyway.configure()
                .dataSource(
                    "jdbc:postgresql://localhost:5433/test-ecommerce",
                    "admin",
                    "123456aA@",
                )
                .load()
        flyway.migrate()
    }
}
