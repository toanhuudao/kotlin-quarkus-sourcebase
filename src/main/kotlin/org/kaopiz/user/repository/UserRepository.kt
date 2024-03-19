package org.kaopiz.user.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import org.kaopiz.user.model.UserEntity

@ApplicationScoped
class UserRepository : PanacheRepository<UserEntity>
