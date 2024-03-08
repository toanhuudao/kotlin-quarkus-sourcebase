package org.kaopiz.orderservice.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive
import kotlinx.serialization.Serializable

@Serializable
data class CreateOrderDTO(
        @field:NotBlank(message = "Customer name is required")
        val customerName: String,

        @field:NotBlank(message = "Product name is required")
        val productName: String,

        @field:Positive(message = "Quantity must be greater than 0")
        val quantity: Int
)
