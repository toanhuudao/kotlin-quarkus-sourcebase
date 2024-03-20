import io.smallrye.jwt.build.Jwt
import jakarta.enterprise.context.ApplicationScoped
import java.time.Duration
import java.time.Instant

@ApplicationScoped
class JwtService {
    fun generateToken(
        username: String,
        permissionsByScreen: Map<String, List<String>>,
    ): String {
        val expiration = Instant.now().plus(Duration.ofHours(1))

        val jwt =
            Jwt.issuer("issuer-name")
                .upn(username)
                .groups("user")
                .claim("permissionsByScreen", permissionsByScreen)
                .expiresAt(expiration)
        return jwt.sign()
    }
}
