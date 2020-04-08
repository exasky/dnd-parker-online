package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.gameMaster.repository.GMLayerElementRepository;
import org.springframework.stereotype.Service;

@Service
public class LayerElementService {

    private final GMLayerElementRepository repository;

    public LayerElementService(GMLayerElementRepository repository) {
        this.repository = repository;
    }

    public LayerElement findById(Long id) {
        return repository.getOne(id);
    }
}
