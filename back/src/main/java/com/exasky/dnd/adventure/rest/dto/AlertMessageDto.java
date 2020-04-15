package com.exasky.dnd.adventure.rest.dto;

public class AlertMessageDto {
    public enum AlertMessageType {
        SUCCESS,
        WARN,
        ERROR
    }

    private Long characterId;
    private String message;
    private AlertMessageType type;

    // region Getters & Setters

    public Long getCharacterId() {
        return characterId;
    }

    public void setCharacterId(Long characterId) {
        this.characterId = characterId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AlertMessageType getType() {
        return type;
    }

    public void setType(AlertMessageType type) {
        this.type = type;
    }

    // endregion
}
