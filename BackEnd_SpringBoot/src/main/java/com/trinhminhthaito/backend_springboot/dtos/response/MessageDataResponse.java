package com.trinhminhthaito.backend_springboot.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageDataResponse {
	int code;
	String message;
	Object data;
	private Number count;
}
