package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Adventure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdventureRepository extends JpaRepository<Adventure, Long> {
}
