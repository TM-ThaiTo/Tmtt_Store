package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.InfoUserRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.UserServices;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

	private final UserServices userServices;

	public UserController(UserServices userServices) {
		this.userServices = userServices;
	}

	// api: update User
	@Transactional
	@GetMapping("/update")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<MessageResponse> updateUser(@RequestBody InfoUserRequest dto){
		MessageResponse messageResponse = userServices.updateUser(dto);
		return ResponseEntity.ok(messageResponse);
	}
}
