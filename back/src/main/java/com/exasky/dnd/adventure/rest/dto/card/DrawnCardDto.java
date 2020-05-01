package com.exasky.dnd.adventure.rest.dto.card;

import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;

public class DrawnCardDto {
    private Long adventureId;
    private Long characterId;
    private Long chestItemId;
    private CharacterItemDto characterItem;

    public DrawnCardDto(Long adventureId, Long characterId, Long chestItemId, CharacterItemDto characterItem) {
        this.adventureId = adventureId;
        this.characterId = characterId;
        this.chestItemId = chestItemId;
        this.characterItem = characterItem;
    }

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

    public CharacterItemDto getCharacterItem() {
        return characterItem;
    }

    public void setCharacterItem(CharacterItemDto characterItem) {
        this.characterItem = characterItem;
    }

    // end region
}
