package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.repository.AdventureRepository;
import com.exasky.dnd.adventure.repository.BoardRepository;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
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
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
// TODO refacto this class to call right services...
public class GMService {

    private final GMLayerElementRepository layerElementRepository;
    private final CampaignRepository campaignRepository;
    private final CharacterItemRepository characterItemRepository;
    private final BoardRepository boardRepository;
    private final AdventureRepository adventureRepository;
    private final AdventureService adventureService;
    private final CharacterService characterService;

    @Autowired
    public GMService(GMLayerElementRepository repository,
                     CampaignRepository campaignRepository,
                     CharacterItemRepository characterItemRepository,
                     BoardRepository boardRepository,
                     AdventureRepository adventureRepository,
                     AdventureService adventureService,
                     CharacterService characterService) {
        this.layerElementRepository = repository;
        this.campaignRepository = campaignRepository;
        this.characterItemRepository = characterItemRepository;
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

    @PreAuthorize("hasRole('ROLE_GM')")
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

    public Campaign copyCampaign(Long campaignId) {
        Campaign toCopy = this.campaignRepository.getById(campaignId);
        if (Objects.isNull(toCopy)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        Campaign newCampaign = new Campaign();
        newCampaign.setName(toCopy.getName() + " - copy");

        newCampaign.setAdventures(toCopy.getAdventures().stream()
                .map(adventure -> adventureService.copy(adventure, newCampaign))
                .collect(Collectors.toList()));

        newCampaign.setCharacters(toCopy.getCharacters().stream()
                .map(character -> characterService.copy(character, newCampaign))
                .collect(Collectors.toList()));

        return newCampaign;
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

//            if (Objects.nonNull(adventure.getMjLayer())) {
//                adventure.getMjLayer().getItems().forEach(layerItemRepository::delete);
//                adventure.getMjLayer().getItems().clear();
//                layerRepository.delete(adventure.getMjLayer());
//            }
//
//            if (Objects.nonNull(adventure.getCharacterLayer())) {
//                adventure.getCharacterLayer().getItems().forEach(layerItemRepository::delete);
//                adventure.getCharacterLayer().getItems().clear();
//                layerRepository.delete(adventure.getCharacterLayer());
//            }

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
