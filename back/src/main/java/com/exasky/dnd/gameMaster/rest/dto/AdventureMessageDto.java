package com.exasky.dnd.gameMaster.rest.dto;

public class AdventureMessageDto {
    public enum AdventureMessageType {
        UPDATE_CAMPAIGN,
        UPDATE_CHARACTER,
        UPDATE_MONSTER,
        ROLL_INITIATIVE,
        GOTO,
        MOUSE_MOVE,
        ADD_LAYER_ITEM,
        UPDATE_LAYER_ITEM,
        REMOVE_LAYER_ITEM,
        SELECT_MONSTER,
        ALERT,
        SOUND,
        AMBIENT_SOUND,
        CLOSE_DIALOG,
        ASK_NEXT_TURN,
        VALIDATE_NEXT_TURN,
        ASK_TRADE,
        SELECT_TRADE_CARD,
        ASK_SWITCH,
        SELECT_SWITCH_CARD,
        ADD_LOG
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
