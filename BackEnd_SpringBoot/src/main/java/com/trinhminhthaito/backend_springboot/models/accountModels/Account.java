package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Account {
	@Id
	private String id;
	private String username;
	private String password;
	private Set<String> roles;
	private String googleId = "";
	private String authType = "";
	private int failedLoginTimes = 0;
	private String refreshToken = "";
}
