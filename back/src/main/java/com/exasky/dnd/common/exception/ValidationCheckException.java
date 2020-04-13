package com.exasky.dnd.common.exception;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class ValidationCheckException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final List<String> messages = new ArrayList<>();
    private final HttpStatus status;

    public ValidationCheckException() {
        this(HttpStatus.BAD_REQUEST);
    }

    public ValidationCheckException(HttpStatus httpStatus) {
        this.status = httpStatus;
    }

    public ValidationCheckException addMessage(String message) {
        this.messages.add(message);
        return this;
    }

    @Override
    public String getMessage() {
        return this.getMessages().toString();
    }

    public List<String> getMessages() {
        return this.messages;
    }

    public boolean hasErrors() {
        return !this.messages.isEmpty();
    }

    HttpStatus getHttpStatus() {
        return status;
    }

    public void throwIfError() {
        if (hasErrors()) {
            throw this;
        }
    }

    public static void throwError(HttpStatus status, String error) {
        throw new ValidationCheckException(status).addMessage(error);
    }

    public static void throwError(String error) {
        throwError(HttpStatus.BAD_REQUEST, error);
    }
}
