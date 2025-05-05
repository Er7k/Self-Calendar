package com.g25.selfcalendar.exception;

/**
This class is a custom exception used when a Resource is not found
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
