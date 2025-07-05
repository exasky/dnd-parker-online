package com.exasky.dnd.adventure.model.layer.item;

import com.exasky.dnd.adventure.model.Character;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "layer_item_character")
public class CharacterLayerItem extends LayerItem {
    @ManyToOne
    @JoinColumn(name = "character_id")
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
