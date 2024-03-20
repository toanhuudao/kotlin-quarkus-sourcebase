@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.kaopiz

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.kaopiz.i18n.LanguageManager

@Path("/hello")
class GreetingResource {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    fun hello(): String {
        return LanguageManager.getMessage("hello")
    }
}
