package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.CharacterTemplate;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.Layer;
import com.exasky.dnd.adventure.model.layer.LayerItem;
import com.exasky.dnd.adventure.repository.AdventureRepository;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.CharacterTemplateRepository;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.exasky.dnd.adventure.model.layer.LayerElementType.*;
import static com.exasky.dnd.common.Utils.getCurrentUser;

@Service
public class AdventureService {

    private final AdventureRepository repository;
    private final CampaignRepository campaignRepository;
    private final CharacterItemRepository characterItemRepository;
    private final CharacterTemplateRepository characterTemplateRepository;
    private final LayerItemService layerItemService;
    private final BoardService boardService;

    @Autowired
    public AdventureService(AdventureRepository repository,
                            CampaignRepository campaignRepository,
                            CharacterItemRepository characterItemRepository,
                            CharacterTemplateRepository characterTemplateRepository,
                            LayerItemService layerItemService,
                            BoardService boardService) {
        this.repository = repository;
        this.campaignRepository = campaignRepository;
        this.characterItemRepository = characterItemRepository;
        this.characterTemplateRepository = characterTemplateRepository;
        this.layerItemService = layerItemService;
        this.boardService = boardService;
    }

    public List<CharacterTemplate> getAllCharacterTemplate() {
        return characterTemplateRepository.findAll();
    }

    public List<Adventure> getAdventures() {
        return this.repository.findAll();
    }

    public Adventure getById(Long id) {
        return this.repository.getOne(id);
    }

    @Transactional
    public Adventure createOrUpdate(Adventure adventure, Campaign attachedCampaign) {
        Adventure attachedAdventure = Objects.nonNull(adventure.getId())
                ? repository.getOne(adventure.getId())
                : repository.save(new Adventure(attachedCampaign));

        attachedAdventure.setName(adventure.getName());
        attachedAdventure.setLevel(adventure.getLevel());

        attachedAdventure.updateBoards(boardService.createOrUpdate(attachedAdventure, adventure.getBoards()));

        return attachedAdventure;
    }

    public Adventure copy(Adventure toCopy, Campaign campaign) {
        Adventure newAdventure = new Adventure(campaign);

        newAdventure.setName(toCopy.getName());
        newAdventure.setLevel(toCopy.getLevel());

        newAdventure.setBoards(toCopy.getBoards().stream()
                .map(board -> boardService.copy(newAdventure, board))
                .collect(Collectors.toList()));

        newAdventure.getMjLayer().setItems(
                toCopy.getMjLayer().getItems().stream()
                        .map(layerItem -> layerItemService.copy(layerItem, newAdventure.getMjLayer()))
                        .collect(Collectors.toList()));

        newAdventure.getCharacterLayer().setItems(
                toCopy.getCharacterLayer().getItems().stream()
                        .map(layerItem -> layerItemService.copy(layerItem, newAdventure.getCharacterLayer()))
                        .collect(Collectors.toList())
        );

        return newAdventure;
    }

    public List<Campaign> getCampaignsForCurrentUser() {
        return this.campaignRepository.findAllForUser(getCurrentUser().getId());
    }

    @Transactional
    public LayerItem addLayerItem(Long id, LayerItem toAdd) {
        Adventure attachedAdventure = repository.getOne(id);

        Layer layerToAdd = getLayerForLayerElement(attachedAdventure, toAdd);
        LayerItem attachedLayerItem = this.layerItemService.createOrUpdate(toAdd, layerToAdd);
        layerToAdd.getItems().add(attachedLayerItem);

        return attachedLayerItem;
    }

    @Transactional
    public LayerItem updateLayerItem(Long adventureId, LayerItem toAdd) {
        Adventure attachedAdventure = repository.getOne(adventureId);

        Layer layerToUpdate = getLayerForLayerElement(attachedAdventure, toAdd);
        LayerItem attachedLayerItem = this.layerItemService.createOrUpdate(toAdd, layerToUpdate);

        LayerItem previousLayerItem = layerToUpdate.getItems().stream()
                .filter(layerItem -> layerItem.getId().equals(attachedLayerItem.getId()))
                .findFirst()
                .orElse(null);

        if (Objects.isNull(previousLayerItem)) {
            ValidationCheckException.throwError(Constant.Errors.ADVENTURE.LAYER_ITEM_NOT_FOUND);
        }

        int idx = layerToUpdate.getItems().indexOf(previousLayerItem);
        layerToUpdate.getItems().set(idx, attachedLayerItem);

        return attachedLayerItem;
    }

    @Transactional
    public void deleteLayerItem(Long adventureId, Long layerItemId) {
        Adventure attachedAdventure = repository.getOne(adventureId);
        LayerItem attachedLayerItem = this.layerItemService.getOne(layerItemId);

        Layer layerForLayerElement = getLayerForLayerElement(attachedAdventure, attachedLayerItem);
        layerForLayerElement.getItems().remove(attachedLayerItem);
    }

    private Layer getLayerForLayerElement(Adventure attachedAdventure, LayerItem layerItem) {
        return Arrays.asList(CHARACTER, MONSTER, TREE, PILLAR).contains(layerItem.getLayerElement().getType())
                ? attachedAdventure.getCharacterLayer()
                : attachedAdventure.getMjLayer();
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
}
