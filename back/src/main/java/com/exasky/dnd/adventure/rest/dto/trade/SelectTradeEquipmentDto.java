package com.exasky.dnd.adventure.rest.dto.trade;

import com.exasky.dnd.adventure.rest.dto.CharacterItemDto;

public class SelectTradeEquipmentDto {
    private Boolean isFrom;
    private Boolean isEquipment;
    private CharacterItemDto characterEquipment;

    public Boolean getIsFrom() {
        return isFrom;
    }

    public void setIsFrom(Boolean from) {
        isFrom = from;
    }

    public Boolean getIsEquipment() {
        return isEquipment;
    }

    public void setIsEquipment(Boolean equipment) {
        isEquipment = equipment;
    }

    public CharacterItemDto getCharacterEquipment() {
        return characterEquipment;
    }

    public void setCharacterEquipment(CharacterItemDto characterEquipment) {
        this.characterEquipment = characterEquipment;
    }
}
