package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.*;
import com.exasky.dnd.adventure.service.layer.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BridgeLayerItemService {

    private final SimpleLayerItemService simpleLayerItemService;
    private final DoorLayerItemService doorLayerItemService;
    private final TrapLayerItemService trapLayerItemService;
    private final ChestLayerItemService chestLayerItemService;

    public BridgeLayerItemService(SimpleLayerItemService simpleLayerItemService,
                                  DoorLayerItemService doorLayerItemService,
                                  TrapLayerItemService trapLayerItemService,
                                  ChestLayerItemService chestLayerItemService) {
        this.simpleLayerItemService = simpleLayerItemService;
        this.doorLayerItemService = doorLayerItemService;
        this.trapLayerItemService = trapLayerItemService;
        this.chestLayerItemService = chestLayerItemService;
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

    public <T extends LayerItem> List<T> copy(List<T> toCopy, Adventure adventure) {
        return Objects.isNull(toCopy)
                ? new ArrayList<>()
                : toCopy.stream().map(copy -> getService(copy).copy(copy, adventure)).collect(Collectors.toList());
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
        switch (layerItem.getLayerElement().getType()) {
            case CHEST:
                return (S) chestLayerItemService;
            case DOOR:
                return (S) doorLayerItemService;
            case TRAP:
                return (S) trapLayerItemService;
            default:
                return (S) simpleLayerItemService;
        }
    }

}
