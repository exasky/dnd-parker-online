package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.log.AdventureLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdventureLogRepository extends JpaRepository<AdventureLog, Long> {
}
