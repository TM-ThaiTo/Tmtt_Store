package com.trinhminhthaito.backend_springboot.dtos.response;

public record LoginResponse(String accessToken, Long expiresIn) {
}
