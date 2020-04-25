package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.MonsterLayerItem;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.repository.layer.MonsterLayerItemRepository;
import org.springframework.stereotype.Service;

@Service
public class MonsterLayerItemService extends ParentLayerItemService<MonsterLayerItem> {
    public MonsterLayerItemService(MonsterLayerItemRepository monsterLayerItemRepository, LayerElementRepository repo) {
        super(monsterLayerItemRepository, repo);
    }

    @Override
    protected MonsterLayerItem createInstance() {
        return new MonsterLayerItem();
    }

    @Override
    protected void specific_create(MonsterLayerItem newLayerItem, MonsterLayerItem toCreate, Adventure attachedAdventure) {
        newLayerItem.setHp(toCreate.getHp());
        newLayerItem.setMonster(toCreate.getMonster());
    }

    @Override
    public void specific_update(MonsterLayerItem updatedLayerItem, MonsterLayerItem toUpdate) {
        specific_create(updatedLayerItem, toUpdate, null);
    }

    @Override
    public void specific_copy(MonsterLayerItem newLayerItem, MonsterLayerItem toCopy, Adventure adventure) {
        specific_create(newLayerItem, toCopy, null);
    }
}
