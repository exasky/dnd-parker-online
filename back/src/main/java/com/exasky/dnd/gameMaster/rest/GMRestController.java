package com.exasky.dnd.gameMaster.rest;

import com.exasky.dnd.adventure.rest.dto.AlertMessageDto;
import com.exasky.dnd.adventure.rest.dto.layer.LayerElementDto;
import com.exasky.dnd.adventure.rest.dto.template.MonsterTemplateDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import com.exasky.dnd.gameMaster.service.GMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_URL + "/game-master")
public class GMRestController {

    private final GMService gmService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public GMRestController(GMService gmService,
                            SimpMessageSendingOperations messagingTemplate) {
        this.gmService = gmService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/addable-elements")
    public List<LayerElementDto> getAddableElements() {
        return LayerElementDto.toDto(this.gmService.getAddableElements());
    }

    @GetMapping("/character-items")
    public List<CharacterItemDto> getAllCharacterItems() {
        return CharacterItemDto.toDto(this.gmService.getAllCharacterItems());
    }

    @GetMapping("/monster-templates")
    public List<MonsterTemplateDto> getMonsterTemplates() {
        return MonsterTemplateDto.toDto(gmService.getMonsterTemplates());
    }

    @GetMapping("/previous-adventure/{adventureId}")
    public void previousAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findPreviousAdventureId(adventureId));

        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, dto);
    }

    @GetMapping("/next-adventure/{adventureId}")
    public void nextAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findNextAdventureId(adventureId));

        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, dto);
    }

    @PostMapping("/send-alert/{adventureId}")
    public void sendAlert(@PathVariable Long adventureId, @RequestBody AlertMessageDto alertMessage) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ALERT);
        wsDto.setMessage(alertMessage);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/play-sound/{adventureId}/{audioFile}")
    public void playSound(@PathVariable Long adventureId, @PathVariable String audioFile) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SOUND);
        wsDto.setMessage(audioFile);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
