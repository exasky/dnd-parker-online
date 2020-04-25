package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.model.template.MonsterTemplate;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.gameMaster.repository.MonsterTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@PreAuthorize("hasRole('ROLE_GM')")
@Service
public class GMService {

    private final LayerElementRepository layerElementRepository;
    private final CharacterItemRepository characterItemRepository;
    private final MonsterTemplateRepository monsterTemplateRepository;
    private final AdventureService adventureService;

    @Autowired
    public GMService(LayerElementRepository repository,
                     CharacterItemRepository characterItemRepository,
                     MonsterTemplateRepository monsterTemplateRepository,
                     AdventureService adventureService) {
        this.layerElementRepository = repository;
        this.characterItemRepository = characterItemRepository;
        this.monsterTemplateRepository = monsterTemplateRepository;
        this.adventureService = adventureService;
    }


    public List<LayerElement> getAddableElements() {
        return layerElementRepository.findAll();
    }

    public List<CharacterItem> getAllCharacterItems() {
        return characterItemRepository.findAll();
    }

    public List<MonsterTemplate> getMonsterTemplates() {
        return monsterTemplateRepository.findAll();
    }

    @Transactional
    public Long findPreviousAdventureId(Long adventureId) {
        Adventure adventure = this.adventureService.getById(adventureId);
        Campaign campaign = adventure.getCampaign();
        List<Adventure> adventures = campaign.getAdventures();
        int adventureIdx = adventures.indexOf(adventure);
        if (adventureIdx <= 0) {
            return adventure.getId();
        } else {
            Adventure newCurrentAdventure = adventures.get(adventureIdx - 1);
            campaign.setCurrentAdventure(newCurrentAdventure);
            return newCurrentAdventure.getId();
        }
    }

    @Transactional
    public Long findNextAdventureId(Long adventureId) {
        Adventure adventure = this.adventureService.getById(adventureId);
        Campaign campaign = adventure.getCampaign();
        List<Adventure> adventures = campaign.getAdventures();
        int adventureIdx = adventures.indexOf(adventure);
        if (adventureIdx >= adventures.size() - 1) {
            return adventure.getId();
        } else {
            Adventure newCurrentAdventure = adventures.get(adventureIdx + 1);
            campaign.setCurrentAdventure(newCurrentAdventure);
            return newCurrentAdventure.getId();
        }
    }
}
