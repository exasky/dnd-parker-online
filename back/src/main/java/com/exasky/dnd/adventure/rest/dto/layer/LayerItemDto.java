package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.LayerItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class LayerItemDto<DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> {
    private static final Logger LOGGER = LoggerFactory.getLogger(LayerItemDto.class);

    private Long id;
    private Integer positionX;
    private Integer positionY;
    private LayerElementDto element;

    public static <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> List<BO> toBo(List<DTO> dtos) {
        return Objects.isNull(dtos)
                ? new ArrayList<>()
                : dtos.stream().map(LayerItemDto::toBo).collect(Collectors.toList());
    }

    public abstract BO createBoInstance(Long id);

    public abstract DTO createDtoInstance();

    public static <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> BO toBo(DTO dto) {
        BO bo = dto.createBoInstance(dto.getId());

        bo.setPositionX(dto.getPositionX());
        bo.setPositionY(dto.getPositionY());
        bo.setLayerElement(LayerElementDto.toBo(dto.getElement()));

        dto.specific_toBo(bo);

        return bo;
    }

    public void specific_toBo(BO bo) {
    }

    protected static <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> List<DTO> toDto(List<BO> bos, Class<DTO> obj) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(bo -> toDto(bo, obj)).collect(Collectors.toList());
    }


    public static <DTO extends LayerItemDto<DTO, BO>, BO extends LayerItem> DTO toDto(BO bo, Class<DTO> obj) {
        DTO dto = null;
        try {
            dto = obj.newInstance();

            dto.setId(bo.getId());
            dto.setPositionX(bo.getPositionX());
            dto.setPositionY(bo.getPositionY());
            dto.setElement(LayerElementDto.toDto(bo.getLayerElement()));

            dto.specific_toDto(bo, dto);
        } catch (InstantiationException | IllegalAccessException e) {
            LOGGER.error("Cannot create instance of " + obj.getName(), e);
        }

        return dto;
    }

    protected void specific_toDto(BO bo, DTO dto) {
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
