package com.exasky.dnd.adventure.rest.dto.card;

import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;

public class DrawnCardDto {
    // TODO object to draw card with user (id/name) (character when current initiavite)
    // characterItem to draw in case of draw specific card (may be new object ?)

    private Long adventureId; // will be used to log actions
    private Long characterId;
    private CharacterItemDto characterItem;

    public DrawnCardDto(Long adventureId, Long characterId, CharacterItemDto characterItem) {
        this.adventureId = adventureId;
        this.characterId = characterId;
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

    public CharacterItemDto getCharacterItem() {
        return characterItem;
    }

    public void setCharacterItem(CharacterItemDto characterItem) {
        this.characterItem = characterItem;
    }

    // end region
}
