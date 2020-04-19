package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.layer.Layer;
import com.exasky.dnd.adventure.model.layer.LayerItem;
import com.exasky.dnd.adventure.repository.LayerItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class LayerItemService {

    private final LayerItemRepository layerItemRepository;
    private final LayerElementService layerElementService;

    public LayerItemService(LayerItemRepository layerItemRepository,
                            LayerElementService layerElementService) {
        this.layerItemRepository = layerItemRepository;
        this.layerElementService = layerElementService;
    }

    public List<LayerItem> createOrUpdate(List<LayerItem> items, Layer attachedLayer) {
        return items.stream()
                .map(layerItem -> createOrUpdate(layerItem, attachedLayer))
                .collect(Collectors.toList());
    }

    public LayerItem createOrUpdate(LayerItem layerItem, Layer attachedLayer) {
        return Objects.isNull(layerItem.getId())
                ? create(layerItem, attachedLayer)
                : update(layerItem);
    }

    public LayerItem copy(LayerItem toCopy, Layer layer) {
        LayerItem toSave = new LayerItem();

        toSave.setLayer(layer);
        toSave.setPositionY(toCopy.getPositionY());
        toSave.setPositionX(toCopy.getPositionX());
        toSave.setLayerElement(layerElementService.findById(toCopy.getLayerElement().getId()));

        return toSave;
    }

    public LayerItem create(LayerItem toCreate, Layer attachedLayer) {
        LayerItem toSave = new LayerItem();

        toSave.setLayer(attachedLayer);
        toSave.setPositionY(toCreate.getPositionY());
        toSave.setPositionX(toCreate.getPositionX());
        toSave.setLayerElement(layerElementService.findById(toCreate.getLayerElement().getId()));

        return layerItemRepository.save(toSave);
    }

    private LayerItem update(LayerItem toUpdate) {
        LayerItem attachedToUpdate = getOne(toUpdate.getId());

        attachedToUpdate.setPositionY(toUpdate.getPositionY());
        attachedToUpdate.setPositionX(toUpdate.getPositionX());
        attachedToUpdate.setLayerElement(layerElementService.findById(toUpdate.getLayerElement().getId()));

        return layerItemRepository.save(attachedToUpdate);
    }

    public LayerItem getOne(Long id) {
        return layerItemRepository.getOne(id);
    }
}
