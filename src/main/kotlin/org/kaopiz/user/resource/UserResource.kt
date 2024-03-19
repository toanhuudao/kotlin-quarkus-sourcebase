@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.kaopiz.user.resource

import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.kaopiz.user.dto.CreateUserDTO
import org.kaopiz.user.service.UserService

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class UserResource(private val userService: UserService) {
    @POST
    fun createUser(createUserDTO: CreateUserDTO): Response {
        val newUser = userService.createUser(createUserDTO)
        return Response.status(Response.Status.CREATED).entity(newUser).build()
    }
}
