import jakarta.inject.Inject
import jakarta.ws.rs.FormParam
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

@Path("/auth")
class TokenResource {
    @Inject
    lateinit var jwtService: JwtService

    @POST
    @Path("/login")
    @Produces(MediaType.TEXT_PLAIN)
    fun login(
        @FormParam("username") username: String,
        @FormParam("password") password: String,
    ): String {
        val permissionsByScreen =
            mapOf(
                "listScreen" to listOf("create", "update"),
                "paymentScreen" to listOf("list"),
            )

        val token = jwtService.generateToken("user1", permissionsByScreen)
        println("JWT Token: $token")

        return token
    }
}
