package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Dice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiceRepository extends JpaRepository<Dice, Long> {
}
