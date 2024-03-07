package org.kaopiz.orderservice.resource

import jakarta.ws.rs.*
import org.kaopiz.orderservice.model.OrderEntity
import org.kaopiz.orderservice.service.OrderService

import java.net.URI;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class OrderResource(private val orderService: OrderService) {

    @GET
    fun getAllOrders() = orderService.getAllOrders()

    @GET
    @Path("/{id}")
    fun getOrderById(@PathParam("id") id: Long): OrderEntity? = orderService.getOrderById(id)

    @POST
    fun createOrder(order: OrderEntity): OrderEntity = orderService.createOrder(order)

    @PUT
    @Path("/{id}")
    fun updateOrder(@PathParam("id") id: Long, order: OrderEntity): OrderEntity? = orderService.updateOrder(id, order)

    @DELETE
    @Path("/{id}")
    fun deleteOrder(@PathParam("id") id: Long): Boolean = orderService.deleteOrder(id)
}
