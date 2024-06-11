package com.trinhminhthaito.backend_springboot.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
	private String idProduct;
	private String idAuthor;
	private String author;
	private String content;
	private int rate;
}
