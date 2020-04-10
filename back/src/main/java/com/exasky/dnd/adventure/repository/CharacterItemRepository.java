package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.card.CharacterItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CharacterItemRepository extends JpaRepository<CharacterItem, Long> {
    List<CharacterItem> findAllByIdNotInAndLevelLessThanEqual(Collection<Long> ids, Short level);

    void deleteAllById(Collection<Long> ids);
}
