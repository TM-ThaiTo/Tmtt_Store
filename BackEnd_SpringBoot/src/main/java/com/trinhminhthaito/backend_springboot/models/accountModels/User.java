package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class User {
	private String accountId;
	private String fullName;
	private LocalDateTime dateOfBirth;
	private int gender;
	private String address;

	@DBRef
	private Account account;
}
