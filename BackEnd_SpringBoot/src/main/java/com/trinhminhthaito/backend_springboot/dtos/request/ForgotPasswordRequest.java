package com.trinhminhthaito.backend_springboot.dtos.request;

public record ForgotPasswordRequest(String username, String password, String verifyCode) {
}
