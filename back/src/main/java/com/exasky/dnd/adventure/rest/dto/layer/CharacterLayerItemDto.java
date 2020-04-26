package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.CharacterLayerItem;
import com.exasky.dnd.adventure.rest.dto.CharacterDto;

import java.util.List;
import java.util.Objects;

public class CharacterLayerItemDto extends LayerItemDto<CharacterLayerItemDto, CharacterLayerItem> {
    private CharacterDto character;

    public static List<CharacterLayerItemDto> toDto(List<CharacterLayerItem> bos) {
        return CharacterLayerItemDto.toDto(bos, CharacterLayerItemDto.class);
    }

    @Override
    public CharacterLayerItem createBoInstance(Long id) {
        return new CharacterLayerItem(id);
    }

    @Override
    public CharacterLayerItemDto createDtoInstance() {
        return new CharacterLayerItemDto();
    }

    @Override
    public void specific_toBo(CharacterLayerItem bo) {
        if (Objects.nonNull(getCharacter())) {
            bo.setCharacter(CharacterDto.toBo(getCharacter()));
        }
    }

    @Override
    protected void specific_toDto(CharacterLayerItem bo, CharacterLayerItemDto dto) {
        if (Objects.nonNull(bo.getCharacter())) {
            dto.setCharacter(CharacterDto.toDto(bo.getCharacter()));
        }
    }


    // region Getters & Setters
    public CharacterDto getCharacter() {
        return character;
    }

    public void setCharacter(CharacterDto character) {
        this.character = character;
    }
    // endregion
}
