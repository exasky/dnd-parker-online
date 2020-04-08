package com.exasky.dnd.adventure.repository;

import com.exasky.dnd.adventure.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
}
