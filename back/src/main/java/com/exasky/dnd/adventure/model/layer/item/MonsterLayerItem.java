package com.exasky.dnd.adventure.model.layer.item;

import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.template.MonsterTemplate;

import javax.persistence.*;

@Entity
@Table(name = "layer_item_monster")
public class MonsterLayerItem extends LayerItem {

    @ManyToOne
    @JoinColumn(name = "monster_id")
    private MonsterTemplate monster;

    @Column
    private Short hp;

    public MonsterLayerItem() {
    }

    public MonsterLayerItem(Long id) {
        super(id);
    }

    // region Getters & Setters
    public MonsterTemplate getMonster() {
        return monster;
    }

    public void setMonster(MonsterTemplate monster) {
        this.monster = monster;
    }

    public Short getHp() {
        return hp;
    }

    public void setHp(Short hp) {
        this.hp = hp;
    }
    // endregion
}
