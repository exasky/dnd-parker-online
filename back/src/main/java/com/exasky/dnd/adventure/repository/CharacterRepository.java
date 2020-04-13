package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterRepository extends JpaRepository<Character, Long> {
}
