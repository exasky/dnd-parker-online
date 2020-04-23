package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import com.exasky.dnd.adventure.repository.layer.SimpleLayerItemRepository;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.stereotype.Service;

@Service
public class SimpleLayerItemService {
    private final SimpleLayerItemRepository simpleLayerItemRepository;
    private final LayerElementService layerElementService;

    public SimpleLayerItemService(SimpleLayerItemRepository simpleLayerItemRepository, LayerElementService layerElementService) {
        this.simpleLayerItemRepository = simpleLayerItemRepository;
        this.layerElementService = layerElementService;
    }

    public SimpleLayerItem create(SimpleLayerItem toCreate, Adventure attachedAdventure) {
        SimpleLayerItem toSave = new SimpleLayerItem();

        toSave.setAdventure(attachedAdventure);
        toSave.setPositionY(toCreate.getPositionY());
        toSave.setPositionX(toCreate.getPositionX());
        toSave.setLayerElement(layerElementService.findById(toCreate.getLayerElement().getId()));

        return simpleLayerItemRepository.save(toSave);
    }

    public SimpleLayerItem update(SimpleLayerItem toUpdate) {
        SimpleLayerItem attachedToUpdate = simpleLayerItemRepository.getOne(toUpdate.getId());

        attachedToUpdate.setPositionY(toUpdate.getPositionY());
        attachedToUpdate.setPositionX(toUpdate.getPositionX());
        attachedToUpdate.setLayerElement(layerElementService.findById(toUpdate.getLayerElement().getId()));

        return simpleLayerItemRepository.save(attachedToUpdate);
    }
}
