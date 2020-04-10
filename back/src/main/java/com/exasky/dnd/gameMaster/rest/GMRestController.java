package com.exasky.dnd.gameMaster.rest;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.adventure.rest.dto.layer.LayerElementDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
import com.exasky.dnd.gameMaster.rest.dto.CreateCampaignDto;
import com.exasky.dnd.gameMaster.rest.dto.SimpleCampaignDto;
import com.exasky.dnd.gameMaster.service.GMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_UTL + "/game-master")
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
        return CreateCampaignDto.toDto(this.gmService.create(CreateCampaignDto.toBo(dto)));
    }

    @PutMapping("/campaign/{id}")
    public CreateCampaignDto updateCampaign(@PathVariable Long id, @RequestBody CreateCampaignDto dto) {
        Campaign updatedCampaign = this.gmService.update(id, CreateCampaignDto.toBo(dto));

        this.messagingTemplate.convertAndSend("/topic/adventure",
                AdventureDto.toDto(updatedCampaign.getCurrentAdventure()));

        return CreateCampaignDto.toDto(updatedCampaign);
    }

    @GetMapping("/draw-card/{adventureId}")
    public CharacterItemDto drawCard(@PathVariable Long adventureId) {
        CharacterItemDto dto = CharacterItemDto.toDto(this.gmService.drawCard(adventureId));

        this.messagingTemplate.convertAndSend("/topic/drawn-card", dto);

        return dto;
    }
}
