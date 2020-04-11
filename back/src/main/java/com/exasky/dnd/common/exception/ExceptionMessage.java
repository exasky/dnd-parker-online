package com.exasky.dnd.common.exception;

import java.util.ArrayList;
import java.util.List;

// n'est pas à sa place
public class ExceptionMessage {
    private final String date;
    private final String path;
    private final List<String> errors;

    @SuppressWarnings("WeakerAccess")
    public String getDate() {
        return date;
    }

    @SuppressWarnings("WeakerAccess")
    public String getPath() {
        return path;
    }

    public List<String> getErrors() {
        return errors;
    }

    private ExceptionMessage(String date, String path, List<String> errors) {
        this.date = date;
        this.path = path;
        this.errors = errors;
    }

    public String toString() {
        return getDate() + " - " + getPath() + " - " + getErrors().toString();
    }

    static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String date;
        private String path;
        private List<String> errors;

        private Builder() {
            this.errors = new ArrayList<>();
        }

        Builder date(String date) {
            this.date = date;
            return this;
        }

        Builder path(String path) {
            this.path = path;
            return this;
        }

        Builder errors(List<String> errors) {
            this.errors = errors;
            return this;
        }

        Builder addError(String error) {
            this.errors.add(error);
            return this;
        }

        public ExceptionMessage build() {
            return new ExceptionMessage(date, path, errors);
        }
    }
}
