package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.adventure.rest.dto.CharacterTemplateDto;
import com.exasky.dnd.adventure.rest.dto.MouseMoveDto;
import com.exasky.dnd.adventure.rest.dto.SimpleAdventureReadDto;
import com.exasky.dnd.adventure.rest.dto.layer.LayerItemDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CharacterItemDto;
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

    @GetMapping("/draw-card/{adventureId}")
    public void drawCard(@PathVariable Long adventureId) {
        CharacterItemDto dto = CharacterItemDto.toDto(this.adventureService.drawCard(adventureId));

        this.messagingTemplate.convertAndSend("/topic/drawn-card/" + adventureId, dto);
    }

    @GetMapping("/{id}")
    public AdventureDto getAdventure(@PathVariable Long id) {
        return AdventureDto.toDto(this.adventureService.getById(id));
    }

    @PostMapping("/add-layer-item/{adventureId}")
    public void addLayerItem(@PathVariable Long adventureId, @RequestBody LayerItemDto dto) {
        LayerItemDto returnDto = LayerItemDto.toDto(this.adventureService.addLayerItem(adventureId, LayerItemDto.toBo(dto)));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LAYER_ITEM);
        wsDto.setMessage(returnDto);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PutMapping("/update-layer-item/{adventureId}")
    public void updateLayerItem(@PathVariable Long adventureId, @RequestBody LayerItemDto dto) {
        LayerItemDto returnDto = LayerItemDto.toDto(this.adventureService.updateLayerItem(adventureId, LayerItemDto.toBo(dto)));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_LAYER_ITEM);
        wsDto.setMessage(returnDto);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @DeleteMapping("/delete-layer-item/{adventureId}/{layerItemId}")
    public void deleteLayerItem(@PathVariable Long adventureId, @PathVariable Long layerItemId) {
        this.adventureService.deleteLayerItem(adventureId, layerItemId);

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.REMOVE_LAYER_ITEM);
        wsDto.setMessage(layerItemId);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @GetMapping("/select-character/{adventureId}/{characterId}")
    public void selectCharacter(@PathVariable Long adventureId, @PathVariable Long characterId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SELECT_CHARACTER);
        wsDto.setMessage(characterId);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
