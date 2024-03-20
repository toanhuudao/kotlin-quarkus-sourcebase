package org.kaopiz.i18n

import jakarta.validation.ConstraintViolationException
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider

@Provider
class ValidationExceptionMapper : ExceptionMapper<ConstraintViolationException> {
    override fun toResponse(exception: ConstraintViolationException): Response {
        val errors =
            exception.constraintViolations.associate { violation ->
                val messageKey = violation.messageTemplate
                val message =
                    if (LanguageManager.hasMessage(messageKey)) {
                        LanguageManager.getMessage(messageKey)
                    } else {
                        messageKey
                    }
                message to violation.invalidValue
            }

        return Response.status(Response.Status.BAD_REQUEST).entity(errors).build()
    }
}
