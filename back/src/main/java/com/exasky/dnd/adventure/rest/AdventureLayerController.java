package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import com.exasky.dnd.adventure.rest.dto.layer.LayerItemDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constant.REST_URL + "/adventure")
public class AdventureLayerController {
    private final AdventureService adventureService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public AdventureLayerController(AdventureService adventureService,
                                   SimpMessageSendingOperations messagingTemplate) {
        this.adventureService = adventureService;
        this.messagingTemplate = messagingTemplate;
    }
    
    @SuppressWarnings("unchecked")
    @PostMapping("/add-layer-item/{adventureId}")
    public <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> void addLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        BO newLayerItem = adventureService.addLayerItem(adventureId, LayerItemDto.toBo(dto));
        DTO returnDto = (DTO) DTO.toDto(newLayerItem, dto.getClass());

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LAYER_ITEM);
        wsDto.setMessage(returnDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/update-layer-item/{adventureId}")
    public <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> void updateLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        BO updatedLayerItem = adventureService.updateLayerItem(adventureId, LayerItemDto.toBo(dto));
        DTO returnDto = (DTO) DTO.toDto(updatedLayerItem, dto.getClass());

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_LAYER_ITEM);
        wsDto.setMessage(returnDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @DeleteMapping("/delete-layer-item/{adventureId}")
    public <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> void deleteLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        adventureService.deleteLayerItem(adventureId, LayerItemDto.toBo(dto));

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.REMOVE_LAYER_ITEM);
        wsDto.setMessage(dto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

}
