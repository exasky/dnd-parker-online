package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.rest.dto.card.AskDrawCardDto;
import com.exasky.dnd.adventure.rest.dto.card.CardMessageDto;
import com.exasky.dnd.adventure.rest.dto.card.DrawnCardDto;
import com.exasky.dnd.adventure.rest.dto.card.ValidateCardDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

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
        CharacterItemDto dto = CharacterItemDto.toDto(
                Objects.isNull(drawCardDto.getCharacterItemId())
                        ? this.adventureService.getNextCardToDraw(adventureId)
                        : this.adventureService.drawSpecificCard(drawCardDto.getCharacterItemId()));

        DrawnCardDto drawnCardDto = new DrawnCardDto(drawCardDto.getAdventureId(), drawCardDto.getCharacterId(), dto);
        CardMessageDto messageDto = new CardMessageDto(CardMessageDto.CardMessageType.DRAW_CARD, drawnCardDto);
        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, messageDto);
    }

    /**
     * Called by the GM to validate the previously drawn card
     */
    @PostMapping("/draw-card-validate")
    public void drawCardValidate(@RequestBody ValidateCardDto dto) {
        Long adventureId = dto.getAdventureId();
        if (dto.getValidation()) {
            adventureService.validateDrawnCard(adventureId, dto.getCharacterItemId());
        }

        CardMessageDto message = new CardMessageDto(CardMessageDto.CardMessageType.CLOSE_DIALOG);
        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, message);
    }
}
