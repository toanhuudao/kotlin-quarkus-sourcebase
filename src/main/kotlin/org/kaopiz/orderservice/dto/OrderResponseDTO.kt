package org.kaopiz.orderservice.dto

import kotlinx.serialization.Serializable

@Serializable
data class OrderResponseDTO(
        val id: Long,
        val customerName: String,
        val productName: String,
        val quantity: Int
)
