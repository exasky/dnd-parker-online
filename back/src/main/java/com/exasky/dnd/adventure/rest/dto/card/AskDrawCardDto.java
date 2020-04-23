package com.exasky.dnd.adventure.rest.dto.card;

public class AskDrawCardDto {
    // TODO object to draw card with user (id/name) (character when current initiavite)
    // characterItem to draw in case of draw specific card (may be new object ?)

    private Long adventureId;
    private Long characterId; // will be used to log actions

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

    // end region
}
