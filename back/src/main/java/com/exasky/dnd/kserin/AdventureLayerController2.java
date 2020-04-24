package com.exasky.dnd.kserin;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exasky.dnd.adventure.model.layer.item.LayerItem;

@RestController
public class AdventureLayerController2 {
    private LayerItemServiceFactory layerItemServiceFactory;

    @PostMapping("/add-layer-item/{adventureId}")
    public <DTO extends com.exasky.dnd.kserin.LayerItemDto> void addLayerItem(@PathVariable Long adventureId, @RequestBody DTO dto) {
        LayerServiceStrategy<? extends LayerItem> layerService = layerItemServiceFactory.get(LayerItemDto.type(dto));
        layerService.addLayerItem(adventureId, null); // TODO conversion depuis le DTO ici

    }

}
