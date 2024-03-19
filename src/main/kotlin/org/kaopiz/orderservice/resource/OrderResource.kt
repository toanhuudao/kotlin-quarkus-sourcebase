@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.kaopiz.orderservice.resource

import jakarta.annotation.security.RolesAllowed
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.kaopiz.orderservice.dto.CreateOrderDTO
import org.kaopiz.orderservice.dto.OrderResponseDTO
import org.kaopiz.orderservice.dto.PaginatedResponse
import org.kaopiz.orderservice.dto.UpdateOrderDTO
import org.kaopiz.orderservice.service.OrderService
import java.net.URI

@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class OrderResource(private val orderService: OrderService) {
    @GET
    @RolesAllowed("user")
    @Consumes(MediaType.APPLICATION_JSON)
    fun getAllOrders(
        @QueryParam("page") @DefaultValue("1") page: Int,
        @QueryParam("size") @DefaultValue("10") size: Int,
    ): PaginatedResponse<OrderResponseDTO> {
        return orderService.getAllOrders(page, size)
    }

    @GET
    @Path("/{id}")
    fun getOrderById(
        @PathParam("id") id: Long,
    ): Response {
        val order =
            orderService.getOrderById(
                id,
            ) ?: throw NotFoundException("Order with ID $id not found")
        return Response.ok(order).build()
    }

    @POST
    fun createOrder(
        @Valid createOrderDTO: CreateOrderDTO,
    ): Response {
        val createdOrder = orderService.createOrder(createOrderDTO)
        return Response.created(
            URI.create("/orders/${createdOrder.id}"),
        ).entity(createdOrder).build()
    }

    @PUT
    @Path("/{id}")
    fun updateOrder(
        @PathParam("id") id: Long,
        @Valid updatedOrderDTO: UpdateOrderDTO,
    ): Response {
        val updatedOrder =
            orderService.updateOrder(
                id,
                updatedOrderDTO,
            ) ?: throw NotFoundException("Order with ID $id not found")
        return Response.ok(updatedOrder).build()
    }

    @DELETE
    @Path("/{id}")
    fun deleteOrder(
        @PathParam("id") id: Long,
    ): Response {
        val isDeleted = orderService.deleteOrder(id)
        if (!isDeleted) {
            throw NotFoundException("Order with ID $id not found")
        }
        return Response.noContent().build()
    }
}
