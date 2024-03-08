package org.kaopiz.orderservice.dto

import kotlinx.serialization.Serializable

@Serializable
data class PaginatedResponse<T>(
        val data: List<T>,
        val page: Int,
        val size: Int,
        val total: Long
)