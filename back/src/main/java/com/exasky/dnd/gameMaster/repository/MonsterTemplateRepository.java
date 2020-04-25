package com.exasky.dnd.gameMaster.repository;

import com.exasky.dnd.adventure.model.template.MonsterTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonsterTemplateRepository extends JpaRepository<MonsterTemplate, Long> {
}
