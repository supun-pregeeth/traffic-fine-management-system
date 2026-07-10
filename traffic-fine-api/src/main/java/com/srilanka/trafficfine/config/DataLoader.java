package com.srilanka.trafficfine.config;

import com.srilanka.trafficfine.entity.NotificationLog;
import com.srilanka.trafficfine.entity.Payment;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.*;
import com.srilanka.trafficfine.repository.NotificationLogRepository;
import com.srilanka.trafficfine.repository.PaymentRepository;
import com.srilanka.trafficfine.repository.TrafficFineRepository;
import com.srilanka.trafficfine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrafficFineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Seeding initial application database...");

        // 1. Create Users
        User admin = User.builder()
                .name("Super Admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .phoneNumber("+94770000000")
                .district("Colombo")
                .build();
        userRepository.save(admin);

        User officer = User.builder()
                .name("Officer Bandara")
                .email("officer@example.com")
                .password(passwordEncoder.encode("Officer@123"))
                .role(Role.OFFICER)
                .phoneNumber("+94771234567")
                .district("Colombo")
                .build();
        userRepository.save(officer);

        User driver = User.builder()
                .name("Kamal Perera")
                .email("driver@example.com")
                .password(passwordEncoder.encode("Driver@123"))
                .role(Role.DRIVER)
                .phoneNumber("+94777654321")
                .district("Colombo")
                .build();
        userRepository.save(driver);

        log.info("Users seeded: Admin, Officer, Driver created.");

        // 2. Create Traffic Fines
        TrafficFine pendingFine = TrafficFine.builder()
                .referenceNumber("REF-9876-01")
                .categoryId("CAT-A01")
                .description("Speeding violation over 60 km/h limit in a high-density zone.")
                .amount(new BigDecimal("3000.00"))
                .status(FineStatus.PENDING)
                .issuedBy(officer)
                .issuedTo(driver)
                .district("Colombo")
                .vehicleNumber("WP-CAD-4567")
                .issuedAt(LocalDateTime.now().minusDays(5))
                .build();
        fineRepository.save(pendingFine);

        TrafficFine paidFine1 = TrafficFine.builder()
                .referenceNumber("REF-5432-02")
                .categoryId("CAT-B04")
                .description("Reckless driving and overtaking from the left side.")
                .amount(new BigDecimal("6500.00"))
                .status(FineStatus.PAID)
                .issuedBy(officer)
                .issuedTo(driver)
                .district("Kandy")
                .vehicleNumber("CP-KAA-1234")
                .issuedAt(LocalDateTime.now().minusDays(10))
                .build();
        fineRepository.save(paidFine1);

        TrafficFine paidFine2 = TrafficFine.builder()
                .referenceNumber("REF-1111-03")
                .categoryId("CAT-C12")
                .description("Distracted driving (using mobile phone while in motion).")
                .amount(new BigDecimal("2500.00"))
                .status(FineStatus.PAID)
                .issuedBy(officer)
                .issuedTo(driver)
                .district("Gampaha")
                .vehicleNumber("WP-PB-9999")
                .issuedAt(LocalDateTime.now().minusDays(2))
                .build();
        fineRepository.save(paidFine2);

        log.info("Traffic Fines seeded: 1 PENDING, 2 PAID created.");

        // 3. Create Payments for PAID Fines
        Payment payment1 = Payment.builder()
                .fine(paidFine1)
                .amount(paidFine1.getAmount())
                .paymentMethod(PaymentMethod.CARD)
                .transactionStatus(TransactionStatus.SUCCESS)
                .transactionReference("TXN-CC-778899")
                .paidAt(LocalDateTime.now().minusDays(9))
                .build();
        paymentRepository.save(payment1);

        Payment payment2 = Payment.builder()
                .fine(paidFine2)
                .amount(paidFine2.getAmount())
                .paymentMethod(PaymentMethod.ONLINE)
                .transactionStatus(TransactionStatus.SUCCESS)
                .transactionReference("TXN-ON-112233")
                .paidAt(LocalDateTime.now().minusDays(1))
                .build();
        paymentRepository.save(payment2);

        log.info("Payments seeded successfully.");

        // 4. Create Notification Logs
        NotificationLog log1 = NotificationLog.builder()
                .phoneNumber(officer.getPhoneNumber())
                .recipientName(officer.getName())
                .message("New fine REF-9876-01 issued to driver Kamal Perera (WP-CAD-4567).")
                .status(NotificationStatus.SENT)
                .fineReference("REF-9876-01")
                .sentAt(LocalDateTime.now().minusDays(5))
                .build();
        notificationLogRepository.save(log1);

        NotificationLog log2 = NotificationLog.builder()
                .phoneNumber(officer.getPhoneNumber())
                .recipientName(officer.getName())
                .message("Fine REF-5432-02 has been successfully settled.")
                .status(NotificationStatus.SENT)
                .fineReference("REF-5432-02")
                .sentAt(LocalDateTime.now().minusDays(9))
                .build();
        notificationLogRepository.save(log2);

        log.info("Notification logs seeded successfully. Seed complete.");
    }
}
