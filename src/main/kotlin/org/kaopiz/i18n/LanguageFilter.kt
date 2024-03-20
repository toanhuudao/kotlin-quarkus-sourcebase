package org.kaopiz.i18n

import jakarta.annotation.Priority
import jakarta.ws.rs.Priorities
import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.container.ContainerRequestFilter
import jakarta.ws.rs.ext.Provider

@Provider
@Priority(Priorities.HEADER_DECORATOR)
class LanguageFilter : ContainerRequestFilter {
    override fun filter(requestContext: ContainerRequestContext) {
        val language = requestContext.getHeaderString("Accept-Language") ?: "en"
        LanguageManager.setLanguage(language)
    }
}
