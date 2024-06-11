package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.request.CommentRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

public interface CommentServices {
	MessageResponse createComment(CommentRequest commentRequest);
	MessageDataResponse getComment(String id);
	MessageResponse deleteComment(String idProduct, int id);
}
