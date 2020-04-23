package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;
import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.repository.layer.DoorLayerItemRepository;
import com.exasky.dnd.adventure.repository.layer.SimpleLayerItemRepository;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.stereotype.Service;

@Service
public class DoorLayerItemService {
    private final DoorLayerItemRepository doorLayerItemRepository;
    private final LayerElementService layerElementService;

    public DoorLayerItemService(DoorLayerItemRepository doorLayerItemRepository, LayerElementService layerElementService) {
        this.doorLayerItemRepository = doorLayerItemRepository;
        this.layerElementService = layerElementService;
    }

    public DoorLayerItem create(DoorLayerItem toCreate, Adventure attachedAdventure) {
        DoorLayerItem toSave = new DoorLayerItem();

        toSave.setAdventure(attachedAdventure);
        toSave.setPositionY(toCreate.getPositionY());
        toSave.setPositionX(toCreate.getPositionX());
        toSave.setLayerElement(layerElementService.findById(toCreate.getLayerElement().getId()));

        toSave.setVertical(toCreate.getVertical());
        toSave.setOpen(toCreate.getOpen());

        return doorLayerItemRepository.save(toSave);
    }

    public DoorLayerItem update(DoorLayerItem toUpdate) {
        DoorLayerItem attachedToUpdate = doorLayerItemRepository.getOne(toUpdate.getId());

        attachedToUpdate.setPositionY(toUpdate.getPositionY());
        attachedToUpdate.setPositionX(toUpdate.getPositionX());
        attachedToUpdate.setLayerElement(layerElementService.findById(toUpdate.getLayerElement().getId()));

        return doorLayerItemRepository.save(attachedToUpdate);
    }
}
