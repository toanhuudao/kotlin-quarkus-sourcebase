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
        // Thiết lập thời gian hết hạn là 1 giờ kể từ thời điểm hiện tại
        val expiration = Instant.now().plus(Duration.ofHours(1))

        val jwt =
            Jwt.issuer("issuer-name")
                .upn(username)
                .groups("user")
                .claim("permissionsByScreen", permissionsByScreen)
                .expiresAt(expiration)

        // Ký và trả về token
        return jwt.sign()
    }
}
