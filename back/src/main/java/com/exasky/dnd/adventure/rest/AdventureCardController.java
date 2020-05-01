package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.model.card.CardType;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.item.ChestLayerItem;
import com.exasky.dnd.adventure.model.log.AdventureLog;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.rest.dto.AdventureLogDto;
import com.exasky.dnd.adventure.rest.dto.CharacterDto;
import com.exasky.dnd.adventure.rest.dto.card.AskDrawCardDto;
import com.exasky.dnd.adventure.rest.dto.card.CardMessageDto;
import com.exasky.dnd.adventure.rest.dto.card.DrawnCardDto;
import com.exasky.dnd.adventure.rest.dto.card.ValidateCardDto;
import com.exasky.dnd.adventure.rest.dto.layer.ChestLayerItemDto;
import com.exasky.dnd.adventure.service.AdventureLogService;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.adventure.service.layer.ChestLayerItemService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureCardController {

    private final AdventureService adventureService;
    private final AdventureLogService adventureLogService;
    private final ChestLayerItemService chestLayerItemService;

    // TODO remove. UGLY
    private final CharacterItemRepository characterItemRepository;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureCardController(AdventureService adventureService,
                                   AdventureLogService adventureLogService,
                                   ChestLayerItemService chestLayerItemService,
                                   CharacterItemRepository characterItemRepository,
                                   SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
        this.adventureLogService = adventureLogService;
        this.chestLayerItemService = chestLayerItemService;
        this.characterItemRepository = characterItemRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Called by any one to draw a card
     */
    @PostMapping("/draw-card")
    public void drawCard(@RequestBody AskDrawCardDto drawCardDto) {
        Long adventureId = drawCardDto.getAdventureId();
        CharacterItemDto dto = CharacterItemDto.toDto(
                Objects.isNull(drawCardDto.getCharacterItemId())
                        ? adventureService.getNextCardToDraw(adventureId)
                        : adventureService.drawSpecificCard(drawCardDto.getCharacterItemId()));

        DrawnCardDto drawnCardDto = new DrawnCardDto(drawCardDto.getAdventureId(), drawCardDto.getCharacterId(), drawCardDto.getChestItemId(), dto);
        CardMessageDto messageDto = new CardMessageDto(CardMessageDto.CardMessageType.DRAW_CARD, drawnCardDto);
        messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, messageDto);
    }

    @GetMapping("/draw-card/{adventureId}/{isEquipment}")
    public void drawCardSetEmplacement(@PathVariable Long adventureId, @PathVariable String isEquipment) {
        CardMessageDto messageDto = new CardMessageDto(CardMessageDto.CardMessageType.SELECT_EQUIPMENT,
                "null".equals(isEquipment) ? null : Boolean.valueOf(isEquipment));
        messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, messageDto);
    }

    /**
     * Called by the GM to validate the previously drawn card
     */
    @PostMapping("/draw-card-validate")
    public void drawCardValidate(@RequestBody ValidateCardDto dto) {
        Long adventureId = dto.getAdventureId();
        AdventureMessageDto wsDto = new AdventureMessageDto();
        AdventureLog adventureLog;

        if (dto.getValidation()) {
            Character updatedCharacter = adventureService.validateDrawnCard(adventureId, dto);
            CharacterItem charItem = characterItemRepository.getOne(dto.getCharacterItemId());
            if (Objects.nonNull(updatedCharacter)) {
                wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CHARACTER);
                wsDto.setMessage(CharacterDto.toDto(updatedCharacter));
                messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);

                adventureLog = charItem.getType().equals(CardType.TRAP)
                        ? adventureLogService.logTrapChest(adventureId, dto.getCharacterId(), charItem.getName())
                        : adventureLogService.logOpenChest(adventureId, dto.getCharacterId(), charItem.getName());
            } else {
                adventureLog = charItem.getType().equals(CardType.TRAP)
                        ? adventureLogService.logTrapChest(adventureId, dto.getCharacterId(), charItem.getName())
                        : adventureLogService.logOpenChest(adventureId, dto.getCharacterId(), null);
            }

            wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LOG);
            wsDto.setMessage(AdventureLogDto.toDto(adventureLog));
            messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);

            ChestLayerItem chestItem = chestLayerItemService.getOne(dto.getChestItemId());
            adventureService.deleteLayerItem(adventureId, chestItem);
            wsDto.setType(AdventureMessageDto.AdventureMessageType.REMOVE_LAYER_ITEM);
            wsDto.setMessage(ChestLayerItemDto.toDto(chestItem, ChestLayerItemDto.class));
            messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
        }

        wsDto.setType(AdventureMessageDto.AdventureMessageType.CLOSE_DIALOG);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
