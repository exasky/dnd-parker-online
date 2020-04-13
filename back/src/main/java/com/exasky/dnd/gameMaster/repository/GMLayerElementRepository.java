package com.exasky.dnd.gameMaster.repository;

import com.exasky.dnd.adventure.model.layer.LayerElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GMLayerElementRepository extends JpaRepository<LayerElement, Long> {
}
