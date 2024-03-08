package org.kaopiz.orderservice.dto

data class ListOrderDTO(
        val orders: List<OrderSummaryDTO>
)

data class OrderSummaryDTO(
        val id: Long,
        val customerName: String,
        val productName: String,
        val quantity: Int
)
