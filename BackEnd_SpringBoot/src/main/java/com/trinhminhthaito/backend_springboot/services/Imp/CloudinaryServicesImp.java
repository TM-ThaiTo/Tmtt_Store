package com.trinhminhthaito.backend_springboot.services.Imp;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.CloudinaryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServicesImp implements CloudinaryServices {

	private final Cloudinary cloudinary;

	@Autowired
	public CloudinaryServicesImp(Cloudinary cloudinary) {
		this.cloudinary = cloudinary;
	}

	// fn: up ảnh avatar product
	@Override
	public String uploadImageProductAvatar(String avtBase64, String code) {
		try {
			if (avtBase64 != null && !avtBase64.isEmpty() &&
					(avtBase64.startsWith("data:image/jpeg;base64,") ||
							avtBase64.startsWith("data:image/png;base64,") ||
							avtBase64.startsWith("data:image/gif;base64,") ||
							avtBase64.startsWith("data:image/webp;base64,"))) {

				String[] parts = avtBase64.split(",");
				String base64Content = parts[1];
				String folderPath = "products/" + code;
				Map<String, Object> uploadParams = ObjectUtils.asMap("folder", folderPath);
				byte[] decodedBytes = Base64.getDecoder().decode(base64Content);
				Map<String, Object> uploadResult = cloudinary.uploader().upload(decodedBytes, uploadParams);
				return (String) uploadResult.get("secure_url");
			} else {
				return "Invalid base64 format";
			}
		} catch (IOException e) {
			return "Error uploading image to server";
		}
	}

	// Upload Image Catalogs
	@Override
	public List<String> uploadImageCatalogs(List<String> catalogs, String code) {
		List<String> imageUrls = new ArrayList<>();
		try {
			if (catalogs != null && catalogs.stream().count() > 0) {
				String folderPath = "products/" + code + "/catalogs";

				for (String avtBase64 : catalogs) {
					if (avtBase64 != null && !avtBase64.isEmpty() &&
							(avtBase64.startsWith("data:image/jpeg;base64,") ||
									avtBase64.startsWith("data:image/png;base64,") ||
									avtBase64.startsWith("data:image/gif;base64,") ||
									avtBase64.startsWith("data:image/webp;base64,"))) {

						String[] parts = avtBase64.split(",");
						String base64Content = parts[1];

						Map<String, Object> uploadParams = ObjectUtils.asMap(
								"folder", folderPath
						);

						byte[] decodedBytes = Base64.getDecoder().decode(base64Content);
						Map<String, Object> uploadResult = cloudinary.uploader().upload(decodedBytes, uploadParams);

						imageUrls.add((String) uploadResult.get("secure_url"));
					} else {
						imageUrls.add("Invalid base64 format");
					}
				}
			}
			return imageUrls;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	// Upload Image Description
	@Override
	public String uploadImageDesc(String imageBase64, String code) {
		try {
			if (imageBase64 != null && !imageBase64.isEmpty() &&
					(imageBase64.startsWith("data:image/jpeg;base64,") ||
							imageBase64.startsWith("data:image/png;base64,") ||
							imageBase64.startsWith("data:image/gif;base64,") ||
							imageBase64.startsWith("data:image/webp;base64,"))) {

				String[] parts = imageBase64.split(",");
				String base64Content = parts[1];

				String folderPath = "products/" + code + "/desc";

				Map<String, Object> uploadParams = ObjectUtils.asMap(
						"folder", folderPath
				);

				byte[] decodedBytes = Base64.getDecoder().decode(base64Content);
				Map<String, Object> uploadResult = cloudinary.uploader().upload(decodedBytes, uploadParams);

				return (String) uploadResult.get("secure_url");
			} else {
				return "Invalid base64 format";
			}
		} catch (IOException e) {
			return "Error uploading image to server";
		}
	}

	// Delete folder khi xoá Product
	// Xóa thư mục và tất cả các hình ảnh và thư mục con trong đó từ Cloudinary
	@Override
	public MessageResponse deleteFolder(String folderPath) {
		MessageResponse messageResponse =new MessageResponse();
		try {
			// Thực hiện xóa thư mục và tất cả các tài nguyên con từ Cloudinary
			Map<String, String> deleteResult = cloudinary.api().deleteResourcesByPrefix(folderPath, ObjectUtils.emptyMap());

			// Trả về kết quả xóa
			messageResponse.setCode(0);
			messageResponse.setMessage(deleteResult.get("result"));
		} catch (IOException e) {
			messageResponse.setCode(-1);
			messageResponse.setMessage(e.getMessage());
		} catch (Exception ex) {
			messageResponse.setCode(-2);
			messageResponse.setMessage(ex.getMessage());
		}
		return messageResponse;
	}
}
