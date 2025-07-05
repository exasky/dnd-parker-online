package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.model.log.AdventureLog;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.rest.dto.AdventureLogDto;
import com.exasky.dnd.adventure.rest.dto.CharacterDto;
import com.exasky.dnd.adventure.rest.dto.switch_equipment.SelectSwitchEquipmentDto;
import com.exasky.dnd.adventure.rest.dto.switch_equipment.ValidateSwitchDto;
import com.exasky.dnd.adventure.rest.dto.trade.AskTradeDto;
import com.exasky.dnd.adventure.rest.dto.trade.SelectTradeEquipmentDto;
import com.exasky.dnd.adventure.rest.dto.trade.ValidateTradeDto;
import com.exasky.dnd.adventure.service.AdventureLogService;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureTradeController {

    private final AdventureService adventureService;
    private final AdventureLogService adventureLogService;

    private final SimpMessageSendingOperations messagingTemplate;

    public AdventureTradeController(AdventureService adventureService,
            AdventureLogService adventureLogService,
            SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
        this.adventureLogService = adventureLogService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/ask-trade/{adventureId}")
    public void askTrade(@PathVariable Long adventureId, @RequestBody AskTradeDto tradeDto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ASK_TRADE);
        wsDto.setMessage(tradeDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/select-trade/{adventureId}")
    public void selectTradeEquipment(@PathVariable Long adventureId, @RequestBody SelectTradeEquipmentDto tradeDto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_TRADE_CARD);
        wsDto.setMessage(tradeDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/validate-trade/{adventureId}")
    public void validateTrade(@PathVariable Long adventureId, @RequestBody ValidateTradeDto tradeDto) {
        final AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CHARACTER);
        this.adventureService.trade(tradeDto).forEach(updatedChar -> {
            wsDto.setMessage(CharacterDto.toDto(updatedChar));
            messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
        });

        wsDto.setType(AdventureMessageDto.AdventureMessageType.CLOSE_DIALOG);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);

        AdventureLog adventureLog = adventureLogService.logTrade(adventureId, tradeDto);
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LOG);
        wsDto.setMessage(AdventureLogDto.toDto(adventureLog));
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/ask-switch/{adventureId}/{characterId}")
    public void askSwitch(@PathVariable Long adventureId, @PathVariable Long characterId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ASK_SWITCH);
        wsDto.setMessage(characterId);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/select-switch/{adventureId}")
    public void selectSwitchEquipment(@PathVariable Long adventureId, @RequestBody SelectSwitchEquipmentDto tradeDto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_SWITCH_CARD);
        wsDto.setMessage(tradeDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/validate-switch/{adventureId}")
    public void validateSwitch(@PathVariable Long adventureId, @RequestBody ValidateSwitchDto switchDto) {
        Character character = this.adventureService.switchEquipment(switchDto);
        AdventureLog adventureLog = adventureLogService.logSwitch(adventureId, character.getName(),
                switchDto.getCharacterEquippedItemId(), switchDto.getCharacterBackpackItemId());

        final AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CHARACTER);
        wsDto.setMessage(CharacterDto.toDto(character));
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);

        wsDto.setType(AdventureMessageDto.AdventureMessageType.CLOSE_DIALOG);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);

        wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LOG);
        wsDto.setMessage(AdventureLogDto.toDto(adventureLog));
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

}
