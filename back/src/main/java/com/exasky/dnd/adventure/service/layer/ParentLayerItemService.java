package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.service.LayerElementService;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class ParentLayerItemService<LAYER_ITEM extends LayerItem> {
    protected final JpaRepository<LAYER_ITEM, Long> repository;
    protected final LayerElementService layerElementService;

    protected ParentLayerItemService(JpaRepository<LAYER_ITEM, Long> repository, LayerElementService layerElementService) {
        this.repository = repository;
        this.layerElementService = layerElementService;
    }

    protected abstract LAYER_ITEM createInstance();

    public LAYER_ITEM getOne(Long id) {
        return repository.getOne(id);
    }

    public LAYER_ITEM create(LAYER_ITEM toCreate, Adventure attachedAdventure) {
        LAYER_ITEM layerItem = this.createInstance();

        layerItem.setAdventure(attachedAdventure);
        layerItem.setPositionX(toCreate.getPositionX());
        layerItem.setPositionY(toCreate.getPositionY());
        layerItem.setLayerElement(layerElementService.findById(toCreate.getLayerElement().getId()));

        specific_create(layerItem, toCreate, attachedAdventure);

        return repository.save(layerItem);
    }

    protected void specific_create(LAYER_ITEM newLayerItem, LAYER_ITEM toCreate, Adventure attachedAdventure) {
    }

    public LAYER_ITEM update(LAYER_ITEM toUpdate) {
        LAYER_ITEM layerItem = repository.getOne(toUpdate.getId());

        layerItem.setPositionX(toUpdate.getPositionX());
        layerItem.setPositionY(toUpdate.getPositionY());
        layerItem.setLayerElement(layerElementService.findById(toUpdate.getLayerElement().getId()));

        specific_update(layerItem, toUpdate);

        return repository.save(layerItem);
    }

    public void specific_update(LAYER_ITEM updatedLayerItem, LAYER_ITEM toUpdate) {
    }

    public LAYER_ITEM copy(LAYER_ITEM toCopy, Adventure adventure) {
        LAYER_ITEM layerItem = this.createInstance();

        layerItem.setAdventure(adventure);
        layerItem.setPositionX(toCopy.getPositionX());
        layerItem.setPositionY(toCopy.getPositionY());
        layerItem.setLayerElement(layerElementService.findById(toCopy.getLayerElement().getId()));

        specific_copy(layerItem, toCopy, adventure);

        return repository.save(layerItem);
    }

    public void specific_copy(LAYER_ITEM newLayerItem, LAYER_ITEM toCopy, Adventure adventure) {
    }
}
