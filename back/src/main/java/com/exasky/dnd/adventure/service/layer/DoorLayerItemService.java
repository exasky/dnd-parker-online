package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.repository.layer.DoorLayerItemRepository;
import org.springframework.stereotype.Service;

@Service
public class DoorLayerItemService extends ParentLayerItemService<DoorLayerItem> {
    public DoorLayerItemService(DoorLayerItemRepository doorLayerItemRepository, LayerElementRepository repo) {
        super(doorLayerItemRepository, repo);
    }

    @Override
    protected DoorLayerItem createInstance() {
        return new DoorLayerItem();
    }

    @Override
    protected void specific_create(DoorLayerItem newLayerItem, DoorLayerItem toCreate, Adventure attachedAdventure) {
        newLayerItem.setVertical(toCreate.getVertical());
        newLayerItem.setOpen(toCreate.getOpen());
    }

    @Override
    public void specific_update(DoorLayerItem updatedLayerItem, DoorLayerItem toUpdate) {
        specific_create(updatedLayerItem, toUpdate, null);
    }

    @Override
    public void specific_copy(DoorLayerItem newLayerItem, DoorLayerItem toCopy, Adventure adventure) {
        specific_create(newLayerItem, toCopy, null);
    }
}
