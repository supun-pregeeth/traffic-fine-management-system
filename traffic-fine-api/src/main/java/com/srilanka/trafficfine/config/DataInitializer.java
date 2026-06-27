package com.srilanka.trafficfine.config;

import com.srilanka.trafficfine.entity.Payment;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.FineStatus;
import com.srilanka.trafficfine.enums.PaymentMethod;
import com.srilanka.trafficfine.enums.Role;
import com.srilanka.trafficfine.enums.TransactionStatus;
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
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrafficFineRepository trafficFineRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already populated. Skipping initialization.");
            return;
        }

        log.info("Initializing mock data for H2 database...");

        // 1. Create Users
        User admin = User.builder()
                .name("Super Admin")
                .email("admin@srilankapolice.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .phoneNumber("+94112222222")
                .district("Colombo")
                .build();

        User officer = User.builder()
                .name("Inspector R. M. Bandara")
                .email("officer@srilankapolice.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.OFFICER)
                .phoneNumber("+94771234567")
                .district("Colombo 05")
                .build();

        User driver1 = User.builder()
                .name("Hirushi Perera")
                .email("hirushi@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.DRIVER)
                .phoneNumber("+94779876543")
                .district("Colombo 05")
                .build();

        User driver2 = User.builder()
                .name("Aruni Fernando")
                .email("aruni@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.DRIVER)
                .phoneNumber("+94775551234")
                .district("Colombo 03")
                .build();

        userRepository.save(admin);
        userRepository.save(officer);
        userRepository.save(driver1);
        userRepository.save(driver2);

        log.info("Default users registered.");

        // 2. Create Traffic Fines
        
        // Fine 1: Speeding fine for Driver 1 (Hirushi)
        TrafficFine fine1 = TrafficFine.builder()
                .referenceNumber("REF-9876-01")
                .categoryId("CAT-A01")
                .description("Exceeding Speed Limit (100km/h in a 60km/h Zone)")
                .amount(new BigDecimal("3000.00"))
                .status(FineStatus.PENDING)
                .issuedBy(officer)
                .issuedTo(driver1)
                .district("Baseline Road, Colombo 05")
                .vehicleNumber("WP CAB-4567")
                .issuedAt(LocalDateTime.now().minusDays(5))
                .build();

        // Fine 2: Reckless driving for Driver 1 (Hirushi)
        TrafficFine fine2 = TrafficFine.builder()
                .referenceNumber("REF-5432-02")
                .categoryId("CAT-B04")
                .description("Reckless Driving & Overtaking from Left Side")
                .amount(new BigDecimal("5000.00"))
                .status(FineStatus.PENDING)
                .issuedBy(officer)
                .issuedTo(driver1)
                .district("Galle Road, Colombo 03")
                .vehicleNumber("WP CAB-4567")
                .issuedAt(LocalDateTime.now().minusDays(15)) // Late fee might apply (over 14 days)
                .build();

        // Fine 3: Mobile phone usage (PAID) for Driver 1 (Hirushi)
        TrafficFine fine3 = TrafficFine.builder()
                .referenceNumber("REF-1111-03")
                .categoryId("CAT-C12")
                .description("Driving while Using Mobile Communication Device")
                .amount(new BigDecimal("2000.00"))
                .status(FineStatus.PAID)
                .issuedBy(officer)
                .issuedTo(driver1)
                .district("High Level Road, Nugegoda")
                .vehicleNumber("WP CAB-4567")
                .issuedAt(LocalDateTime.now().minusDays(10))
                .build();

        // Fine 4: Speeding fine for Driver 2 (Aruni)
        TrafficFine fine4 = TrafficFine.builder()
                .referenceNumber("REF-4422-01")
                .categoryId("CAT-A01")
                .description("Exceeding Speed Limit (75km/h in a 50km/h Zone)")
                .amount(new BigDecimal("3000.00"))
                .status(FineStatus.PENDING)
                .issuedBy(officer)
                .issuedTo(driver2)
                .district("Kandy Road, Kadawatha")
                .vehicleNumber("WP CAD-9876")
                .issuedAt(LocalDateTime.now().minusDays(3))
                .build();

        // Fine 5: No seat belt for Driver 2 (Aruni)
        TrafficFine fine5 = TrafficFine.builder()
                .referenceNumber("REF-4422-02")
                .categoryId("CAT-C12")
                .description("Not Wearing Seat Belt while Driving")
                .amount(new BigDecimal("1000.00"))
                .status(FineStatus.PENDING)
                .issuedBy(officer)
                .issuedTo(driver2)
                .district("Parliament Road, Rajagiriya")
                .vehicleNumber("WP CAD-9876")
                .issuedAt(LocalDateTime.now().minusDays(20))
                .build();

        // Fine 6: Failure to obey signal (PAID) for Driver 2 (Aruni)
        TrafficFine fine6 = TrafficFine.builder()
                .referenceNumber("REF-4422-03")
                .categoryId("CAT-B04")
                .description("Failure to obey Traffic Light Signals")
                .amount(new BigDecimal("3000.00"))
                .status(FineStatus.PAID)
                .issuedBy(officer)
                .issuedTo(driver2)
                .district("Union Place, Colombo 02")
                .vehicleNumber("WP CAD-9876")
                .issuedAt(LocalDateTime.now().minusDays(18))
                .build();

        trafficFineRepository.save(fine1);
        trafficFineRepository.save(fine2);
        trafficFineRepository.save(fine3);
        trafficFineRepository.save(fine4);
        trafficFineRepository.save(fine5);
        trafficFineRepository.save(fine6);

        log.info("Default traffic fines registered.");

        // 3. Create Payments for PAID fines
        
        Payment payment1 = Payment.builder()
                .fine(fine3)
                .amount(new BigDecimal("2000.00"))
                .paymentMethod(PaymentMethod.CARD)
                .transactionStatus(TransactionStatus.SUCCESS)
                .transactionReference("TXN-1111-CARD")
                .paidAt(LocalDateTime.now().minusDays(9))
                .build();

        Payment payment2 = Payment.builder()
                .fine(fine6)
                .amount(new BigDecimal("3000.00"))
                .paymentMethod(PaymentMethod.ONLINE)
                .transactionStatus(TransactionStatus.SUCCESS)
                .transactionReference("TXN-4422-ONLINE")
                .paidAt(LocalDateTime.now().minusDays(17))
                .build();

        paymentRepository.save(payment1);
        paymentRepository.save(payment2);

        log.info("Payments seeded successfully. Initialization complete!");
    }
}
