package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.template.CharacterTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterTemplateRepository extends JpaRepository<CharacterTemplate, Long> {
}
