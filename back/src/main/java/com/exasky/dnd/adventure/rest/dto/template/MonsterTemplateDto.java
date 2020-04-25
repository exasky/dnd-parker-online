package com.exasky.dnd.adventure.rest.dto.template;

import com.exasky.dnd.adventure.model.template.MonsterTemplate;
import com.exasky.dnd.adventure.rest.dto.layer.LayerElementDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class MonsterTemplateDto {
    private Long id;
    private Short maxHp;
    private Short movePoints;
    private Short armor;
    private LayerElementDto element;

    public static List<MonsterTemplateDto> toDto(List<MonsterTemplate> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(MonsterTemplateDto::toDto).collect(Collectors.toList());
    }

    public static MonsterTemplateDto toDto(MonsterTemplate bo) {
        MonsterTemplateDto dto = new MonsterTemplateDto();

        dto.setId(bo.getId());
        dto.setMaxHp(bo.getMaxHp());
        dto.setMovePoints(bo.getMovePoints());
        dto.setArmor(bo.getArmor());
        dto.setElement(LayerElementDto.toDto(bo.getMonsterElement()));

        return dto;
    }

    public static MonsterTemplate toBo(MonsterTemplateDto dto) {
        MonsterTemplate bo = new MonsterTemplate(dto.id);

        bo.setMaxHp(dto.getMaxHp());
        bo.setMovePoints(dto.getMovePoints());
        bo.setArmor(dto.getArmor());
        bo.setMonsterElement(LayerElementDto.toBo(dto.getElement()));

        return bo;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(Short maxHp) {
        this.maxHp = maxHp;
    }

    public Short getMovePoints() {
        return movePoints;
    }

    public void setMovePoints(Short movePoints) {
        this.movePoints = movePoints;
    }

    public Short getArmor() {
        return armor;
    }

    public void setArmor(Short armor) {
        this.armor = armor;
    }

    public LayerElementDto getElement() {
        return element;
    }

    public void setElement(LayerElementDto element) {
        this.element = element;
    }

    // endregion
}
