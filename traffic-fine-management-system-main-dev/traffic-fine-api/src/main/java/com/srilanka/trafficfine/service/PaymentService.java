package com.srilanka.trafficfine.service;

import com.srilanka.trafficfine.dto.request.PayFineRequest;
import com.srilanka.trafficfine.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse payFine(PayFineRequest request, String driverEmail);

    List<PaymentResponse> getAllPayments();
}
