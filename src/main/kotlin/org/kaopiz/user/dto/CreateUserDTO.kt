package org.kaopiz.user.dto

import jakarta.validation.constraints.NotBlank

data class CreateUserDTO(
    @field:NotBlank(message = "username is required")
    val username: String,
    @field:NotBlank(message = "email is required")
    val email: String,
    @field:NotBlank(message = "password is required")
    val password: String,
)
