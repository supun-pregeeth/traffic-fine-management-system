package com.srilanka.trafficfine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Application-level configuration.
 * Enables JPA Auditing for @CreationTimestamp and @LastModifiedDate fields.
 */
@Configuration
@EnableJpaAuditing
public class ApplicationConfig {
    // Spring Boot auto-configures DataSource, EntityManagerFactory, and
    // TransactionManager from application.properties.
    // This class exists for additional beans if required in future.
}
