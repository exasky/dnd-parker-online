package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;

import java.util.List;

public class SimpleLayerItemDto extends LayerItemDto<SimpleLayerItemDto, SimpleLayerItem> {

    public static List<SimpleLayerItemDto> toDto(List<SimpleLayerItem> bos) {
        return SimpleLayerItemDto.toDto(bos, SimpleLayerItemDto.class);
    }

    @Override
    public SimpleLayerItem createBoInstance(Long id) {
        return new SimpleLayerItem(id);
    }

    @Override
    public SimpleLayerItemDto createDtoInstance() {
        return new SimpleLayerItemDto();
    }
}
