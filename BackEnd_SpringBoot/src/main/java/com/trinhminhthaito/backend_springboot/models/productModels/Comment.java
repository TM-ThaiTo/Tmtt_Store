package com.trinhminhthaito.backend_springboot.models.productModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
	private int id;
	private String idAuthor;
	private String author;
	private String content;
	private int rate;
	private Date time;
}
