package com.exasky.dnd.gameMaster.rest.dto;

public class AdventureMessageDto {
    public enum AdventureMessageType {
        UPDATE_CAMPAIGN,
        UPDATE_CHARACTER,
        GOTO,
        MOUSE_MOVE,
        ADD_LAYER_ITEM,
        UPDATE_LAYER_ITEM,
        REMOVE_LAYER_ITEM,
        SELECT_CHARACTER,
        SHOW_TRAP,
        ALERT,
        SOUND,
        SET_CHEST_CARD
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
