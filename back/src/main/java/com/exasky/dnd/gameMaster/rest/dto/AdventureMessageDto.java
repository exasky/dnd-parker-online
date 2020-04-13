package com.exasky.dnd.gameMaster.rest.dto;

public class AdventureMessageDto {
    public enum AdventureMessageType {
        RELOAD,
        GOTO,
        MOUSE_MOVE
    }

    private AdventureMessageType type;
    private Object message;

    // region Getters & Setters

    public AdventureMessageType getType() {
        return type;
    }

    public void setType(AdventureMessageType type) {
        this.type = type;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    // endregion
}
