package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;
import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.model.layer.item.TrapLayerItem;
import com.exasky.dnd.adventure.service.layer.DoorLayerItemService;
import com.exasky.dnd.adventure.service.layer.ParentLayerItemService;
import com.exasky.dnd.adventure.service.layer.SimpleLayerItemService;
import com.exasky.dnd.adventure.service.layer.TrapLayerItemService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BridgeLayerItemService {

    private final SimpleLayerItemService simpleLayerItemService;
    private final DoorLayerItemService doorLayerItemService;
    private final TrapLayerItemService trapLayerItemService;

    public BridgeLayerItemService(SimpleLayerItemService simpleLayerItemService,
                                  DoorLayerItemService doorLayerItemService,
                                  TrapLayerItemService trapLayerItemService) {
        this.simpleLayerItemService = simpleLayerItemService;
        this.doorLayerItemService = doorLayerItemService;
        this.trapLayerItemService = trapLayerItemService;
    }

    public <T extends LayerItem> List<T> createOrUpdate(List<T> items, Adventure attachedAdventure) {
        return items.stream()
                .map(layerItem -> createOrUpdate(layerItem, attachedAdventure))
                .collect(Collectors.toList());
    }

    public <T extends LayerItem> T createOrUpdate(T layerItem, Adventure attachedAdventure) {
        return Objects.isNull(layerItem.getId())
                ? create(layerItem, attachedAdventure)
                : update(layerItem);
    }

    public <T extends LayerItem> T copy(T toCopy, Adventure adventure) {
        return getService(toCopy).copy(toCopy, adventure);
    }

    public <T extends LayerItem> T create(T toCreate, Adventure attachedAdventure) {
        return getService(toCreate).create(toCreate, attachedAdventure);
    }

    private <T extends LayerItem> T update(T toUpdate) {
        return getService(toUpdate).update(toUpdate);
    }

    public <T extends LayerItem> T getOne(T toDelete) {
        return getService(toDelete).getOne(toDelete.getId());
    }

    @SuppressWarnings("unchecked")
    private <T extends LayerItem, S extends ParentLayerItemService<T>> S getService(T layerItem) {
        if (layerItem instanceof SimpleLayerItem) {
            return (S) simpleLayerItemService;
        } else if (layerItem instanceof DoorLayerItem) {
            return (S) doorLayerItemService;
        } else if (layerItem instanceof TrapLayerItem) {
            return (S) trapLayerItemService;
        } else {
            throw new RuntimeException("Unable to find service for LayerItem type: " + layerItem.getLayerElement().getType());
        }
    }

}
