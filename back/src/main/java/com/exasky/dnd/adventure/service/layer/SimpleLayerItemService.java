package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.repository.layer.SimpleLayerItemRepository;
import org.springframework.stereotype.Service;

@Service
public class SimpleLayerItemService extends ParentLayerItemService<SimpleLayerItem> {

    public SimpleLayerItemService(SimpleLayerItemRepository simpleLayerItemRepository, LayerElementRepository repo) {
        super(simpleLayerItemRepository, repo);
    }

    @Override
    protected SimpleLayerItem createInstance() {
        return new SimpleLayerItem();
    }
}
