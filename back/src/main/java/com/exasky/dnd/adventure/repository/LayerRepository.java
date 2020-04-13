package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.layer.Layer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LayerRepository extends JpaRepository<Layer, Long> {
}
