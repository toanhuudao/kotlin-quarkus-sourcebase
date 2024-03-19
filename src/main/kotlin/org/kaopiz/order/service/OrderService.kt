package org.kaopiz.order.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.jboss.logging.Logger
import org.kaopiz.order.dto.CreateOrderDTO
import org.kaopiz.order.dto.OrderResponseDTO
import org.kaopiz.order.dto.PaginatedResponse
import org.kaopiz.order.dto.UpdateOrderDTO
import org.kaopiz.order.model.OrderEntity
import org.kaopiz.order.repository.OrderRepository

@ApplicationScoped
class OrderService(private val orderRepository: OrderRepository) {
    private val log: Logger = Logger.getLogger(OrderService::class.java)

    fun getAllOrders(
        page: Int,
        size: Int,
    ): PaginatedResponse<OrderResponseDTO> {
        val startIndex = (page - 1) * size
        val orders = orderRepository.findAll().page(startIndex, size).list()
        val totalOrders = orderRepository.count()
        val orderDTOs = orders.map { order -> toOrderResponseDTO(order) }
        return PaginatedResponse(orderDTOs, page, size, totalOrders)
    }

    fun getOrderById(id: Long): OrderEntity? = orderRepository.findById(id)

    @Transactional
    fun createOrder(createOrderDTO: CreateOrderDTO): OrderResponseDTO {
        val order = fromCreateOrderDTO(createOrderDTO)
        orderRepository.persist(order)
        log.info("Order created: $order")
        return toOrderResponseDTO(order)
    }

    @Transactional
    fun updateOrder(
        id: Long,
        updatedOrder: UpdateOrderDTO,
    ): OrderResponseDTO? {
        val order = getOrderById(id)
        if (order != null) {
            order.customerName = updatedOrder.customerName ?: order.customerName
            order.productName = updatedOrder.productName ?: order.productName
            order.quantity = updatedOrder.quantity ?: order.quantity
            log.info("Order updated: $order")
            return toOrderResponseDTO(order)
        }
        log.warn("Order with ID: $id not found for update")
        return null
    }

    @Transactional
    fun deleteOrder(id: Long): Boolean {
        val isDeleted = orderRepository.deleteById(id)
        if (isDeleted) {
            log.info("Order with ID: $id deleted successfully")
        } else {
            log.warn("Order with ID: $id not found for deletion")
        }
        return isDeleted
    }

    fun toCreateOrderDTO(orderEntity: OrderEntity): CreateOrderDTO {
        return CreateOrderDTO(
            customerName = orderEntity.customerName,
            productName = orderEntity.productName,
            quantity = orderEntity.quantity,
        )
    }

    fun fromCreateOrderDTO(createOrderDTO: CreateOrderDTO): OrderEntity {
        return OrderEntity().apply {
            customerName = createOrderDTO.customerName
            productName = createOrderDTO.productName
            quantity = createOrderDTO.quantity
        }
    }

    private fun toOrderResponseDTO(orderEntity: OrderEntity): OrderResponseDTO {
        val x =
            OrderResponseDTO(
                id = orderEntity.id!!,
                customerName = orderEntity.customerName,
                productName = orderEntity.productName,
                quantity = orderEntity.quantity,
            )

        return x
    }
}
