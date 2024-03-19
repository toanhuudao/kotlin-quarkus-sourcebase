package org.kaopiz.user.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.jboss.logging.Logger
import org.kaopiz.user.dto.CreateUserDTO
import org.kaopiz.user.dto.DetailUserDTO
import org.kaopiz.user.model.UserEntity
import org.kaopiz.user.repository.UserRepository
import org.mindrot.jbcrypt.BCrypt

@ApplicationScoped
class UserService(private val userRepository: UserRepository) {
    private val log: Logger = Logger.getLogger(UserService::class.java)

    @Transactional
    fun createUser(createUserDto: CreateUserDTO): DetailUserDTO {
        val newUser =
            UserEntity().apply {
                this.username = createUserDto.username
                this.email = createUserDto.email
                this.password = hashPassword(createUserDto.password)
            }
        userRepository.persist(newUser)

        return DetailUserDTO(
            id = newUser.id!!,
            email = newUser.email!!,
            username = newUser.username!!,
        )
    }

    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    fun checkPassword(
        plainPassword: String,
        hashedPassword: String,
    ): Boolean {
        return BCrypt.checkpw(plainPassword, hashedPassword)
    }
}
