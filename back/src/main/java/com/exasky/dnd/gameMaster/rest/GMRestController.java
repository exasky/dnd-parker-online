package com.exasky.dnd.gameMaster.rest;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.adventure.rest.dto.layer.LayerElementDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.*;
import com.exasky.dnd.gameMaster.service.GMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

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

    @GetMapping("/dices")
    public List<DiceDto> getAllDices() {
        return DiceDto.toDto(this.gmService.getAllDices());
    }

    @GetMapping("/campaign")
    public List<SimpleCampaignDto> getAllCampaigns() {
        return SimpleCampaignDto.toDto(gmService.getAllCampaigns());
    }

    @GetMapping("/campaign/{id}")
    public CreateCampaignDto getCampaign(@PathVariable Long id) {
        return CreateCampaignDto.toDto(gmService.getCampaign(id));
    }

    @PostMapping("/campaign")
    public CreateCampaignDto createCampaign(@RequestBody CreateCampaignDto dto) {
        return CreateCampaignDto.toDto(this.gmService.createCampaign(CreateCampaignDto.toBo(dto)));
    }

    @PutMapping("/campaign/{id}")
    public CreateCampaignDto updateCampaign(@PathVariable Long id, @RequestBody CreateCampaignDto dto) {
        Campaign updatedCampaign = this.gmService.updateCampaign(id, CreateCampaignDto.toBo(dto));


        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.RELOAD);
        if (Objects.nonNull(updatedCampaign.getCurrentAdventure())) {
            wsDto.setMessage(AdventureDto.toDto(updatedCampaign.getCurrentAdventure()));
        }
        this.messagingTemplate.convertAndSend("/topic/adventure", wsDto);

        return CreateCampaignDto.toDto(updatedCampaign);
    }

    @DeleteMapping("/campaign/{id}")
    public void deleteCampaign(@PathVariable Long id) {
        this.gmService.deleteCampaign(id);
    }

    // TODO move to adventureController
    @GetMapping("/draw-card/{adventureId}")
    public CharacterItemDto drawCard(@PathVariable Long adventureId) {
        CharacterItemDto dto = CharacterItemDto.toDto(this.gmService.drawCard(adventureId));

        this.messagingTemplate.convertAndSend("/topic/drawn-card", dto);

        return dto;
    }

    @GetMapping("/previous-adventure/{adventureId}")
    public void previousAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findPreviousAdventureId(adventureId));

        this.messagingTemplate.convertAndSend("/topic/adventure", dto);
    }

    @GetMapping("/next-adventure/{adventureId}")
    public void nextAdventure(@PathVariable Long adventureId) {
        AdventureMessageDto dto = new AdventureMessageDto();
        dto.setType(AdventureMessageDto.AdventureMessageType.GOTO);
        dto.setMessage(gmService.findNextAdventureId(adventureId));

        this.messagingTemplate.convertAndSend("/topic/adventure", dto);
    }
}
