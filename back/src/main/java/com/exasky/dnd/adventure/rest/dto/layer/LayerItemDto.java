package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.LayerItem;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class LayerItemDto {
    private Long id;
    private Integer positionX;
    private Integer positionY;
    private LayerElementDto element;

    public static List<LayerItem> toBo(List<LayerItemDto> dtos) {
        return Objects.isNull(dtos)
                ? new ArrayList<>()
                : dtos.stream().map(LayerItemDto::toBo).collect(Collectors.toList());
    }

    public static LayerItem toBo(LayerItemDto dto) {
        LayerItem layerItem = new LayerItem(dto.id);

        layerItem.setPositionX(dto.positionX);
        layerItem.setPositionY(dto.positionY);
        layerItem.setLayerElement(LayerElementDto.toBo(dto.element));

        return layerItem;
    }

    public static List<LayerItemDto> toDto(List<LayerItem> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(LayerItemDto::toDto).collect(Collectors.toList());
    }

    public static LayerItemDto toDto(LayerItem bo) {
        LayerItemDto dto = new LayerItemDto();

        dto.setId(bo.getId());
        dto.setPositionX(bo.getPositionX());
        dto.setPositionY(bo.getPositionY());
        dto.setElement(LayerElementDto.toDto(bo.getLayerElement()));

        return dto;
    }

    // region Getters & setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPositionX() {
        return positionX;
    }

    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }

    public Integer getPositionY() {
        return positionY;
    }

    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }

    public LayerElementDto getElement() {
        return element;
    }

    public void setElement(LayerElementDto element) {
        this.element = element;
    }
    // endregion
}
