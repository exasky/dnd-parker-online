package com.exasky.dnd.adventure.rest.dto.layer;

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
    private String name;

    public static LayerElement toBo(LayerElementDto dto) {
        LayerElement bo = new LayerElement(dto.getId());

        bo.setType(dto.getType());
        bo.setRowSize(dto.getRowSize());
        bo.setColSize(dto.getColSize());
        bo.setName(dto.getName());

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
        dto.setName(bo.getName());

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    // endregion
}
