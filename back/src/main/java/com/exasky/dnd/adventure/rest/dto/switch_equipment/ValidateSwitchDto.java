package com.exasky.dnd.adventure.rest.dto.switch_equipment;

public class ValidateSwitchDto {
    private Long characterId;
    private Long characterEquippedItemId;
    private Long characterBackpackItemId;

    public Long getCharacterId() {
        return characterId;
    }

    public void setCharacterId(Long characterId) {
        this.characterId = characterId;
    }

    public Long getCharacterEquippedItemId() {
        return characterEquippedItemId;
    }

    public void setCharacterEquippedItemId(Long characterEquippedItemId) {
        this.characterEquippedItemId = characterEquippedItemId;
    }

    public Long getCharacterBackpackItemId() {
        return characterBackpackItemId;
    }

    public void setCharacterBackpackItemId(Long characterBackpackItemId) {
        this.characterBackpackItemId = characterBackpackItemId;
    }
}
