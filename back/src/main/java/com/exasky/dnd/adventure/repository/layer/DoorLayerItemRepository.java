package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoorLayerItemRepository extends JpaRepository<DoorLayerItem, Long> {
}
