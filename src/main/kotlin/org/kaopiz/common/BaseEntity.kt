@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.kaopiz.common

import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.*
import java.time.LocalDateTime

@MappedSuperclass
abstract class BaseEntity : PanacheEntityBase() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long? = null

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    open var createdAt: LocalDateTime? = null

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    open var updatedAt: LocalDateTime? = null

    @PrePersist
    protected fun onCreate() {
        createdAt = LocalDateTime.now()
        updatedAt = LocalDateTime.now()
    }

    @PreUpdate
    protected fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
