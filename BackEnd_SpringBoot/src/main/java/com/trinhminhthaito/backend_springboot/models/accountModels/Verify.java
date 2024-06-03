package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Verify {
	private String email;
	private String code;
	private LocalDateTime dateCreated;
}
