package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.SimpleLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimpleLayerItemRepository extends JpaRepository<SimpleLayerItem, Long> {
}
