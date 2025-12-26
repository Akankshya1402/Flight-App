package com.flightapp.apigateway.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	
	 @Column(nullable = false)
	    private int failedAttempts = 0;

	    // ---------- getters ----------
	    public int getFailedAttempts() {
	        return failedAttempts;
	    }

	    // ---------- helpers ----------
	    public void incrementFailedAttempts() {
	        this.failedAttempts++;
	    }

	    public void resetFailedAttempts() {
	        this.failedAttempts = 0;
	    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;   // used as username

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
