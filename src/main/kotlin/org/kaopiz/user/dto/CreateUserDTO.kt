package org.kaopiz.user.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateUserDTO(
    @field:NotBlank(message = "username.required")
    @field:Size(min = 6, message = "username.min_length")
    val username: String,
    @field:NotBlank(message = "email.required")
    @field:Email(message = "email.invalid")
    val email: String,
    @field:NotBlank(message = "password.required")
    @field:Size(min = 6, message = "password.min_length")
    val password: String,
)
