package org.kaopiz.order.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import org.kaopiz.order.model.OrderEntity

@ApplicationScoped
class OrderRepository : PanacheRepository<OrderEntity>
