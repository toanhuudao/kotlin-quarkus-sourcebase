package org.kaopiz.orderservice.dto

import java.time.LocalDateTime

data class DetailOrderDTO(
        val id: Long,
        val customerName: String,
        val productName: String,
        val quantity: Int,
        val orderDate: LocalDateTime
)
