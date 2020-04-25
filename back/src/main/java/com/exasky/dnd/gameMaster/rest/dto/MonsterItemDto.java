package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.layer.item.MonsterLayerItem;
import com.exasky.dnd.adventure.rest.dto.template.MonsterTemplateDto;

public class MonsterItemDto {
    private Long id;
    private Short hp;
    private MonsterTemplateDto monster;

    public static MonsterLayerItem toBo(MonsterItemDto dto) {
        MonsterLayerItem bo = new MonsterLayerItem(dto.id);

        bo.setHp(dto.getHp());
        bo.setMonster(MonsterTemplateDto.toBo(dto.monster));

        return bo;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getHp() {
        return hp;
    }

    public void setHp(Short hp) {
        this.hp = hp;
    }

    public MonsterTemplateDto getMonster() {
        return monster;
    }

    public void setMonster(MonsterTemplateDto monster) {
        this.monster = monster;
    }

    // endregion
}
