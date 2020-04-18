package com.exasky.dnd.adventure.rest.dto;

public class ChestSpecificCardDto {
    private Long characterItemId;
    private Long layerItemId;

    // region Getters & Setters

    public Long getCharacterItemId() {
        return characterItemId;
    }

    public void setCharacterItemId(Long characterItemId) {
        this.characterItemId = characterItemId;
    }

    public Long getLayerItemId() {
        return layerItemId;
    }

    public void setLayerItemId(Long layerItemId) {
        this.layerItemId = layerItemId;
    }

    // endregion
}
