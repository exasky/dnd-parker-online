package com.exasky.dnd.configuration.logging;

import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.rest.dto.DnDUserUpdatePasswordDto;
import com.exasky.dnd.user.rest.dto.LoginDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.AbstractRequestLoggingFilter;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

import static com.exasky.dnd.common.Constant.REST_URL;
import static com.exasky.dnd.common.Utils.getCurrentUser;

@Component
public class CustomRequestLoggingFilter extends AbstractRequestLoggingFilter {

    public CustomRequestLoggingFilter() {
        setIncludeClientInfo(false);
        setIncludeQueryString(true);
        setIncludePayload(true);
        setMaxPayloadLength(10000);
        setIncludeHeaders(false);
        setBeforeMessagePrefix("");
        setBeforeMessageSuffix("");
        setAfterMessagePrefix("");
        setAfterMessageSuffix("");
    }

    @Override
    protected boolean shouldLog(HttpServletRequest request) {
        return !request.getRequestURI().startsWith(REST_URL + "/adventure/mouse-move/");
    }

    @Override
    protected void beforeRequest(HttpServletRequest request, String message) {
        // ONLY LOG AFTER REQUEST
    }

    @Override
    protected void afterRequest(HttpServletRequest request, String message) {
        StringBuilder sb = new StringBuilder("[")
                .append(String.format("%6s", request.getMethod()))
                .append("]");
        try {
            DnDUser currentUser = getCurrentUser(); // authService.getCurrentUser();
            sb.append(" - ").append(currentUser.getUsername());
        } catch (Exception ignored) { // NOSONAR
        } finally {
            sb.append(" - ").append(message);
            logger.info(sb.toString());
        }
    }

    @Override
    protected @NonNull String createMessage(HttpServletRequest request, String prefix, String suffix) {
        StringBuilder msg = new StringBuilder();
        msg.append(request.getRequestURI());

        if (isIncludeQueryString()) {
            String queryString = request.getQueryString();
            if (queryString != null) {
                msg.append('?').append(queryString);
            }
        }

        if (isIncludePayload()) {
            String payload = getMessagePayload(request);
            if (payload != null) {
                if (request.getRequestURI().equals(REST_URL + "/login")) {
                    try {
                        LoginDto loginDto = new ObjectMapper().readValue(payload, LoginDto.class);
                        loginDto.setPassword("*** HIDDEN ***");
                        payload = new ObjectMapper().writeValueAsString(loginDto);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else if (request.getRequestURI().startsWith(REST_URL + "/user/update-password/")) {
                    try {
                        DnDUserUpdatePasswordDto dto = new ObjectMapper().readValue(payload,
                                DnDUserUpdatePasswordDto.class);
                        dto.setPassword("*** HIDDEN ***");
                        payload = new ObjectMapper().writeValueAsString(dto);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                msg.append(" - ").append(payload);
            }
        }

        return msg.toString();
    }
}
