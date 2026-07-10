package com.srilanka.trafficfine.service;

import com.srilanka.trafficfine.dto.request.CreateFineRequest;
import com.srilanka.trafficfine.dto.response.FineResponse;

import java.util.List;

public interface FineService {

    FineResponse createFine(CreateFineRequest request, String officerEmail);

    FineResponse getFineByReferenceNumber(String referenceNumber);

    List<FineResponse> getFinesByDriver(Long driverId);

    List<FineResponse> getAllFines();
}
