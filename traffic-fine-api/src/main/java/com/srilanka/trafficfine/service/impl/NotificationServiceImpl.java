package com.srilanka.trafficfine.service.impl;

import com.srilanka.trafficfine.entity.NotificationLog;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.NotificationStatus;
import com.srilanka.trafficfine.repository.NotificationLogRepository;
import com.srilanka.trafficfine.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Simulated SMS notification service.
 *
 * In production, replace the simulateSmsDispatch() body with an actual
 * SMS gateway call (e.g., Dialog, Mobitel, Twilio, AWS SNS).
 *
 * This service always persists a NotificationLog entry — regardless of
 * whether the simulated dispatch "succeeds" — for auditability.
 *
 * Uses REQUIRES_NEW propagation so the audit log is saved even if the
 * caller's transaction rolls back for unrelated reasons.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationLogRepository notificationLogRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyOfficerOnPayment(TrafficFine fine, User driver) {
        User officer = fine.getIssuedBy();

        if (officer.getPhoneNumber() == null || officer.getPhoneNumber().isBlank()) {
            log.warn("Officer [{}] has no phone number — skipping SMS notification for fine [{}]",
                    officer.getEmail(), fine.getReferenceNumber());
            persistLog(null, buildMessage(fine, driver), NotificationStatus.FAILED,
                    officer.getName(), fine.getReferenceNumber());
            return;
        }

        String message = buildMessage(fine, driver);
        NotificationStatus status;

        try {
            simulateSmsDispatch(officer.getPhoneNumber(), message);
            status = NotificationStatus.SENT;
            log.info("SMS notification SENT to officer [{}] at [{}] for fine [{}]",
                    officer.getName(), officer.getPhoneNumber(), fine.getReferenceNumber());
        } catch (Exception ex) {
            status = NotificationStatus.FAILED;
            log.error("SMS notification FAILED for fine [{}]: {}", fine.getReferenceNumber(), ex.getMessage());
        }

        persistLog(officer.getPhoneNumber(), message, status, officer.getName(), fine.getReferenceNumber());
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    /**
     * Builds the SMS message body.
     */
    private String buildMessage(TrafficFine fine, User driver) {
        return String.format(
                "[SL Police - Traffic Fine System] " +
                "Fine Ref: %s | Driver: %s | Amount: LKR %.2f | " +
                "Status: PAID. Payment confirmed successfully.",
                fine.getReferenceNumber(),
                driver.getName(),
                fine.getAmount()
        );
    }

    /**
     * Simulated SMS dispatch. Replace this with a real gateway integration.
     * Throws RuntimeException to simulate occasional failures for testing.
     */
    private void simulateSmsDispatch(String phoneNumber, String message) {
        // Simulation: log the SMS details as if dispatched
        log.debug(">>> [SMS GATEWAY SIMULATION] To: {} | Message: {}", phoneNumber, message);
        // Uncomment to simulate 10% failure rate for testing:
        // if (Math.random() < 0.1) throw new RuntimeException("SMS gateway timeout");
    }

    /**
     * Persists an immutable audit record for every notification attempt.
     */
    private void persistLog(String phoneNumber, String message,
                             NotificationStatus status, String recipientName,
                             String fineReference) {
        NotificationLog log = NotificationLog.builder()
                .phoneNumber(phoneNumber != null ? phoneNumber : "UNKNOWN")
                .message(message)
                .status(status)
                .recipientName(recipientName)
                .fineReference(fineReference)
                .build();
        notificationLogRepository.save(log);
    }
}
