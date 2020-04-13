package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.layer.Layer;
import com.exasky.dnd.adventure.repository.LayerRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class LayerService {

    private final LayerRepository layerRepository;
    private final LayerItemService layerItemService;

    public LayerService(LayerRepository layerRepository,
                        LayerItemService layerItemService) {
        this.layerRepository = layerRepository;
        this.layerItemService = layerItemService;
    }

    public Layer createOrUpdate(Layer layer) {
        return Objects.isNull(layer.getId()) ? create(layer) : update(layer);
    }

    private Layer create(Layer layer) {
        Layer newLayer = layerRepository.save(new Layer());

        newLayer.updateItems(layerItemService.createOrUpdate(layer.getItems(), newLayer));

        return newLayer;
    }

    private Layer update(Layer layer) {
        Layer attachedLayer = layerRepository.getOne(layer.getId());

        attachedLayer.updateItems(layerItemService.createOrUpdate(layer.getItems(), attachedLayer));

        return attachedLayer;
    }
}
