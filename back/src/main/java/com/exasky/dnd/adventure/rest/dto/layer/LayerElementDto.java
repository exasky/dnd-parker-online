package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.ImageRotation;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.model.layer.LayerElementType;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class LayerElementDto {
    private Long id;
    private LayerElementType type;
    private Integer rowSize;
    private Integer colSize;
    private String icon;
    private Integer rotation;

    public static LayerElement toBo(LayerElementDto dto) {
        LayerElement bo = new LayerElement(dto.getId());

        bo.setType(dto.getType());
        bo.setRowSize(dto.rowSize);
        bo.setColSize(dto.colSize);
        bo.setIcon(dto.icon);
        bo.setRotation(ImageRotation.getImageRotationFromCode(dto.rotation));
        bo.setType(dto.type);

        return bo;
    }

    public static List<LayerElementDto> toDto(List<LayerElement> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(LayerElementDto::toDto).collect(Collectors.toList());
    }

    public static LayerElementDto toDto(LayerElement bo) {
        LayerElementDto dto = new LayerElementDto();

        dto.setId(bo.getId());
        dto.setType(bo.getType());
        dto.setRowSize(bo.getRowSize());
        dto.setColSize(bo.getColSize());
        dto.setIcon(bo.getIcon());
        dto.setRotation(bo.getRotation().getRotationDegree());

        return dto;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LayerElementType getType() {
        return type;
    }

    public void setType(LayerElementType type) {
        this.type = type;
    }

    public Integer getRowSize() {
        return rowSize;
    }

    public void setRowSize(Integer rowSize) {
        this.rowSize = rowSize;
    }

    public Integer getColSize() {
        return colSize;
    }

    public void setColSize(Integer colSize) {
        this.colSize = colSize;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getRotation() {
        return rotation;
    }

    public void setRotation(Integer rotation) {
        this.rotation = rotation;
    }
    // endregion
}
