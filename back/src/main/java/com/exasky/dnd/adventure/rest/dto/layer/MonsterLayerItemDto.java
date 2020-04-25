package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.MonsterLayerItem;
import com.exasky.dnd.adventure.rest.dto.template.MonsterTemplateDto;

import java.util.List;

public class MonsterLayerItemDto extends LayerItemDto<MonsterLayerItemDto, MonsterLayerItem> {
    private Short hp;
    private MonsterTemplateDto monster;

    public static List<MonsterLayerItemDto> toDto(List<MonsterLayerItem> bos) {
        return MonsterLayerItemDto.toDto(bos, MonsterLayerItemDto.class);
    }

    @Override
    public MonsterLayerItem createBoInstance(Long id) {
        return new MonsterLayerItem(id);
    }

    @Override
    public MonsterLayerItemDto createDtoInstance() {
        return new MonsterLayerItemDto();
    }

    @Override
    public void specific_toBo(MonsterLayerItem monsterLayerItem) {
        monsterLayerItem.setHp(getHp());
        monsterLayerItem.setMonster(MonsterTemplateDto.toBo(getMonster()));
    }

    @Override
    protected void specific_toDto(MonsterLayerItem bo, MonsterLayerItemDto dto) {
        dto.setHp(bo.getHp());
        dto.setMonster(MonsterTemplateDto.toDto(bo.getMonster()));
    }

    // region Getters & Setters

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
