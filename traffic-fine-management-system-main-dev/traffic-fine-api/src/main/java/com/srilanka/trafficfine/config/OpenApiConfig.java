package com.srilanka.trafficfine.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 * Access at: http://localhost:8080/api/swagger-ui.html
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Traffic Fine Management API",
        version = "1.0.0",
        description = "Sri Lanka Police Traffic Fine Management System — REST API. " +
                      "Supports fine issuance, online payment, SMS notifications, and admin analytics.",
        contact = @Contact(
            name = "SL Police IT Division",
            email = "it@police.gov.lk"
        ),
        license = @License(name = "Government of Sri Lanka")
    ),
    servers = {
        @Server(url = "/api", description = "Local Development Server")
    }
)
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer"
)
public class OpenApiConfig {
    // Configuration is entirely annotation-driven
}
