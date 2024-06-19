package com.trinhminhthaito.backend_springboot.dtos.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderListUserRepository {

    private String orderCode;
    private Date orderDate;
    private Number paidAmount;
    private Number status;
}