package org.kaopiz.orderservice.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.kaopiz.orderservice.model.OrderEntity
import org.kaopiz.orderservice.repository.OrderRepository


@ApplicationScoped
class OrderService(private val orderRepository: OrderRepository) {

    fun getAllOrders() = orderRepository.findAll().list()

    fun getOrderById(id: Long): OrderEntity? = orderRepository.findById(id)

    @Transactional
    fun createOrder(order: OrderEntity): OrderEntity {
        orderRepository.persist(order)
        return order
    }

    @Transactional
    fun updateOrder(id: Long, updatedOrder: OrderEntity): OrderEntity? {
        val order = getOrderById(id)
        if (order != null) {
            order.customerName = updatedOrder.customerName
            order.productName = updatedOrder.productName
            order.quantity = updatedOrder.quantity
            return order
        }
        return null
    }

    @Transactional
    fun deleteOrder(id: Long): Boolean {
        return orderRepository.deleteById(id)
    }
}
