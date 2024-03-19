package org.kaopiz.order.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive

data class CreateOrderDTO(
    @field:NotBlank(message = "Customer name is required")
    val customerName: String,
    @field:NotBlank(message = "Product name is required")
    val productName: String,
    @field:Positive(message = "Quantity must be greater than 0")
    val quantity: Int,
)
