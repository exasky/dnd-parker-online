package com.exasky.dnd.common.dto;

public abstract class WsMessageDto<TYPE> {
    protected TYPE type;
    protected Object message;

    public WsMessageDto(TYPE type, Object message) {
        this.type = type;
        this.message = message;
    }

    // region Getters & Setters

    public TYPE getType() {
        return type;
    }

    public void setType(TYPE type) {
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
