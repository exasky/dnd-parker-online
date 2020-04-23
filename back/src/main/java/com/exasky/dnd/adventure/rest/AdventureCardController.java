package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.rest.dto.ChestSpecificCardDto;
import com.exasky.dnd.adventure.rest.dto.card.AskDrawCardDto;
import com.exasky.dnd.adventure.rest.dto.card.CardMessageDto;
import com.exasky.dnd.adventure.rest.dto.card.DrawnCardDto;
import com.exasky.dnd.adventure.rest.dto.card.ValidateCardDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureCardController {

    private final AdventureService adventureService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureCardController(AdventureService adventureService,
                                   SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Called by any one to draw a card
     */
    @PostMapping("/draw-card")
    public void drawCard(@RequestBody AskDrawCardDto drawCardDto) {
        Long adventureId = drawCardDto.getAdventureId();
        CharacterItemDto dto = CharacterItemDto.toDto(this.adventureService.getNextCardToDraw(adventureId));

        DrawnCardDto drawnCardDto = new DrawnCardDto(drawCardDto.getAdventureId(), drawCardDto.getCharacterId(), dto);
        CardMessageDto messageDto = new CardMessageDto(CardMessageDto.CardMessageType.DRAW_CARD, drawnCardDto);
        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, messageDto);
    }

    @PostMapping("/set-chest-specific-card/{adventureId}")
    public void setChestSpecificCard(@PathVariable Long adventureId, @RequestBody ChestSpecificCardDto dto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SET_CHEST_CARD);
        wsDto.setMessage(dto);

        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/draw-specific-card/{adventureId}/{characterItemId}")
    public void drawSpecificCard(@PathVariable Long adventureId, @PathVariable Long characterItemId) {
        CharacterItemDto dto = CharacterItemDto.toDto(this.adventureService.drawSpecificCard(characterItemId));

        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, dto);
    }

    /**
     * Called by the GM to validate the previously drawn card
     */
    @PostMapping("/draw-card-validate")
    public void drawCardValidate(@RequestBody ValidateCardDto dto) {
        Long adventureId = dto.getAdventureId();
        if (dto.getValidation()) {
            adventureService.drawCard(adventureId, dto.getCharacterItemId());
        }

        CardMessageDto message = new CardMessageDto(CardMessageDto.CardMessageType.CLOSE_DIALOG);
        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, message);
    }
}
