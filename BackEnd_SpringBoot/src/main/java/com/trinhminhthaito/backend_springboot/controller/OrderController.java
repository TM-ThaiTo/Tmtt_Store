package com.trinhminhthaito.backend_springboot.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/order")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {


}
