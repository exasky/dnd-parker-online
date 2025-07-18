package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.model.Initiative;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.model.template.CharacterTemplate;
import com.exasky.dnd.adventure.repository.*;
import com.exasky.dnd.adventure.rest.dto.card.ValidateCardDto;
import com.exasky.dnd.adventure.rest.dto.switch_equipment.ValidateSwitchDto;
import com.exasky.dnd.adventure.rest.dto.trade.ValidateTradeDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
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
        return this.repository.getReferenceById(id);
    }

    @Transactional
    public Adventure createOrUpdate(Adventure adventure, Campaign attachedCampaign) {
        Adventure attachedAdventure = Objects.nonNull(adventure.getId())
                ? repository.getReferenceById(adventure.getId())
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

        newAdventure.setBoards(boardService.copy(toCopy.getBoards(), newAdventure));
        newAdventure.setTraps(layerItemService.copy(toCopy.getTraps(), newAdventure));
        newAdventure.setDoors(layerItemService.copy(toCopy.getDoors(), newAdventure));
        newAdventure.setChests(layerItemService.copy(toCopy.getChests(), newAdventure));
        newAdventure.setMonsters(layerItemService.copy(toCopy.getMonsters(), newAdventure));
        newAdventure.setOtherItems(layerItemService.copy(toCopy.getOtherItems(), newAdventure));

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
            return null; // This line is unreachable but added to satisfy the compiler
        }

        Optional<Character> first = campaign.getCharacters().stream()
                .filter(character -> character.getId().equals(characterId)).findFirst();

        if (!first.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CHARACTER.NOT_FOUND);
        }

        Character toUpdate = first.get();
        toUpdate.setMaxHp(toBo.getMaxHp());
        toUpdate.setHp(toBo.getHp());
        toUpdate.setMaxMp(toBo.getMaxMp());
        toUpdate.setMp(toBo.getMp());
        toUpdate.updateEquipments(toBo.getEquipments().stream()
                .map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
                .collect(Collectors.toList()));
        toUpdate.updateBackPack(toBo.getBackPack().stream()
                .map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
                .collect(Collectors.toList()));

        return characterRepository.save(toUpdate);
    }

    @Transactional
    public <T extends LayerItem> T addLayerItem(Long adventureId, T toAdd) {
        Adventure attachedAdventure = repository.getReferenceById(adventureId);

        T newLayerItem = layerItemService.createOrUpdate(toAdd, attachedAdventure);
        List<T> elementListForLayerItem = getElementListForLayerItem(attachedAdventure, toAdd);
        elementListForLayerItem.add(newLayerItem);

        return newLayerItem;
    }

    @Transactional
    public <T extends LayerItem> T updateLayerItem(Long adventureId, T toAdd) {
        Adventure attachedAdventure = repository.getReferenceById(adventureId);

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
        Adventure attachedAdventure = repository.getReferenceById(adventureId);
        T attachedLayerItem = layerItemService.getOne(toDelete);

        List<T> elementListForLayerItem = getElementListForLayerItem(attachedAdventure, attachedLayerItem);
        elementListForLayerItem.remove(attachedLayerItem);
    }

    @SuppressWarnings("unchecked")
    private <T extends LayerItem> List<T> getElementListForLayerItem(Adventure adv, T layerItem) {
        switch (layerItem.getLayerElement().getType()) {
            case TRAP:
                return (List<T>) adv.getTraps();
            case DOOR:
                return (List<T>) adv.getDoors();
            case CHEST:
                return (List<T>) adv.getChests();
            case MONSTER:
                return (List<T>) adv.getMonsters();
            case CHARACTER:
                return (List<T>) adv.getCharacters();
            default:
                return (List<T>) adv.getOtherItems();
        }
    }

    public CharacterItem getNextCardToDraw(Long adventureId) {
        Campaign campaign = this.campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }

        // noinspection OptionalGetWithoutIsPresent
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
     * Does not add the card to the drawn items because the card should be a unique
     * item (like star level items)
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
    public Character validateDrawnCard(Long adventureId, ValidateCardDto dto) {
        Campaign campaign = campaignRepository.getByAdventureId(adventureId);

        if (Objects.isNull(campaign)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }

        Optional<CharacterItem> optCharacterItem = characterItemRepository.findById(dto.getCharacterItemId());
        if (!optCharacterItem.isPresent()) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CHARACTER_ITEM.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }

        CharacterItem drawnCard = optCharacterItem.get();

        if (Objects.isNull(dto.getEquipToEquipment())) {
            campaign.getDrawnItems().add(drawnCard);
            campaignRepository.save(campaign);
        } else {
            Character character = characterRepository.getReferenceById(dto.getCharacterId());
            (dto.getEquipToEquipment() ? character.getEquipments() : character.getBackPack()).add(drawnCard);
            return characterRepository.save(character);
        }

        return null;
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    public Initiative nextTurn(Long adventureId) {
        Adventure adventure = getById(adventureId);

        if (Objects.isNull(adventure)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.ADVENTURE.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }

        List<Initiative> characterTurns = adventure.getCampaign().getCharacterTurns();

        short nextNumber = (short) (adventure.getCurrentInitiative().getNumber() + 1);
        if (nextNumber > characterTurns.size()) {
            nextNumber = 1;
        }

        for (Initiative init : characterTurns) {
            if (init.getNumber() == nextNumber) {
                adventure.setCurrentInitiative(init);
                break;
            }
        }

        repository.save(adventure);

        return adventure.getCurrentInitiative();
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    @Transactional
    public List<Character> trade(ValidateTradeDto trade) {
        Character from = this.characterRepository.getReferenceById(trade.getFromCharacterId());
        Character to = this.characterRepository.getReferenceById(trade.getToCharacterId());

        simpleTrade(from, to,
                trade.getFromCharacterEquipment(), trade.getFromCharacterIsEquipment(),
                trade.getToCharacterIsEquipment());

        simpleTrade(to, from,
                trade.getToCharacterEquipment(), trade.getToCharacterIsEquipment(),
                trade.getFromCharacterIsEquipment());

        return Arrays.asList(from, to);
    }

    private void simpleTrade(Character from, Character to,
            Long fromCharacterEquipmentId, Boolean fromCharacterIsEquipment,
            Boolean toCharacterIsEquipment) {
        if (Objects.nonNull(fromCharacterEquipmentId)) {
            List<CharacterItem> items = fromCharacterIsEquipment ? from.getEquipments() : from.getBackPack();
            Optional<CharacterItem> optFromItem = items.stream()
                    .filter(item -> item.getId().equals(fromCharacterEquipmentId)).findFirst();
            if (optFromItem.isPresent()) {
                CharacterItem fromItem = optFromItem.get();
                items.remove(fromItem);

                (toCharacterIsEquipment != null && toCharacterIsEquipment ? to.getEquipments() : to.getBackPack())
                        .add(fromItem);
            }
        }
    }

    @PreAuthorize("hasRole('ROLE_GM')")
    @Transactional
    public Character switchEquipment(ValidateSwitchDto switchDto) {
        Character toUpdate = characterRepository.getReferenceById(switchDto.getCharacterId());

        if (Objects.nonNull(switchDto.getCharacterEquippedItemId())) {
            Optional<CharacterItem> optEq = toUpdate.getEquipments().stream()
                    .filter(eq -> eq.getId().equals(switchDto.getCharacterEquippedItemId())).findFirst();
            if (optEq.isPresent()) {
                CharacterItem eq = optEq.get();
                toUpdate.getEquipments().remove(eq);
                toUpdate.getBackPack().add(eq);
            }
        }

        if (Objects.nonNull(switchDto.getCharacterBackpackItemId())) {
            Optional<CharacterItem> optBp = toUpdate.getBackPack().stream()
                    .filter(eq -> eq.getId().equals(switchDto.getCharacterBackpackItemId())).findFirst();
            if (optBp.isPresent()) {
                CharacterItem bp = optBp.get();
                toUpdate.getBackPack().remove(bp);
                toUpdate.getEquipments().add(bp);
            }
        }

        return toUpdate;
    }
}
