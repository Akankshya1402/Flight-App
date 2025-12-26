package com.flightapp.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class PasswordAttemptExceededException extends RuntimeException {

    public PasswordAttemptExceededException(String message) {
        super(message);
    }
}
