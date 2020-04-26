package com.exasky.dnd.adventure.repository.layer;

import com.exasky.dnd.adventure.model.layer.item.CharacterLayerItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterLayerItemRepository extends JpaRepository<CharacterLayerItem, Long> {
}
