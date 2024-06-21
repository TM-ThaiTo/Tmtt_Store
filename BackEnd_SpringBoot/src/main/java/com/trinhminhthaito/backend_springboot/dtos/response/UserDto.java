package com.trinhminhthaito.backend_springboot.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
	private String id;
	private String email;
	private String fullName;
	private Date birthDay;
	private String authType;
	private int gender;
	private String address;
}
