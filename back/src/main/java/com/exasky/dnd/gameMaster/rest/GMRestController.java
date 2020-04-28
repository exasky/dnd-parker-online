package com.exasky.dnd.gameMaster.rest;

import com.exasky.dnd.adventure.rest.dto.AlertMessageDto;
import com.exasky.dnd.adventure.rest.dto.layer.LayerElementDto;
import com.exasky.dnd.adventure.rest.dto.layer.MonsterLayerItemDto;
import com.exasky.dnd.adventure.rest.dto.template.MonsterTemplateDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import com.exasky.dnd.gameMaster.rest.dto.InitiativeDto;
import com.exasky.dnd.gameMaster.rest.dto.MonsterItemDto;
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
        return CharacterItemDto.toDto(gmService.getAllCharacterItems());
    }

    @GetMapping("/monster-templates")
    public List<MonsterTemplateDto> getMonsterTemplates() {
        return MonsterTemplateDto.toDto(gmService.getMonsterTemplates());
    }

    @PostMapping("/update-monster/{adventureId}/{monsterId}")
    public void updateMonster(@PathVariable Long adventureId, @PathVariable Long monsterId, @RequestBody MonsterItemDto dto) {
        MonsterLayerItemDto resultDto = MonsterLayerItemDto.toDto(gmService.updateMonster(adventureId, monsterId, MonsterItemDto.toBo(dto)));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_MONSTER);
        wsDto.setMessage(resultDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/initiative/{adventureId}")
    public void rollInitiative(@PathVariable Long adventureId) {
        List<InitiativeDto> dto = InitiativeDto.toDto(gmService.rollInitiative(adventureId));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ROLL_INITIATIVE);
        wsDto.setMessage(dto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/initiative/{adventureId}")
    public void updateInitiatives(@PathVariable Long adventureId, @RequestBody List<InitiativeDto> dto) {
        List<InitiativeDto> resDto = InitiativeDto.toDto(gmService.updateInitiative(adventureId, InitiativeDto.toBo(dto)));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ROLL_INITIATIVE);
        wsDto.setMessage(resDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/previous-adventure/{adventureId}")
    public void previousAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findPreviousAdventureId(adventureId));

        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, dto);
    }

    @GetMapping("/next-adventure/{adventureId}")
    public void nextAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findNextAdventureId(adventureId));

        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, dto);
    }

    @PostMapping("/send-alert/{adventureId}")
    public void sendAlert(@PathVariable Long adventureId, @RequestBody AlertMessageDto alertMessage) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ALERT);
        wsDto.setMessage(alertMessage);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/play-sound/{adventureId}/{audioFile}")
    public void playSound(@PathVariable Long adventureId, @PathVariable String audioFile) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SOUND);
        wsDto.setMessage(audioFile);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/play-ambient-sound/{adventureId}/{audioFile}")
    public void playAmbientSound(@PathVariable Long adventureId, @PathVariable String audioFile) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.AMBIENT_SOUND);
        wsDto.setMessage(audioFile);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/close/{adventureId}")
    public void closeDialog(@PathVariable Long adventureId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.CLOSE_DIALOG);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
