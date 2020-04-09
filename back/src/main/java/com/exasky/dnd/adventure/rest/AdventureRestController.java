package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.adventure.rest.dto.SimpleAdventureReadDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.SimpleCampaignDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_UTL + "/adventure")
public class AdventureRestController {

    private final AdventureService adventureService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureRestController(AdventureService adventureService,
                                   SimpMessageSendingOperations messagingTemplate)  {
        this.adventureService = adventureService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<SimpleAdventureReadDto> getSimpleAdventures() {
        return SimpleAdventureReadDto.toDto(this.adventureService.getAdventures());
    }

    @GetMapping("/campaigns")
    public List<SimpleCampaignDto> getCampaignsForCurrentUser() {
        return SimpleCampaignDto.toDto(this.adventureService.getCampaignsForCurrentUser());
    }

    @GetMapping("/{id}")
    public AdventureDto getAdventure(@PathVariable Long id) {
        return AdventureDto.toDto(this.adventureService.getById(id));
    }

    @PutMapping("/{id}")
    public AdventureDto update(@PathVariable Long id, @RequestBody AdventureDto adventureWriteDto) {
        AdventureDto returnDto = AdventureDto.toDto(this.adventureService.update(id, AdventureDto.toBo(adventureWriteDto)));
        this.messagingTemplate.convertAndSend("/topic/adventure", returnDto);
        return returnDto;
    }
}
