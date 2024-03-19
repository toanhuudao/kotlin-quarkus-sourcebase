package org.kaopiz.order.dto

import org.kaopiz.user.dto.OrderSummaryDTO

data class ListOrderDTO(
    val orders: List<OrderSummaryDTO>,
)

data class OrderSummaryDTO(
    val id: Long,
    val customerName: String,
    val productName: String,
    val quantity: Int,
)
