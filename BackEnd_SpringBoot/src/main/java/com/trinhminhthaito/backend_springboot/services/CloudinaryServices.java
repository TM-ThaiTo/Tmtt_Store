package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

import java.util.List;

public interface CloudinaryServices {
	String uploadImageProductAvatar(String base64, String code);
	List<String> uploadImageCatalogs(List<String> base64, String code);
	String uploadImageDesc(String base64, String code);
	MessageResponse deleteFolder(String folder);
}
