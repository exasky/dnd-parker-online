package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Dice;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.repository.*;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import com.exasky.dnd.gameMaster.repository.GMLayerElementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
// TODO refacto this class to call right services...
public class GMService {

    private final LayerRepository layerRepository;
    private final LayerItemRepository layerItemRepository;
    private final GMLayerElementRepository layerElementRepository;
    private final CampaignRepository campaignRepository;
    private final CharacterItemRepository characterItemRepository;
    private final DiceRepository diceRepository;
    private final BoardRepository boardRepository;
    private final AdventureRepository adventureRepository;
    private final AdventureService adventureService;
    private final CharacterService characterService;

    @Autowired
    public GMService(LayerRepository layerRepository,
                     LayerItemRepository layerItemRepository,
                     GMLayerElementRepository repository,
                     CampaignRepository campaignRepository,
                     CharacterItemRepository characterItemRepository,
                     DiceRepository diceRepository,
                     BoardRepository boardRepository,
                     AdventureRepository adventureRepository,
                     AdventureService adventureService,
                     CharacterService characterService) {
        this.layerRepository = layerRepository;
        this.layerItemRepository = layerItemRepository;
        this.layerElementRepository = repository;
        this.campaignRepository = campaignRepository;
        this.characterItemRepository = characterItemRepository;
        this.diceRepository = diceRepository;
        this.boardRepository = boardRepository;
        this.adventureRepository = adventureRepository;
        this.adventureService = adventureService;
        this.characterService = characterService;
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    public List<LayerElement> getAddableElements() {
        return this.layerElementRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    public List<CharacterItem> getAllCharacterItems() {
        return this.characterItemRepository.findAll();
    }

    public List<Dice> getAllDices() {
        return this.diceRepository.findAll();
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign getCampaign(Long id) {
        Campaign foundCampaign = campaignRepository.getById(id);

        if (Objects.isNull(foundCampaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        return foundCampaign;
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    @Transactional
    public Campaign createCampaign(Campaign toCreate) {
        Campaign attachedCampaign = this.campaignRepository.save(new Campaign());

        attachedCampaign.setName(toCreate.getName());

        attachedCampaign.updateAdventures(toCreate.getAdventures().stream().
                map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                .collect(Collectors.toList()));

        attachedCampaign.updateCharacters(toCreate.getCharacters().stream()
                .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                .collect(Collectors.toList()));

        if (!attachedCampaign.getAdventures().isEmpty()) {
            attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
        }

        return attachedCampaign;
    }

    @Transactional
    public Campaign updateCampaign(Long id, Campaign toUpdate) {
        Campaign attachedCampaign = this.campaignRepository.getById(id);

        if (Objects.isNull(attachedCampaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        attachedCampaign.setName(toUpdate.getName());

        attachedCampaign.updateAdventures(toUpdate.getAdventures().stream().
                map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                .collect(Collectors.toList()));

        attachedCampaign.updateCharacters(toUpdate.getCharacters().stream()
                .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                .collect(Collectors.toList()));

        if (!attachedCampaign.getAdventures().isEmpty()) {
            if (Objects.nonNull(attachedCampaign.getCurrentAdventure()) &&
                    attachedCampaign.getAdventures().stream()
                            .noneMatch(adv -> adv.getId().equals(attachedCampaign.getCurrentAdventure().getId()))) {
                attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
            } else if (Objects.isNull(attachedCampaign.getCurrentAdventure())) {
                attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
            }
        } else {
            attachedCampaign.setCurrentAdventure(null);
        }

        return attachedCampaign;
    }

    @Transactional
    public void deleteCampaign(Long campaignId) {
        Campaign campaign = this.campaignRepository.getById(campaignId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        campaign.getAdventures().forEach(adventure -> {
            adventure.getBoards().forEach(boardRepository::delete);
            adventure.getBoards().clear();

            if (Objects.nonNull(adventure.getMjLayer())) {
                adventure.getMjLayer().getItems().forEach(layerItemRepository::delete);
                adventure.getMjLayer().getItems().clear();
                layerRepository.delete(adventure.getMjLayer());
            }

            if (Objects.nonNull(adventure.getCharacterLayer())) {
                adventure.getCharacterLayer().getItems().forEach(layerItemRepository::delete);
                adventure.getCharacterLayer().getItems().clear();
                layerRepository.delete(adventure.getCharacterLayer());
            }

            adventureRepository.delete(adventure);
        });
        campaign.getAdventures().clear();

        campaign.getCharacters().forEach(character -> {
            character.getEquipments().clear();
            character.getBackPack().clear();
        });
        campaign.getCharacters().clear();

        campaign.getDrawnItems().clear();

        campaignRepository.delete(campaign);
    }

    public CharacterItem drawCard(Long adventureId) {
        Campaign campaign = this.campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        //noinspection OptionalGetWithoutIsPresent
        Short adventureLevel = campaign.getAdventures()
                .stream()
                .filter(a -> a.getId().equals(adventureId)).findFirst().get().getLevel();

        List<Long> itemOnCharacterIds = campaign.getCharacters().stream()
                .flatMap(c -> Stream.of(c.getEquipments(), c.getBackPack()).flatMap(Collection::stream))
                .map(CharacterItem::getId)
                .collect(Collectors.toList());

        List<Long> drawnCardIds = campaign.getDrawnItems().stream()
                .map(CharacterItem::getId)
                .collect(Collectors.toList());

        Set<Long> usedItemIds = Stream.of(itemOnCharacterIds, drawnCardIds)
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        List<CharacterItem> availableCards = usedItemIds.isEmpty()
                ? characterItemRepository.findAllByLevelLessThanEqual(adventureLevel)
                : characterItemRepository.findAllByIdNotInAndLevelLessThanEqual(usedItemIds, adventureLevel);

        // Clear the discard
        if (availableCards.isEmpty()) {
            campaign.getDrawnItems().clear();
            campaignRepository.save(campaign);
            availableCards = itemOnCharacterIds.isEmpty()
                    ? characterItemRepository.findAllByLevelLessThanEqual(adventureLevel)
                    : characterItemRepository.findAllByIdNotInAndLevelLessThanEqual(usedItemIds, adventureLevel);
        }
        CharacterItem drawnCard = availableCards.get(new Random().nextInt(availableCards.size()));

        campaign.getDrawnItems().add(drawnCard);
        campaignRepository.save(campaign);

        return drawnCard;
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
