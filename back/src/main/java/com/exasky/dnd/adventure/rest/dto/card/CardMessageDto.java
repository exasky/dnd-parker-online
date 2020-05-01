package com.exasky.dnd.adventure.rest.dto.card;

import com.exasky.dnd.common.dto.WsMessageDto;

public class CardMessageDto extends WsMessageDto<CardMessageDto.CardMessageType> {
    public enum CardMessageType {
        DRAW_CARD,
        SELECT_EQUIPMENT
    }

    public CardMessageDto(CardMessageType cardMessageType, Object message) {
        super(cardMessageType, message);
    }
}
