package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.MailServices;
import com.trinhminhthaito.backend_springboot.services.VerifyServices;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServicesImp implements MailServices {

	private final JavaMailSender mailSender;
	private final VerifyServices verifyServices;

	@Value("${spring.mail.username}")
	private String fromMail;

	@Autowired
	private MailServicesImp(JavaMailSender mailSender, VerifyServices verifyServices) {
		this.mailSender = mailSender;
		this.verifyServices = verifyServices;
	}

	// header Mail
	String headerHtmlMail = "<h1 style='color: #4c649b; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px'> TMTT Store<br /></h1>";

	// footer Mail
	String footerHtmlVerifyMail = "<h3 style='color: red'> Chú ý: Không đưa mã này cho bất kỳ ai, có thể dẫn đến mất tài khoản.<br />Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.</h3><h1>Cảm ơn.</h1>";

	// fn: html send verify
	private String generateVerificationEmail(String token) {
		return String.format(
				"<div>" +
						"%s" +
						"<h2 style=\"padding: 10px 0; margin-bottom: 10px;\">" +
						"Xin chào anh (chị),<br />" +
						"Mã xác nhận đăng ký tài khoản cho website TMTT Store của anh (chị).<br />" +
						"Cảm ơn vì đã ghé thăm TMTT Store &lt;3" +
						"</h2>" +
						"<h3 style=\"background: #eee;padding: 10px;\">" +
						"<i><b>%s</b></i>" +
						"</h3>" +
						"%s" +
						"</div>",
				headerHtmlMail, token, footerHtmlVerifyMail
		);
	}

	// fn: html send verify to forgot password
	private String generateVerificationEmailForgotPassword(String token) {
		return String.format(
				"<div>" +
						"%s" +
						"<h2 style=\"padding: 10px 0; margin-bottom: 10px;\">" +
						"Xin chào anh (chị),<br />" +
						"Mã xác nhận đổi mật khẩu cho website TMTT Store của anh (chị).<br />" +
						"Cảm ơn vì đã ghé thăm TMTT Store &lt;3" +
						"</h2>" +
						"<h3 style=\"background: #eee;padding: 10px;\">" +
						"<i><b>%s</b></i>" +
						"</h3>" +
						"%s" +
						"</div>",
				headerHtmlMail, token, footerHtmlVerifyMail
		);
	}

	// fn: html login failed
	private String htmlWarningLogin() {
		return "<div>" +
				headerHtmlMail +
				"<h2 style=\"padding: 10px 0; margin-bottom: 10px;\">" +
				"Xin Chào anh (chị),<br />" +
				"Cửa hàng nghi ngờ có ai đó đã cố gắng đăng nhập vào tài khoản của quý khách.<br />" +
				"Nếu quý khách không nhớ mật khẩu hãy nhấn vào \"Quên mật khẩu\" để lấy lại mật khẩu<br/>" +
				"</h2>" +
				"<h1>Cảm ơn.</h1>" +
				"</div>";
	}

	// fn: hàm gửi mail đi
	private void send(String mail, String subject, String body) throws MessagingException {
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
		helper.setFrom(fromMail);
		helper.setTo(mail);
		helper.setSubject(subject);
		helper.setText(body, true); // true indicates HTML
		mailSender.send(mimeMessage);
	}

	// fn: handle filter mail
	@Override
	public MessageResponse sendMail(SendMailRequest sendMailRequest) {
		MessageResponse messageResponse = new MessageResponse();
		String sub = "";
		String body = "";
		try{
			if (!verifyServices.checkVerifyExist(sendMailRequest.mail())) {
				messageResponse.setCode(-1);
				messageResponse.setMessage("Đã gửi mã OTP trong vòng 10 phút gần đây, vui lòng chờ.");
				return messageResponse;
			}

			if(sendMailRequest.title() == 1){
				String otp = verifyServices.createVerify(sendMailRequest.mail());
				sub = "Mã OTP tạo tài khoản";
				body = generateVerificationEmail(otp);
			} // title = 1 => send verify create account
			else if(sendMailRequest.title() == 2){
				String otp = verifyServices.createVerify(sendMailRequest.mail());
				sub = "Mã OTP quên mật khẩu";
				body = generateVerificationEmailForgotPassword(otp);
			} // title = 2 => send verify forgot password
			else if(sendMailRequest.title() == 3){
				sub = "Cảnh báo đăng nhập thất bại nhiều lần";
				body = htmlWarningLogin();
				send(sendMailRequest.mail(), sub, body);
				messageResponse.setCode(1);
				messageResponse.setMessage("Bạn đăng nhập thật bại quá 4 lần, vui lòng tạo mới mật khẩu");
				return messageResponse;
			} // title = 2 => send warning login failed
			send(sendMailRequest.mail(), sub, body);
			messageResponse.setCode(0);
			messageResponse.setMessage("Gửi OTP thành công");
		} catch (Exception e){
			messageResponse.setCode(-1);
			messageResponse.setMessage(e.getMessage());
		}
		return messageResponse;
	}
}
