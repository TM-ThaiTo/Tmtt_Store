package com.trinhminhthaito.backend_springboot.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommentResponse {
    private int code;
    private String message;
    private Object data;
    private List<Integer> rateList;
    private int totalComent;
    private int[] rateCounts;
}