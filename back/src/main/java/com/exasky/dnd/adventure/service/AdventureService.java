package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.model.CharacterTemplate;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.item.*;
import com.exasky.dnd.adventure.repository.*;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.exasky.dnd.common.Utils.getCurrentUser;

@Service
public class AdventureService {

    private final AdventureRepository repository;
    private final CampaignRepository campaignRepository;
    private final CharacterRepository characterRepository;
    private final CharacterItemRepository characterItemRepository;
    private final CharacterTemplateRepository characterTemplateRepository;
    private final BridgeLayerItemService layerItemService;
    private final BoardService boardService;

    @Autowired
    public AdventureService(AdventureRepository repository,
                            CampaignRepository campaignRepository,
                            CharacterRepository characterRepository,
                            CharacterItemRepository characterItemRepository,
                            CharacterTemplateRepository characterTemplateRepository,
                            BridgeLayerItemService layerItemService,
                            BoardService boardService) {
        this.repository = repository;
        this.campaignRepository = campaignRepository;
        this.characterRepository = characterRepository;
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

        newAdventure.setTraps(toCopy.getTraps().stream()
                .map(trap -> layerItemService.copy(trap, newAdventure))
                .collect(Collectors.toList()));

        newAdventure.setDoors(toCopy.getDoors().stream()
                .map(trap -> layerItemService.copy(trap, newAdventure))
                .collect(Collectors.toList()));

        newAdventure.setChests(toCopy.getChests().stream()
                .map(trap -> layerItemService.copy(trap, newAdventure))
                .collect(Collectors.toList()));

        newAdventure.setOtherItems(toCopy.getOtherItems().stream()
                .map(trap -> layerItemService.copy(trap, newAdventure))
                .collect(Collectors.toList()));

        return newAdventure;
    }

    public void delete(Adventure attachedAdventure) {
        repository.delete(attachedAdventure);
    }

    public List<Campaign> getCampaignsForCurrentUser() {
        return campaignRepository.findAllForUser(getCurrentUser().getId());
    }

    public Character updateCharacter(Long adventureId, Long characterId, Character toBo) {
        Campaign campaign = campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        Optional<Character> first = campaign.getCharacters().stream().filter(character -> character.getId().equals(characterId)).findFirst();

        if (!first.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CHARACTER.NOT_FOUND);
        }

        Character toUpdate = first.get();
        toUpdate.setMaxHp(toBo.getMaxHp());
        toUpdate.setHp(toBo.getHp());
        toUpdate.setMaxMp(toBo.getMaxMp());
        toUpdate.setMp(toBo.getMp());
        toUpdate.updateEquipments(toBo.getEquipments().stream()
                .map(characterItem -> characterItemRepository.getOne(characterItem.getId()))
                .collect(Collectors.toList()));
        toUpdate.updateBackPack(toBo.getBackPack().stream()
                .map(characterItem -> characterItemRepository.getOne(characterItem.getId()))
                .collect(Collectors.toList()));

        return characterRepository.save(toUpdate);
    }

    @Transactional
    public <T extends LayerItem> T addLayerItem(Long adventureId, T toAdd) {
        Adventure attachedAdventure = repository.getOne(adventureId);

        T newLayerItem = layerItemService.createOrUpdate(toAdd, attachedAdventure);
        List<T> elementListForLayerItem = getElementListForLayerItem(attachedAdventure, toAdd);
        elementListForLayerItem.add(newLayerItem);

        return newLayerItem;
    }

    @Transactional
    public <T extends LayerItem> T updateLayerItem(Long adventureId, T toAdd) {
        Adventure attachedAdventure = repository.getOne(adventureId);

        T attachedLayerItem = this.layerItemService.createOrUpdate(toAdd, attachedAdventure);
        List<T> elementListForLayerItem = getElementListForLayerItem(attachedAdventure, toAdd);
        T prevItem = elementListForLayerItem.stream().filter(item -> item.getId().equals(attachedLayerItem.getId()))
                .findFirst()
                .orElse(null);

        if (Objects.isNull(prevItem)) {
            ValidationCheckException.throwError(Constant.Errors.ADVENTURE.LAYER_ITEM_NOT_FOUND);
        }

        int idx = elementListForLayerItem.indexOf(prevItem);
        elementListForLayerItem.set(idx, attachedLayerItem);

        return attachedLayerItem;
    }


    @Transactional
    public <T extends LayerItem> void deleteLayerItem(Long adventureId, T toDelete) {
        Adventure attachedAdventure = repository.getOne(adventureId);
        T attachedLayerItem = layerItemService.getOne(toDelete);

        List<T> elementListForLayerItem = getElementListForLayerItem(attachedAdventure, attachedLayerItem);
        elementListForLayerItem.remove(attachedLayerItem);
    }

    @SuppressWarnings("unchecked")
    private <T extends LayerItem> List<T> getElementListForLayerItem(Adventure adv, T layerItem) {
        if (layerItem instanceof SimpleLayerItem) {
            return (List<T>) adv.getOtherItems();
        } else if (layerItem instanceof TrapLayerItem) {
            return (List<T>) adv.getTraps();
        } else if (layerItem instanceof DoorLayerItem) {
            return (List<T>) adv.getDoors();
        } else if (layerItem instanceof ChestLayerItem){
            return (List<T>) adv.getChests();
        } else {
            throw new RuntimeException("Unable to find service for LayerItem type: " + layerItem.getLayerElement().getType());
        }
    }

    public CharacterItem getNextCardToDraw(Long adventureId) {
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

        return availableCards.get(new Random().nextInt(availableCards.size()));
    }

    /**
     * Does not add the card to the drawn items because the card should be a unique item (like star level items)
     */
    @PreAuthorize("hasRole('ROLE_GM')")
    public CharacterItem drawSpecificCard(Long characterItemId) {
        Optional<CharacterItem> byId = characterItemRepository.findById(characterItemId);

        if (!byId.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CHARACTER_ITEM.NOT_FOUND);
        }

        return byId.get();
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    public CharacterItem validateDrawnCard(Long adventureId, Long characterItemId) {
        Campaign campaign = campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }

        Optional<CharacterItem> optCharacterItem = characterItemRepository.findById(characterItemId);
        if (!optCharacterItem.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CHARACTER_ITEM.NOT_FOUND);
        }

        CharacterItem drawnCard = optCharacterItem.get();

        campaign.getDrawnItems().add(drawnCard);
        campaignRepository.save(campaign);

        return drawnCard;
    }
}
