package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.card.CharacterItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterItemRepository extends JpaRepository<CharacterItem, Long> {
}
