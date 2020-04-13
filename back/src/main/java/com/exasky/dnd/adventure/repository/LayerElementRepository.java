package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.layer.LayerElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LayerElementRepository extends JpaRepository<LayerElement, Long> {
}
