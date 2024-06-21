package com.trinhminhthaito.backend_springboot.services.Imp;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators.In;
import org.springframework.stereotype.Service;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.repository.OrderRepository;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.StatisticServices;

@Service
public class StatisticServicesImp implements StatisticServices {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public StatisticServicesImp(OrderRepository orderRepository,
            ProductRepository productRepository,
            AccountRepository accountRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.accountRepository = accountRepository;
    }

    // fn: hàm get doanh thu theo ngày
    private Number getRevenue(LocalDate today) {
        List<Order> orders = orderRepository.findByDateOfPayment(today);
        double totalRevenue = orders.stream()
                .mapToDouble(order -> order.getPaymentDetail().getPaidAmount().doubleValue())
                .sum();
        return totalRevenue;
    }

    // fn: hàm get số lượng order theo ngày
    private Number getOrderToDay(LocalDate today) {
        Date startOfDay = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Order> orders = orderRepository.findByOrderDateBetween(startOfDay, endOfDay);
        return orders.size();
    }

    // fn: get card
    @Override
    public MessageDataResponse getCard() {
        MessageDataResponse messageDataResponse = new MessageDataResponse();
        try {
            LocalDate today = LocalDate.now();
            Number customerSize = accountRepository.findAll().size();
            Number productSize = productRepository.findAll().size();

            Number revenueToday = getRevenue(today);
            Number orderToday = getOrderToDay(today);

            Map<String, Number> data = new HashMap<>();
            data.put("customer", customerSize);
            data.put("product", productSize);
            data.put("revenue", revenueToday);
            data.put("order", orderToday);

            messageDataResponse.setCode(0);
            messageDataResponse.setMessage("Success");
            messageDataResponse.setData(data);
        } catch (Exception ex) {
            messageDataResponse.setCode(-1);
            messageDataResponse.setMessage("Lỗi server: " + ex.getMessage());
        }
        return messageDataResponse;
    }

    // fn: hàm tính số tiền theo tháng
    private int getRevenueForMonth(LocalDate startDate, LocalDate endDate) {
        List<Order> orders = orderRepository.findByDateOfPaymentBetween(startDate, endDate);
        return orders.stream()
                .mapToInt(order -> order.getPaymentDetail().getPaidAmount().intValue())
                .sum();
    }

    // fn: hàm get doanh thu từng tháng theo năm
    private List<Integer> listRevenueYear(int year) {
        List<Integer> monthlyRevenues = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();

            int revenue = getRevenueForMonth(startDate, endDate);
            monthlyRevenues.add(revenue);
        }

        return monthlyRevenues;
    }

    // fn: get getMonthRevenue
    @Override
    public MessageDataResponse getMonthRevenue(Number year) {
        MessageDataResponse messageDataResponse = new MessageDataResponse();
        try {
            List<Integer> listRevenueLastYear = listRevenueYear(year.intValue() - 1);
            List<Integer> listRevenueThisYear = listRevenueYear(year.intValue());

            Map<String, List<Integer>> data = new HashMap<>();
            data.put("thisYear", listRevenueThisYear);
            data.put("lastYear", listRevenueLastYear);

            messageDataResponse.setCode(0);
            messageDataResponse.setMessage("Success");
            messageDataResponse.setData(data);
        } catch (Exception ex) {
            messageDataResponse.setCode(-1);
            messageDataResponse.setMessage("Lỗi server: " + ex.getMessage());
        }
        return messageDataResponse;
    }

    public List<Integer> getStatisticAnnual(int startYear, int endYear) {
        List<Integer> annualRevenues = new ArrayList<>();
        try {
            for (int year = startYear; year <= endYear; year++) {
                List<Integer> monthlyRevenues = listRevenueYear(year);
                int totalRevenue = monthlyRevenues.stream().mapToInt(Integer::intValue).sum();
                annualRevenues.add(totalRevenue);
            }
        } catch (Exception ex) {
            ex.printStackTrace(); // Xử lý ngoại lệ tại đây nếu cần
        }
        return annualRevenues;
    }

    // fn: get doanh thu theo từng năm
    @Override
    public MessageDataResponse getStatisticAnnual(Number startYear, Number endYear) {
        MessageDataResponse messageDataResponse = new MessageDataResponse();
        try {
            List<Integer> list = getStatisticAnnual(startYear.intValue(), endYear.intValue());

            messageDataResponse.setCode(0);
            messageDataResponse.setMessage("Success");
            messageDataResponse.setData(list);
        } catch (Exception ex) {
            messageDataResponse.setCode(-1);
            messageDataResponse.setMessage("Lỗi: " + ex.getMessage());
        }
        return messageDataResponse;
    }
}
