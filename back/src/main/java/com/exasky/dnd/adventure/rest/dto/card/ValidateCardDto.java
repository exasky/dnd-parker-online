package com.exasky.dnd.adventure.rest.dto.card;

public class ValidateCardDto {
    private Long adventureId;
    private Long characterItemId;
    private Boolean validation;

    // region Getters & Setters

    public Long getAdventureId() {
        return adventureId;
    }

    public void setAdventureId(Long adventureId) {
        this.adventureId = adventureId;
    }

    public Long getCharacterItemId() {
        return characterItemId;
    }

    public void setCharacterItemId(Long characterItemId) {
        this.characterItemId = characterItemId;
    }

    public Boolean getValidation() {
        return validation;
    }

    public void setValidation(Boolean validation) {
        this.validation = validation;
    }

    // endregion
}
