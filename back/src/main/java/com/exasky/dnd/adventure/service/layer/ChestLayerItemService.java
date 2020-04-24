package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.ChestLayerItem;
import com.exasky.dnd.adventure.repository.layer.ChestLayerItemRepository;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.stereotype.Service;

@Service
public class ChestLayerItemService extends ParentLayerItemService<ChestLayerItem> {
    public ChestLayerItemService(ChestLayerItemRepository chestLayerItemRepository, LayerElementService layerElementService) {
        super(chestLayerItemRepository, layerElementService);
    }

    @Override
    protected ChestLayerItem createInstance() {
        return new ChestLayerItem();
    }

    @Override
    protected void specific_create(ChestLayerItem newLayerItem, ChestLayerItem toCreate, Adventure attachedAdventure) {
        newLayerItem.setSpecificCard(toCreate.getSpecificCard());
    }

    @Override
    public void specific_update(ChestLayerItem updatedLayerItem, ChestLayerItem toUpdate) {
        specific_create(updatedLayerItem, toUpdate, null);
    }

    @Override
    public void specific_copy(ChestLayerItem newLayerItem, ChestLayerItem toCopy, Adventure adventure) {
        specific_create(newLayerItem, toCopy, null);
    }
}
