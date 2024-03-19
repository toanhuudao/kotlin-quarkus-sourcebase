package org.kaopiz.orderservice.model

import io.quarkus.hibernate.orm.panache.kotlin.PanacheCompanion
import io.quarkus.hibernate.orm.panache.kotlin.PanacheEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "Orders")
class OrderEntity : PanacheEntity() {
    companion object : PanacheCompanion<OrderEntity> {
        fun byName(name: String) = list("name", name)
    }

    @Column(name = "customer_name")
    lateinit var customerName: String

    @Column(name = "product_name")
    lateinit var productName: String

    @Column(name = "quantity")
    var quantity: Int = 0
}
