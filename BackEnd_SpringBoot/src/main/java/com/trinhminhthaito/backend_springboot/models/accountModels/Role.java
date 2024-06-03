package com.trinhminhthaito.backend_springboot.models.accountModels;

import com.fasterxml.jackson.databind.annotation.JsonAppend;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.el.stream.Stream;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Role {
	@Id
	private String id;
	private String name;

	public enum Vales{
		USER,
		ADMIN,
	}
}
