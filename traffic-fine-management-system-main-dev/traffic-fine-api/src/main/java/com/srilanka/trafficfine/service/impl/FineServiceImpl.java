package com.srilanka.trafficfine.service.impl;

import com.srilanka.trafficfine.dto.request.CreateFineRequest;
import com.srilanka.trafficfine.dto.response.FineResponse;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.Role;
import com.srilanka.trafficfine.exception.BadRequestException;
import com.srilanka.trafficfine.exception.ResourceNotFoundException;
import com.srilanka.trafficfine.repository.TrafficFineRepository;
import com.srilanka.trafficfine.repository.UserRepository;
import com.srilanka.trafficfine.service.FineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Business logic for issuing and querying traffic fines.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FineServiceImpl implements FineService {

    private final TrafficFineRepository fineRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public FineResponse createFine(CreateFineRequest request, String officerEmail) {
        // Resolve officer
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Officer", "email", officerEmail));

        if (officer.getRole() != Role.OFFICER) {
            throw new BadRequestException("Only officers can issue traffic fines.");
        }

        // Resolve driver
        User driver = userRepository.findById(request.getIssuedToId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", request.getIssuedToId()));

        if (driver.getRole() != Role.DRIVER) {
            throw new BadRequestException("Target user is not a registered driver.");
        }

        // Generate unique reference: TF-<YEAR><MONTH>-<RANDOM6>
        String referenceNumber = generateReferenceNumber();

        TrafficFine fine = TrafficFine.builder()
                .referenceNumber(referenceNumber)
                .categoryId(request.getCategoryId())
                .description(request.getDescription())
                .amount(request.getAmount())
                .issuedBy(officer)
                .issuedTo(driver)
                .district(request.getDistrict())
                .vehicleNumber(request.getVehicleNumber())
                .build();

        TrafficFine saved = fineRepository.save(fine);
        log.info("Fine issued: [{}] Category={} Amount={} Driver={}",
                referenceNumber, request.getCategoryId(), request.getAmount(), driver.getEmail());

        return FineResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FineResponse getFineByReferenceNumber(String referenceNumber) {
        TrafficFine fine = fineRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficFine", "referenceNumber", referenceNumber));
        return FineResponse.from(fine);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineResponse> getFinesByDriver(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", driverId));

        return fineRepository.findByIssuedTo(driver)
                .stream()
                .map(FineResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineResponse> getAllFines() {
        return fineRepository.findAll()
                .stream()
                .map(FineResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Generates a unique fine reference number in the format TF-YYYYMM-XXXXXX.
     * Example: TF-202606-A3F9C1
     */
    private String generateReferenceNumber() {
        String datePart = java.time.LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyyMM"));
        String uniquePart = UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
        String candidate = "TF-" + datePart + "-" + uniquePart;

        // Guarantee uniqueness — extremely unlikely to collide but safe
        while (fineRepository.existsByReferenceNumber(candidate)) {
            uniquePart = UUID.randomUUID().toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();
            candidate = "TF-" + datePart + "-" + uniquePart;
        }
        return candidate;
    }
}
