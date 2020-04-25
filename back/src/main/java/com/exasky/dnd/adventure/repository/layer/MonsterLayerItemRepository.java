package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.ChestLayerItem;
import com.exasky.dnd.adventure.model.layer.item.MonsterLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonsterLayerItemRepository extends JpaRepository<MonsterLayerItem, Long> {
}
