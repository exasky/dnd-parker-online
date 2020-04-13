package com.exasky.dnd.adventure.rest.dto;

public class MouseMoveDto {
    private Long userId;
    private String username;
    private Long x;
    private Long y;
    private Long offsetX;
    private Long offsetY;

    // region Getters & Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getX() {
        return x;
    }

    public void setX(Long x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }

    public Long getOffsetX() {
        return offsetX;
    }

    public void setOffsetX(Long offsetX) {
        this.offsetX = offsetX;
    }

    public Long getOffsetY() {
        return offsetY;
    }

    public void setOffsetY(Long offsetY) {
        this.offsetY = offsetY;
    }
    // endregion
}
