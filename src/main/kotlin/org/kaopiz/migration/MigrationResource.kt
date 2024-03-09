import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.Response
import org.flywaydb.core.Flyway

@Path("/migration")
class MigrationResource {
    @Inject
    lateinit var flyway: Flyway

    @GET
    @Path("")
    fun migrate(): Response {
        val migrations = flyway.migrate()
        return Response.ok("Migrations applied: ${migrations.migrationsExecuted}").build()
    }
}
