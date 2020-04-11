package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    @Query(value = "SELECT DISTINCT c FROM Campaign c " +
            "JOIN c.characters character " +
            "WHERE character.user.id = :userId")
    List<Campaign> findAllForUser(Long userId);

    @Query(value = "SELECT a.campaign FROM Adventure a " +
            "WHERE a.id = :adventureId")
    Campaign getByAdventureId(Long adventureId);
}
