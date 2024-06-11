package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.CommentRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.productModels.Comment;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.services.CommentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentServicesImp implements CommentServices {

	private final ProductRepository productRepository;

	@Autowired
	public CommentServicesImp(ProductRepository productRepository){
		this.productRepository = productRepository;
	}

	// fn: check user have comment ?
	private Boolean checkAuthorComment(List<Comment> commentList, String idAuthor) {
		return commentList.stream()
				.anyMatch(comment -> comment.getIdAuthor().equals(idAuthor));
	}

	// fn: id comment
	private int idComment(List<Comment> commentList) {
		return commentList.stream()
				.mapToInt(Comment::getId)
				.max()
				.orElse(0) + 1; // Return 0 if the list is empty
	}

	// fn: tính rate
	private Product tinhRate(Product product, List<Comment> commentList) {
		double averageRate = commentList.stream()
				.mapToInt(Comment::getRate)
				.average()
				.orElse(0.0);
		product.setRates(averageRate);
		return product;
	}

	@Override
	public MessageResponse createComment(CommentRequest commentRequest){
		MessageResponse messageResponse = new MessageResponse();
		try{
			Product product = productRepository.findById(commentRequest.getIdProduct()).orElse(null);
			if(product == null){
				messageResponse.setCode(1);
				messageResponse.setMessage("Product not found");
				return messageResponse;
			}

			List<Comment> listComment = product.getComment();
			if(checkAuthorComment(listComment, commentRequest.getIdAuthor())){
				messageResponse.setCode(2);
				messageResponse.setMessage("Đã bình luận không được bình luận tiếp");
				return messageResponse;
			}

			Comment newComment = new Comment();
			int id = idComment(listComment);
			newComment.setIdAuthor(commentRequest.getIdAuthor());
			newComment.setAuthor(commentRequest.getAuthor());
			newComment.setContent(commentRequest.getContent());
			newComment.setRate(commentRequest.getRate());
			newComment.setTime(new Date());
			newComment.setId(id);

			listComment.add(newComment); // Add comment
			product.setComment(listComment); // Update comment list
			product = tinhRate(product, listComment); // Update rate
			productRepository.save(product);

			messageResponse.setCode(0);
			messageResponse.setMessage("success");
		} catch (Exception ex){
			messageResponse.setCode(-1);
			messageResponse.setMessage("Lỗi Server: " + ex.getMessage());
		}
		return messageResponse;
	}

	@Override
	public MessageDataResponse getComment(String id){
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try{
			Product product = productRepository.findById(id).orElse(null);
			if(product == null){
				messageDataResponse.setCode(1);
				messageDataResponse.setMessage("Product not found");
				return messageDataResponse;
			}
			messageDataResponse.setCode(0);
			messageDataResponse.setMessage("success");
			messageDataResponse.setData(product.getComment());
		}catch (Exception exception){
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Error server: "+ exception.getMessage());
		}
		return messageDataResponse;
	}

	@Override
	public MessageResponse deleteComment(String idProduct, int idComment) {
		MessageResponse messageResponse = new MessageResponse();
		try {
			Product product = productRepository.findById(idProduct).orElse(null);
			if (product == null) {
				messageResponse.setCode(1);
				messageResponse.setMessage("Product not found");
				return messageResponse;
			}

			List<Comment> commentList = product.getComment();
			boolean removed = commentList.removeIf(comment -> comment.getId() == idComment);

			if (!removed) {
				messageResponse.setCode(2);
				messageResponse.setMessage("Comment not found");
				return messageResponse;
			}

			product.setComment(commentList); // Update comment list
			product = tinhRate(product, commentList); // Update rate
			productRepository.save(product);

			messageResponse.setCode(0);
			messageResponse.setMessage("Comment deleted successfully");
		} catch (Exception ex) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Server Error: " + ex.getMessage());
		}
		return messageResponse;
	}
}
