package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.repository.layer.SimpleLayerItemRepository;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.stereotype.Service;

@Service
public class SimpleLayerItemService extends ParentLayerItemService<SimpleLayerItem> {

    public SimpleLayerItemService(SimpleLayerItemRepository simpleLayerItemRepository, LayerElementService layerElementService) {
        super(simpleLayerItemRepository, layerElementService);
    }

    @Override
    protected SimpleLayerItem createInstance() {
        return new SimpleLayerItem();
    }
}
