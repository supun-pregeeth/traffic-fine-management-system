package com.srilanka.trafficfine.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class FineAlreadyPaidException extends RuntimeException {

    public FineAlreadyPaidException(String referenceNumber) {
        super(String.format("Traffic fine with reference '%s' has already been paid.", referenceNumber));
    }
}
