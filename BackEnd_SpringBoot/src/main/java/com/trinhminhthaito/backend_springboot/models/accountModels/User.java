package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class User {
	private String id;
	private String accountId;
	private String fullName;
	private Date dateOfBirth;
	private int gender;
	private String address;
	@DBRef
	private Account account;
	private List<Address> deliveryAddress = new ArrayList<>();
}
