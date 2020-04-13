package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
