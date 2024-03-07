package org.kaopiz.orderservice.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import org.kaopiz.orderservice.model.OrderEntity

@ApplicationScoped
class OrderRepository : PanacheRepository<OrderEntity>
