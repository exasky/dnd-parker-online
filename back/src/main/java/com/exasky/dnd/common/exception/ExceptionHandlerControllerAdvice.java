package com.exasky.dnd.common.exception;

import com.exasky.dnd.common.Constant;
import com.exasky.dnd.user.model.DnDUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import static com.exasky.dnd.common.Utils.getCurrentUser;

@RestControllerAdvice
public class ExceptionHandlerControllerAdvice {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final Logger logger = LoggerFactory.getLogger(ExceptionHandlerControllerAdvice.class);

    private static final String EXCEPTION_PREFIX = "EXCEPTION ";

    @Autowired
    public ExceptionHandlerControllerAdvice() {
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ExceptionMessage> nullPointerExceptionHandler(HttpServletRequest request, NullPointerException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError("Tu veux éviter les null ? N'hésite pas à lire cet article: https://www.developpez.net/forums/blogs/473169-gugelhupf/b2944/java-astuces-eviter-nullpointerexception/")
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ValidationCheckException.class)
    public ResponseEntity<ExceptionMessage> customExceptionHandler(HttpServletRequest request, ValidationCheckException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .errors(exception.getMessages())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, exception.getHttpStatus());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionMessage> badCredentialsExceptionHandler(HttpServletRequest request, BadCredentialsException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(Constant.Errors.AUTHENTICATION_ERROR)
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExceptionMessage> constraintViolationExceptionHandler(HttpServletRequest request, ConstraintViolationException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .errors(exception.getConstraintViolations()
                        .stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.toList()))
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionMessage> accessDeniedExceptionHandler(HttpServletRequest request, AccessDeniedException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(exception.getMessage())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionMessage> responseStatusExceptionHandler(HttpServletRequest request, ResponseStatusException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(exception.getReason())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, exception.getStatus());
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, ValidationException.class})
    public ResponseEntity<ExceptionMessage> responseStatusExceptionHandler(HttpServletRequest request, RuntimeException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(exception.getMessage())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({EntityNotFoundException.class, EmptyResultDataAccessException.class})
    public ResponseEntity<ExceptionMessage> notFoundExceptionHandler(HttpServletRequest request, RuntimeException exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(exception.getMessage())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionMessage> controllerDtoValidationExceptionHandler(HttpServletRequest request, MethodArgumentNotValidException exception) {
        ExceptionMessage.Builder exceptionBuilder = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString());
        exception.getBindingResult().getAllErrors()
                .forEach(objectError -> exceptionBuilder.addError(objectError.getDefaultMessage()));
        ExceptionMessage message = exceptionBuilder.build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionMessage> genericExceptionHandler(HttpServletRequest request, Exception exception) {
        ExceptionMessage message = ExceptionMessage.builder()
                .date(LocalDateTime.now().format(formatter))
                .path(request.getRequestURI() + "?" + request.getQueryString())
                .addError(exception.getMessage())
                .build();

        logError(message.toString(), exception);

        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void logError(String message, Exception exception) {
        String exceptionMessage = EXCEPTION_PREFIX;
        try {
            DnDUser currentUser = getCurrentUser();
            exceptionMessage += "for user " + currentUser.getUsername();
        } catch (Exception ignored) { // NOSONAR
        } finally {
            logger.error(message);
            logger.error(exceptionMessage, exception);
        }
    }
}
