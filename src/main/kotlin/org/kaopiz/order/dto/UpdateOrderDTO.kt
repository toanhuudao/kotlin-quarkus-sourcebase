package org.kaopiz.order.dto

import jakarta.validation.constraints.Positive

data class UpdateOrderDTO(
    val customerName: String? = null,
    val productName: String? = null,
    @field:Positive(message = "Quantity must be greater than 0")
    val quantity: Int? = null,
)
