package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.ChestLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChestLayerItemRepository extends JpaRepository<ChestLayerItem, Long> {
}
