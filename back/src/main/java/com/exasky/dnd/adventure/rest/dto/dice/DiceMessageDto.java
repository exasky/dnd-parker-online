package com.exasky.dnd.adventure.rest.dto.dice;

public class DiceMessageDto {
    public enum DiceMessageType {
        OPEN_DIALOG,
        OPEN_ATTACK_DIALOG,
        SELECT_DICES,
        ROLL_RESULT,
        CLOSE_DIALOG
    }

    private DiceMessageType type;
    private Object message;

    // region Getters & Setters

    public DiceMessageType getType() {
        return type;
    }

    public void setType(DiceMessageType type) {
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
