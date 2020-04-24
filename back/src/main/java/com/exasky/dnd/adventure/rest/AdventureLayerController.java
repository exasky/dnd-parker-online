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
    
    @PostMapping("/add-layer-item/{adventureId}")
    public <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> void addLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        BO newLayerItem = adventureService.addLayerItem(adventureId, LayerItemDto.toBo(dto));
        DTO returnDto = LayerItemDto.toDto(newLayerItem, dto.createDtoInstance());

        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.ADD_LAYER_ITEM);
        wsDto.setMessage(returnDto);
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    @PutMapping("/update-layer-item/{adventureId}")
    public <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> void updateLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        BO updatedLayerItem = adventureService.updateLayerItem(adventureId, LayerItemDto.toBo(dto));
        DTO returnDto = LayerItemDto.toDto(updatedLayerItem, dto.createDtoInstance());

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
        wsDto.setMessage(dto.getId());
        messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }

    // TODO add in adventure List of traps, doors, trees, etc...
    // class trap { boolean shown; layerItem: LayerItem
    // class door { boolean open; boolean vertical; layerItem: LayerItem
    // class tree/pillar layerItem: LayerItem => No need tree/pillar specific class. put them in List<LayerItem> of Adventure
    // get adventure by id if GM or Player return or not list of elements with of without some items
    // if trap.shown === false -> player.getAdvId() will return list of layer elements
    // (or lists of all items displayable for player)
    // (replace Layers in adventure by List<Traps>, List<Trees>, List<Pillar>, ..., List<LayerItem> in case some default objects)

    @GetMapping("/show-trap/{adventureId}/{layerItemId}")
    public void showTrap(@PathVariable Long adventureId, @PathVariable Long layerItemId) {
        AdventureMessageDto wsDto = new AdventureMessageDto();
        wsDto.setType(AdventureMessageDto.AdventureMessageType.SHOW_TRAP);
        wsDto.setMessage(layerItemId);
        this.messagingTemplate.convertAndSend("/topic/adventure/" + adventureId, wsDto);
    }
}
