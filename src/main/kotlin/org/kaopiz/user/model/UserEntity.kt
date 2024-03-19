package org.kaopiz.user.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.kaopiz.common.BaseEntity

@Entity
@Table(
    name = "users",
//    indexes = [
//        Index(name = "idx_user_username", columnList = "username"),
//        Index(name = "idx_user_email", columnList = "email"),
//    ],
)
class UserEntity : BaseEntity() {
    @Column(name = "username", unique = true)
    var username: String? = null

    @Column(name = "email", unique = true)
    var email: String? = null

    @Column(name = "password")
    var password: String? = null
}
