package com.exasky.dnd.user.repository;

import com.exasky.dnd.user.model.DnDUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<DnDUser, Long> {
    Optional<DnDUser> findByUsername(String username);
}
