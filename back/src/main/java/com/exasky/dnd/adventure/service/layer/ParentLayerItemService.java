package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class ParentLayerItemService<LAYER_ITEM extends LayerItem> {
    protected final JpaRepository<LAYER_ITEM, Long> repository;
    protected final LayerElementRepository layerElementRepository;

    protected ParentLayerItemService(JpaRepository<LAYER_ITEM, Long> repository,
            LayerElementRepository layerElementRepository) {
        this.repository = repository;
        this.layerElementRepository = layerElementRepository;
    }

    protected abstract LAYER_ITEM createInstance();

    public LAYER_ITEM getOne(Long id) {
        return repository.getReferenceById(id);
    }

    public LAYER_ITEM create(LAYER_ITEM toCreate, Adventure attachedAdventure) {
        LAYER_ITEM layerItem = this.createInstance();

        layerItem.setAdventure(attachedAdventure);
        layerItem.setPositionX(toCreate.getPositionX());
        layerItem.setPositionY(toCreate.getPositionY());
        layerItem.setLayerElement(layerElementRepository.getReferenceById(toCreate.getLayerElement().getId()));

        specific_create(layerItem, toCreate, attachedAdventure);

        return repository.save(layerItem);
    }

    protected void specific_create(LAYER_ITEM newLayerItem, LAYER_ITEM toCreate, Adventure attachedAdventure) {
    }

    public LAYER_ITEM update(LAYER_ITEM toUpdate) {
        LAYER_ITEM layerItem = repository.getReferenceById(toUpdate.getId());

        layerItem.setPositionX(toUpdate.getPositionX());
        layerItem.setPositionY(toUpdate.getPositionY());
        layerItem.setLayerElement(layerElementRepository.getReferenceById(toUpdate.getLayerElement().getId()));

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
        layerItem.setLayerElement(layerElementRepository.getReferenceById(toCopy.getLayerElement().getId()));

        specific_copy(layerItem, toCopy, adventure);

        return layerItem;
    }

    public void specific_copy(LAYER_ITEM newLayerItem, LAYER_ITEM toCopy, Adventure adventure) {
    }
}
