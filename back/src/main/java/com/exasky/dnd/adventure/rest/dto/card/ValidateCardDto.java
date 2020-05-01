package com.exasky.dnd.adventure.rest.dto.card;

public class ValidateCardDto {
    private Long adventureId;
    private Long characterId;
    private Long chestItemId; // TODO TODO TODO faire les envois des chestItemId avec le front
    private Long characterItemId;
    private Boolean equipToEquipment;
    private Boolean validation;

    // region Getters & Setters

    public Long getAdventureId() {
        return adventureId;
    }

    public void setAdventureId(Long adventureId) {
        this.adventureId = adventureId;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public void setCharacterId(Long characterId) {
        this.characterId = characterId;
    }

    public Long getChestItemId() {
        return chestItemId;
    }

    public void setChestItemId(Long chestItemId) {
        this.chestItemId = chestItemId;
    }

    public Long getCharacterItemId() {
        return characterItemId;
    }

    public void setCharacterItemId(Long characterItemId) {
        this.characterItemId = characterItemId;
    }

    public Boolean getEquipToEquipment() {
        return equipToEquipment;
    }

    public void setEquipToEquipment(Boolean equipToEquipment) {
        this.equipToEquipment = equipToEquipment;
    }

    public Boolean getValidation() {
        return validation;
    }

    public void setValidation(Boolean validation) {
        this.validation = validation;
    }

    // endregion
}
