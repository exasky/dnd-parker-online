package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.rest.dto.*;
import com.exasky.dnd.adventure.rest.dto.template.CharacterTemplateDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.InitiativeDto;
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
        return CharacterTemplateDto.toDto(adventureService.getAllCharacterTemplate());
    }

    @GetMapping
    public List<SimpleAdventureReadDto> getSimpleAdventures() {
        return SimpleAdventureReadDto.toDto(adventureService.getAdventures());
    }

    @GetMapping("/campaigns")
    public List<SimpleCampaignDto> getCampaignsForCurrentUser() {
        return SimpleCampaignDto.toDto(adventureService.getCampaignsForCurrentUser());
    }

    @PostMapping("/mouse-move/{adventureId}")
    public void userMouseMove(@PathVariable Long adventureId, @RequestBody MouseMoveDto mouseMoveDto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.MOUSE_MOVE);
        wsDto.setMessage(mouseMoveDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/{id}")
    public AdventureDto getAdventure(@PathVariable Long id) {
        return AdventureDto.toDto(adventureService.getById(id));
    }

    @GetMapping("/ask-next-turn/{adventureId}")
    public void askNextTurn(@PathVariable Long adventureId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ASK_NEXT_TURN);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/validate-next-turn/{adventureId}")
    public void validateNextTurn(@PathVariable Long adventureId, @RequestBody NextTurnDto dto) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        if (dto.getValidation()) {
            wsDto.setType(AdventureMessageDto.AdventureMessageType.VALIDATE_NEXT_TURN);
            wsDto.setMessage(InitiativeDto.toDto(adventureService.nextTurn(adventureId)));
        } else {
            wsDto.setType(AdventureMessageDto.AdventureMessageType.CLOSE_DIALOG);
        }

        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PostMapping("/update-character/{adventureId}/{characterId}")
    public void updateCharacter(@PathVariable Long adventureId, @PathVariable Long characterId, @RequestBody CharacterDto dto) {
        Character character = adventureService.updateCharacter(adventureId, characterId, CharacterDto.toBo(dto));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CHARACTER);
        wsDto.setMessage(CharacterDto.toDto(character));
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/select-monster/{adventureId}/{layerItemId}")
    public void selectMonster(@PathVariable Long adventureId, @PathVariable Long layerItemId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_MONSTER);
        wsDto.setMessage(layerItemId);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
