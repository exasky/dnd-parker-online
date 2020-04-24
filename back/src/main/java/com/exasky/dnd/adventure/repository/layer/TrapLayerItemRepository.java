package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.TrapLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrapLayerItemRepository extends JpaRepository<TrapLayerItem, Long> {
}
