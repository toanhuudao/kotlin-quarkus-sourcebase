package org.kaopiz.healthcheck
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.health.HealthCheck
import org.eclipse.microprofile.health.HealthCheckResponse
import org.eclipse.microprofile.health.Readiness

@Readiness
@ApplicationScoped
class SimpleReadinessCheck : HealthCheck {
    override fun call(): HealthCheckResponse {
        // Add your readiness check logic here
        return HealthCheckResponse.named("simple-readiness-check").up().build()
    }
}
