package com.exasky.dnd.adventure.rest.dto.trade;

public class ValidateTradeDto {
    private Long fromCharacterId;
    private Long fromCharacterEquipment;
    private Boolean fromCharacterIsEquipment;
    private Long toCharacterId;
    private Long toCharacterEquipment;
    private Boolean toCharacterIsEquipment;

    public Long getFromCharacterId() {
        return fromCharacterId;
    }

    public void setFromCharacterId(Long fromCharacterId) {
        this.fromCharacterId = fromCharacterId;
    }

    public Long getFromCharacterEquipment() {
        return fromCharacterEquipment;
    }

    public void setFromCharacterEquipment(Long fromCharacterEquipment) {
        this.fromCharacterEquipment = fromCharacterEquipment;
    }

    public Boolean getFromCharacterIsEquipment() {
        return fromCharacterIsEquipment;
    }

    public void setFromCharacterIsEquipment(Boolean fromCharacterIsEquipment) {
        this.fromCharacterIsEquipment = fromCharacterIsEquipment;
    }

    public Long getToCharacterId() {
        return toCharacterId;
    }

    public void setToCharacterId(Long toCharacterId) {
        this.toCharacterId = toCharacterId;
    }

    public Long getToCharacterEquipment() {
        return toCharacterEquipment;
    }

    public void setToCharacterEquipment(Long toCharacterEquipment) {
        this.toCharacterEquipment = toCharacterEquipment;
    }

    public Boolean getToCharacterIsEquipment() {
        return toCharacterIsEquipment;
    }

    public void setToCharacterIsEquipment(Boolean toCharacterIsEquipment) {
        this.toCharacterIsEquipment = toCharacterIsEquipment;
    }
}
