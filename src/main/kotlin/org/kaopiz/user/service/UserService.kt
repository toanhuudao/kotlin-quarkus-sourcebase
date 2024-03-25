package org.kaopiz.user.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.jboss.logging.Logger
import org.kaopiz.user.dto.CreateUserDTO
import org.kaopiz.user.dto.DetailUserDTO
import org.kaopiz.user.model.UserEntity
import org.kaopiz.user.repository.UserRepository
import org.mindrot.jbcrypt.BCrypt
import java.sql.SQLException

@ApplicationScoped
class UserService(private val userRepository: UserRepository) {
    private val log: Logger = Logger.getLogger(UserService::class.java)

    @Transactional
    fun createUser(createUserDto: CreateUserDTO): DetailUserDTO {
        try {
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
        } catch (e: SQLException) {
            log.error("Error occurred while persisting user: ${e.message}")
            throw Exception("Error occurred while persisting user", e)
        }
    }

    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    fun checkPassword(
        plainPassword: String,
        hashedPassword: String,
    ): Boolean {
        val isPasswordCorrect = BCrypt.checkpw(plainPassword, hashedPassword)
        log.debug("Password check result: $isPasswordCorrect")
        return isPasswordCorrect
    }
}
