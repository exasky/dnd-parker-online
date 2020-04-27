package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.rest.dto.CharacterDto;
import com.exasky.dnd.adventure.rest.dto.trade.AskTradeDto;
import com.exasky.dnd.adventure.rest.dto.trade.SelectTradeEquipmentDto;
import com.exasky.dnd.adventure.rest.dto.trade.ValidateTradeDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureTradeController {

    private final AdventureService adventureService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureTradeController(AdventureService adventureService,
                                    SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
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
    }

}
