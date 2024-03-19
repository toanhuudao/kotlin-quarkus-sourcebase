package org.kaopiz.user.dto

class ListUserDTO(
    val orders: List<OrderSummaryDTO>,
)

data class OrderSummaryDTO(
    val id: Long,
    val customerName: String,
    val productName: String,
    val quantity: Int,
)
