package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.ChestLayerItem;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;

import java.util.Objects;

public class ChestLayerItemDto extends LayerItemDto<ChestLayerItemDto, ChestLayerItem> {
    private CharacterItemDto specificCard;

    @Override
    public ChestLayerItem createBoInstance(Long id) {
        return new ChestLayerItem(id);
    }

    @Override
    public ChestLayerItemDto createDtoInstance() {
        return new ChestLayerItemDto();
    }

    @Override
    public void specific_toBo(ChestLayerItem doorLayerItem) {
        if (Objects.nonNull(getSpecificCard())) {
            doorLayerItem.setSpecificCard(CharacterItemDto.toBo(getSpecificCard()));
        }
    }

    @Override
    protected void specific_toDto(ChestLayerItem bo, ChestLayerItemDto dto) {
        if (Objects.nonNull(bo.getSpecificCard())) {
            dto.setSpecificCard(CharacterItemDto.toDto(bo.getSpecificCard()));
        }
    }

    // region Getters & Setters
    public CharacterItemDto getSpecificCard() {
        return specificCard;
    }

    public void setSpecificCard(CharacterItemDto specificCard) {
        this.specificCard = specificCard;
    }
    // endregion
}
