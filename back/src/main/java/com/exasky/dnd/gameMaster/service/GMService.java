package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Initiative;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.model.layer.item.MonsterLayerItem;
import com.exasky.dnd.adventure.model.template.MonsterTemplate;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import com.exasky.dnd.gameMaster.repository.MonsterTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@PreAuthorize("hasRole('ROLE_GM')")
@Service
public class GMService {

    private final LayerElementRepository layerElementRepository;
    private final CharacterItemRepository characterItemRepository;
    private final MonsterTemplateRepository monsterTemplateRepository;
    private final CampaignRepository campaignRepository;
    private final AdventureService adventureService;

    @Autowired
    public GMService(LayerElementRepository repository,
                     CharacterItemRepository characterItemRepository,
                     MonsterTemplateRepository monsterTemplateRepository,
                     CampaignRepository campaignRepository,
                     AdventureService adventureService) {
        this.layerElementRepository = repository;
        this.characterItemRepository = characterItemRepository;
        this.monsterTemplateRepository = monsterTemplateRepository;
        this.campaignRepository = campaignRepository;
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
    public List<Initiative> rollInitiative(Long adventureId) {
        Campaign campaign = campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        List<Initiative> charTurns = campaign.getCharacters().stream().map(character -> {
            Initiative charTurn = new Initiative();
            charTurn.setCampaign(campaign);
            charTurn.setCharacter(character);
            return charTurn;
        }).collect(Collectors.toList());

        Initiative gmTurn = new Initiative();
        gmTurn.setCampaign(campaign);
        charTurns.add(gmTurn);

        Collections.shuffle(charTurns);

        for (short initIdx = 0; initIdx < charTurns.size(); initIdx++) {
            charTurns.get(initIdx).setNumber(initIdx);
        }

        campaign.updateCharacterTurns(charTurns);

        return charTurns;
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

    @Transactional
    public MonsterLayerItem updateMonster(Long adventureId, Long monsterId, MonsterLayerItem toBo) {
        Adventure adventure = adventureService.getById(adventureId);

        if (Objects.isNull(adventure)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.ADVENTURE.NOT_FOUND);
        }

        Optional<MonsterLayerItem> optMonster
                = adventure.getMonsters().stream().filter(advMonster -> advMonster.getId().equals(monsterId)).findFirst();

        if (!optMonster.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.MONSTER.NOT_FOUND);
        }

        MonsterLayerItem toUpdate = optMonster.get();
        toUpdate.setHp(toBo.getHp());

        return toUpdate;
    }
}
