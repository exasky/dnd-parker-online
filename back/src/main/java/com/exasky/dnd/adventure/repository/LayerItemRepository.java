package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.layer.LayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LayerItemRepository extends JpaRepository<LayerItem, Long> {
}
