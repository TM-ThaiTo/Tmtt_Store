package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Account {
	@Id
	private String id;
	private String username;
	private String password;
	private Role role;

	private String googleId;
	private String authType;
	private int failedLoginTimes;
	private String refreshToken;
}
