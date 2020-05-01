package com.exasky.dnd.adventure.rest.dto.card;

public class AskDrawCardDto {
    private Long adventureId;
    private Long characterId;
    private Long chestItemId;
    private Long characterItemId;

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

    // end region
}
