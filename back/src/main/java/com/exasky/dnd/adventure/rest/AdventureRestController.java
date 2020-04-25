package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.rest.dto.*;
import com.exasky.dnd.adventure.rest.dto.template.CharacterTemplateDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.SimpleCampaignDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureRestController {

    private final AdventureService adventureService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureRestController(AdventureService adventureService,
                                   SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/character-templates")
    public List<CharacterTemplateDto> getAllCharacterTemplate() {
        return CharacterTemplateDto.toDto(this.adventureService.getAllCharacterTemplate());
    }

    @GetMapping
    public List<SimpleAdventureReadDto> getSimpleAdventures() {
        return SimpleAdventureReadDto.toDto(this.adventureService.getAdventures());
    }

    @GetMapping("/campaigns")
    public List<SimpleCampaignDto> getCampaignsForCurrentUser() {
        return SimpleCampaignDto.toDto(this.adventureService.getCampaignsForCurrentUser());
    }

    @PostMapping("/mouse-move/{adventureId}")
    public void userMouseMove(@PathVariable Long adventureId, @RequestBody MouseMoveDto mouseMoveDto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.MOUSE_MOVE);
        wsDto.setMessage(mouseMoveDto);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/{id}")
    public AdventureDto getAdventure(@PathVariable Long id) {
        return AdventureDto.toDto(this.adventureService.getById(id));
    }

    @GetMapping("/select-character/{adventureId}/{characterId}")
    public void selectCharacter(@PathVariable Long adventureId, @PathVariable Long characterId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_CHARACTER);
        wsDto.setMessage(characterId);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/update-character/{adventureId}/{characterId}")
    public void updateCharacter(@PathVariable Long adventureId, @PathVariable Long characterId, @RequestBody CharacterDto dto) {
        Character character = adventureService.updateCharacter(adventureId, characterId, CharacterDto.toBo(dto));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CHARACTER);
        wsDto.setMessage(CharacterDto.toDto(character));
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/select-monster/{adventureId}/{layerItemId}")
    public void selectMonster(@PathVariable Long adventureId, @PathVariable Long layerItemId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_MONSTER);
        wsDto.setMessage(layerItemId);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
