package com.exasky.dnd.adventure.rest.dto.card;

import com.exasky.dnd.common.dto.WsMessageDto;

public class CardMessageDto extends WsMessageDto<CardMessageDto.CardMessageType> {
    public enum CardMessageType {
        DRAW_CARD,
        CLOSE_DIALOG
    }

    public CardMessageDto(CardMessageType cardMessageType) {
        this(cardMessageType, null);
    }

    public CardMessageDto(CardMessageType cardMessageType, Object message) {
        super(cardMessageType, message);
    }
}
