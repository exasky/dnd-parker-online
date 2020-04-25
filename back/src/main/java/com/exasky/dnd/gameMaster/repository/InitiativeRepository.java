package com.exasky.dnd.gameMaster.repository;

import com.exasky.dnd.adventure.model.Initiative;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InitiativeRepository extends JpaRepository<Initiative, Long> {
}
