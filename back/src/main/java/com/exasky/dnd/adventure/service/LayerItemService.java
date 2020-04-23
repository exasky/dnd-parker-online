package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;
import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.repository.layer.SimpleLayerItemRepository;
import com.exasky.dnd.adventure.service.layer.DoorLayerItemService;
import com.exasky.dnd.adventure.service.layer.SimpleLayerItemService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class LayerItemService {

    private final SimpleLayerItemService simpleLayerItemService;
    private final DoorLayerItemService doorLayerItemService;

    public LayerItemService(SimpleLayerItemService simpleLayerItemService, DoorLayerItemService doorLayerItemService) {
        this.simpleLayerItemService = simpleLayerItemService;
        this.doorLayerItemService = doorLayerItemService;
    }

    public <T extends LayerItem> List<T> createOrUpdate(List<T> items, Adventure attachedAdventure) {
        return items.stream()
                .map(layerItem -> createOrUpdate(layerItem, attachedAdventure))
                .collect(Collectors.toList());
    }

    public <T extends LayerItem> T createOrUpdate(T layerItem, Adventure attachedAdventure) {
        return Objects.isNull(layerItem.getId())
                ? create(layerItem, attachedAdventure)
                : null;//update(layerItem);
    }
//
//    public LayerItem copy(LayerItem toCopy, Layer layer) {
//        LayerItem toSave = new LayerItem();
//
//        toSave.setLayer(layer);
//        toSave.setPositionY(toCopy.getPositionY());
//        toSave.setPositionX(toCopy.getPositionX());
//        toSave.setLayerElement(layerElementService.findById(toCopy.getLayerElement().getId()));
//
//        return toSave;
//    }
//
    public <T extends LayerItem> T create(T toCreate, Adventure attachedAdventure) {

        if (toCreate instanceof SimpleLayerItem) {
            return (T) this.simpleLayerItemService.create((SimpleLayerItem) toCreate, attachedAdventure);
        } else if (toCreate instanceof DoorLayerItem) {
            return (T) this.doorLayerItemService.create((DoorLayerItem) toCreate, attachedAdventure);
        } else {
            throw new RuntimeException("Unable to find instance of LayerItem");
        }
    }

    private <T extends LayerItem> T update(T toUpdate) {
        if (toUpdate instanceof SimpleLayerItem) {
            return (T) this.simpleLayerItemService.update((SimpleLayerItem) toUpdate);
        } else if (toUpdate instanceof DoorLayerItem) {
            return (T) this.doorLayerItemService.update((DoorLayerItem) toUpdate);
        } else {
            throw new RuntimeException("Unable to find instance of LayerItem");
        }
    }

    public LayerItem getOne(Long id) {
        return simpleLayerItemRepository.getOne(id);
    }
}
