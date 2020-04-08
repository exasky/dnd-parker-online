package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.Layer;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class LayerDto {
    private Long id;
    private List<LayerItemDto> items;

    public static Layer toBo(LayerDto mjLayer) {
        Layer layer = new Layer();

        layer.setId(mjLayer.id);
        layer.setItems(LayerItemDto.toBo(mjLayer.items));

        return layer;
    }

    public static LayerDto toDto(Layer bo) {
        LayerDto layerDto = new LayerDto();

        if (Objects.nonNull(bo)) {
            layerDto.setId(bo.getId());
            layerDto.setItems(LayerItemDto.toDto(bo.getItems()));
        } else {
            layerDto.setItems(new ArrayList<>());
        }

        return layerDto;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<LayerItemDto> getItems() {
        return items;
    }

    public void setItems(List<LayerItemDto> items) {
        this.items = items;
    }
    // endregion
}
