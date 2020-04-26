package com.exasky.dnd.adventure.model.layer.item;

import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.model.card.CharacterItem;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "layer_item_character")
public class CharacterLayerItem extends LayerItem {
    @ManyToOne
    private Character character;

    public CharacterLayerItem() {
    }

    public CharacterLayerItem(Long id) {
        super(id);
    }

    // region Getters & Setters

    public Character getCharacter() {
        return character;
    }

    public void setCharacter(Character character) {
        this.character = character;
    }

    // endregion
}
