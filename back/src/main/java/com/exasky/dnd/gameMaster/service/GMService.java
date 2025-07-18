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
import com.exasky.dnd.gameMaster.repository.InitiativeRepository;
import com.exasky.dnd.gameMaster.repository.MonsterTemplateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
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
    private final InitiativeRepository initiativeRepository;
    private final AdventureService adventureService;

    public GMService(LayerElementRepository repository,
            CharacterItemRepository characterItemRepository,
            MonsterTemplateRepository monsterTemplateRepository,
            CampaignRepository campaignRepository,
            InitiativeRepository initiativeRepository,
            AdventureService adventureService) {
        this.layerElementRepository = repository;
        this.characterItemRepository = characterItemRepository;
        this.monsterTemplateRepository = monsterTemplateRepository;
        this.campaignRepository = campaignRepository;
        this.initiativeRepository = initiativeRepository;
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
        Adventure adventure = adventureService.getById(adventureId);

        if (Objects.isNull(adventure)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.ADVENTURE.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }

        if (adventure.getCharacters().size() != 4) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND,
                    Constant.Errors.ADVENTURE.CHARACTERS_SIZE_MISMATCH);
        }

        Campaign campaign = adventure.getCampaign();

        List<Initiative> charTurns;

        if (campaign.getCharacterTurns().isEmpty()) {
            charTurns = campaign.getCharacters().stream()
                    .map(character -> new Initiative(campaign, character))
                    .collect(Collectors.toList());
            Initiative gmTurn = new Initiative();
            gmTurn.setCampaign(campaign);
            charTurns.add(gmTurn);
            campaign.updateCharacterTurns(charTurns);
        } else {
            charTurns = campaign.getCharacterTurns();
        }

        Collections.shuffle(charTurns);

        for (short initIdx = 1; initIdx < charTurns.size() + 1; initIdx++) {
            charTurns.get(initIdx - 1).setNumber(initIdx);
        }

        List<Initiative> initiatives = initiativeRepository.saveAll(charTurns);

        adventure.setCurrentInitiative(initiatives.get(0));

        return charTurns;
    }

    @Transactional
    public void resetInitiative(Long adventureId) {
        Adventure adventure = adventureService.getById(adventureId);

        if (Objects.isNull(adventure)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.ADVENTURE.NOT_FOUND);
            return; // This line is unreachable but added to satisfy the compiler
        }
        adventure.setCurrentInitiative(null);

        adventure.getCampaign().getCharacterTurns().forEach(initiativeRepository::delete);
        adventure.getCampaign().getCharacterTurns().clear();
    }

    @Transactional
    public List<Initiative> updateInitiative(Long adventureId, List<Initiative> updated) {
        Campaign campaign = campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return Collections.emptyList(); // This line is unreachable but added to satisfy the compiler
        }

        updated.forEach(update -> {
            Optional<Initiative> optInit = campaign.getCharacterTurns().stream()
                    .filter(ct -> ct.getId().equals(update.getId())).findFirst();
            if (!optInit.isPresent()) {
                ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.INITIATIVE.NOT_FOUND);
            }
            optInit.get().setNumber(update.getNumber());
        });

        return campaign.getCharacterTurns();
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
            adventure.setCurrentInitiative(null);
            campaign.getCharacterTurns().clear();
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
            adventure.setCurrentInitiative(null);
            campaign.getCharacterTurns().clear();
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
            return null; // This line is unreachable but added to satisfy the compiler
        }

        Optional<MonsterLayerItem> optMonster = adventure.getMonsters().stream()
                .filter(advMonster -> advMonster.getId().equals(monsterId)).findFirst();

        if (!optMonster.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.MONSTER.NOT_FOUND);
        }

        MonsterLayerItem toUpdate = optMonster.get();
        toUpdate.setHp(toBo.getHp());

        return toUpdate;
    }
}
