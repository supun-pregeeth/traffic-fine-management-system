package com.srilanka.trafficfine.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateFineRequest {

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Driver ID is required")
    private Long issuedToId;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20)
    private String vehicleNumber;
}
