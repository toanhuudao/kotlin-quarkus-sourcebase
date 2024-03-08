package org.kaopiz.healthcheck
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.health.HealthCheck
import org.eclipse.microprofile.health.HealthCheckResponse
import org.eclipse.microprofile.health.Liveness

@Liveness
@ApplicationScoped
class SimpleLivenessCheck : HealthCheck {
    override fun call(): HealthCheckResponse {
        return HealthCheckResponse.named("simple-liveness-check").up().build()
    }
}
