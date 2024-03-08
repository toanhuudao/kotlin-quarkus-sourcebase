package org.kaopiz.orderservice.dto

import jakarta.validation.constraints.Positive
import kotlinx.serialization.Serializable

@Serializable
data class UpdateOrderDTO(
        val customerName: String? = null,
        val productName: String? = null,
        @field:Positive(message = "Quantity must be greater than 0")
        val quantity: Int? = null
)
