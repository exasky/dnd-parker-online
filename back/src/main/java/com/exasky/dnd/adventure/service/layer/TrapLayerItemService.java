package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.TrapLayerItem;
import com.exasky.dnd.adventure.repository.layer.TrapLayerItemRepository;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.stereotype.Service;

@Service
public class TrapLayerItemService extends ParentLayerItemService<TrapLayerItem> {
    public TrapLayerItemService(TrapLayerItemRepository trapLayerItemRepository, LayerElementService layerElementService) {
        super(trapLayerItemRepository, layerElementService);
    }

    @Override
    protected TrapLayerItem createInstance() {
        return new TrapLayerItem();
    }

    @Override
    protected void specific_create(TrapLayerItem newLayerItem, TrapLayerItem toCreate, Adventure attachedAdventure) {
        newLayerItem.setShown(toCreate.getShown());
        newLayerItem.setDeactivated(toCreate.getDeactivated());
    }

    @Override
    public void specific_update(TrapLayerItem updatedLayerItem, TrapLayerItem toUpdate) {
        specific_create(updatedLayerItem, toUpdate, null);
    }

    @Override
    public void specific_copy(TrapLayerItem newLayerItem, TrapLayerItem toCopy, Adventure adventure) {
        specific_create(newLayerItem, toCopy, null);
    }
}
