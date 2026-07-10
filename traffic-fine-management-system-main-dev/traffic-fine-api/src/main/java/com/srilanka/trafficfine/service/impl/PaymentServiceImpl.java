package com.srilanka.trafficfine.service.impl;

import com.srilanka.trafficfine.dto.request.PayFineRequest;
import com.srilanka.trafficfine.dto.response.PaymentResponse;
import com.srilanka.trafficfine.entity.Payment;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.FineStatus;
import com.srilanka.trafficfine.enums.TransactionStatus;
import com.srilanka.trafficfine.exception.BadRequestException;
import com.srilanka.trafficfine.exception.FineAlreadyPaidException;
import com.srilanka.trafficfine.exception.ResourceNotFoundException;
import com.srilanka.trafficfine.repository.PaymentRepository;
import com.srilanka.trafficfine.repository.TrafficFineRepository;
import com.srilanka.trafficfine.repository.UserRepository;
import com.srilanka.trafficfine.service.NotificationService;
import com.srilanka.trafficfine.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Orchestrates the full payment workflow:
 *   1. Validate fine exists and is unpaid
 *   2. Validate category matches
 *   3. Create payment record
 *   4. Mark fine as PAID
 *   5. Trigger SMS notification to officer
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TrafficFineRepository fineRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PaymentResponse payFine(PayFineRequest request, String driverEmail) {
        // Step 1: Resolve the driver
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "email", driverEmail));

        // Step 2: Fetch the fine
        TrafficFine fine = fineRepository.findByReferenceNumber(request.getReferenceNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "TrafficFine", "referenceNumber", request.getReferenceNumber()));

        // Step 3: Guard — already paid?
        if (fine.getStatus() == FineStatus.PAID) {
            throw new FineAlreadyPaidException(request.getReferenceNumber());
        }

        // Step 4: Guard — category must match
        if (!fine.getCategoryId().equalsIgnoreCase(request.getCategoryId())) {
            throw new BadRequestException(
                    String.format("Category mismatch: fine belongs to category '%s', not '%s'.",
                            fine.getCategoryId(), request.getCategoryId()));
        }

        // Step 5: Create payment record (SUCCESS)
        Payment payment = Payment.builder()
                .fine(fine)
                .amount(fine.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionStatus(TransactionStatus.SUCCESS)
                .transactionReference(request.getTransactionReference())
                .build();

        paymentRepository.save(payment);

        // Step 6: Mark fine as PAID
        fine.setStatus(FineStatus.PAID);
        fineRepository.save(fine);

        log.info("Fine [{}] paid successfully by driver [{}] via [{}]",
                fine.getReferenceNumber(), driverEmail, request.getPaymentMethod());

        // Step 7: Async-safe notification — runs in its own transaction
        notificationService.notifyOfficerOnPayment(fine, driver);

        PaymentResponse response = PaymentResponse.from(payment);
        response.setMessage("Fine paid successfully. Officer has been notified via SMS.");
        response.setNotificationStatus("TRIGGERED");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(PaymentResponse::from)
                .collect(Collectors.toList());
    }
}
