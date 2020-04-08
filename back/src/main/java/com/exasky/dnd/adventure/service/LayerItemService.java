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
                .map(layerItem ->
                        Objects.isNull(layerItem.getId())
                                ? create(layerItem, attachedLayer)
                                : update(layerItem)
                ).collect(Collectors.toList());
    }

    private LayerItem create(LayerItem toCreate, Layer attachedLayer) {
        LayerItem toSave = new LayerItem();

        toSave.setLayer(attachedLayer);
        toSave.setPositionY(toCreate.getPositionY());
        toSave.setPositionX(toCreate.getPositionX());
        toSave.setLayerElement(layerElementService.findById(toCreate.getLayerElement().getId()));

        return layerItemRepository.save(toSave);
    }

    private LayerItem update(LayerItem toUpdate) {
        LayerItem attachedToUpdate = layerItemRepository.getOne(toUpdate.getId());

        attachedToUpdate.setPositionY(toUpdate.getPositionY());
        attachedToUpdate.setPositionX(toUpdate.getPositionX());

        return layerItemRepository.save(attachedToUpdate);
    }
}
