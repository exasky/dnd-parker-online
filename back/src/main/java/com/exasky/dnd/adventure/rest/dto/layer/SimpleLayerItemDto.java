package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;

public class SimpleLayerItemDto extends LayerItemDto<SimpleLayerItemDto, SimpleLayerItem> {

    @Override
    public SimpleLayerItem createBoInstance(Long id) {
        return new SimpleLayerItem(id);
    }

    @Override
    public SimpleLayerItemDto createDtoInstance() {
        return new SimpleLayerItemDto();
    }
}
