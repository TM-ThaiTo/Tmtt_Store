package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.CommentRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.CommentResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.CommentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {

	private final CommentServices commentServices;

	@Autowired
	public CommentController(CommentServices commentServices) {
		this.commentServices = commentServices;
	}

	// api: tạo mới 1 comment
	@PostMapping("/create")
	public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
		MessageResponse messageResponse = commentServices.createComment(commentRequest);
		return ResponseEntity.ok(messageResponse);
	}

	// api: get comment với id Product
	@GetMapping("/read")
	public ResponseEntity<?> getCommentByIdProduct(@RequestParam String id) {
		CommentResponse messageDataResponse = commentServices.getComment(id);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: delete comment
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteComment(@RequestParam String idProduct, @RequestParam int id) {
		MessageResponse messageResponse = commentServices.deleteComment(idProduct, id);
		return ResponseEntity.ok(messageResponse);
	}
}
