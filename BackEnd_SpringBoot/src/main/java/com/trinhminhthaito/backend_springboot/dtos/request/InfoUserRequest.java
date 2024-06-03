package com.trinhminhthaito.backend_springboot.dtos.request;

import java.time.LocalDateTime;

public record InfoUserRequest(String accountId, String fullName, LocalDateTime birthday, int gender, String address) {
}
