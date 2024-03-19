package org.kaopiz.user.dto

data class UserResponseDTO(
    val id: Long,
    val customerName: String,
    val productName: String,
    val quantity: Int,
)
