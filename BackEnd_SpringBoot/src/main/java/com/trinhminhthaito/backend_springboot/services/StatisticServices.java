package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;

public interface StatisticServices {
    MessageDataResponse getCard();

    MessageDataResponse getMonthRevenue(Number year);

    MessageDataResponse getStatisticAnnual(Number startYear, Number endYear);
}