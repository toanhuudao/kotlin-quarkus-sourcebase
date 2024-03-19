package org.kaopiz.order.dto

data class OrderResponseDTO(
    val id: Long,
    val customerName: String,
    val productName: String,
    val quantity: Int,
)
