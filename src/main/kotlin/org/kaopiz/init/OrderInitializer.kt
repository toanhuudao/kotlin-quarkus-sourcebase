package org.kaopiz.init

import io.quarkus.runtime.StartupEvent
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.transaction.Transactional
import org.kaopiz.orderservice.model.OrderEntity

@ApplicationScoped
class OrderInitializer {
    @Transactional
    fun onStart(@Observes ev: StartupEvent?) {
        if (OrderEntity.count() == 0L) {
            val order1 = OrderEntity().apply {
                customerName = "John Doe"
                productName = "Apple iPhone"
                quantity = 2
            }
            order1.persist()

            val order2 = OrderEntity().apply {
                customerName = "Jane Doe"
                productName = "Samsung Galaxy"
                quantity = 1
            }
            order2.persist()
        }
    }
}
