package org.kaopiz.user.dto

import jakarta.validation.constraints.Positive

data class UpdateUserDTO(
    val customerName: String? = null,
    val productName: String? = null,
    @field:Positive(message = "Quantity must be greater than 0")
    val quantity: Int? = null,
)
