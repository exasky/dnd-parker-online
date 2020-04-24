package com.exasky.dnd.adventure.model.layer.item;

import com.exasky.dnd.adventure.model.card.CharacterItem;

import javax.persistence.*;

@Entity
@Table(name = "layer_item_chest")
public class ChestLayerItem extends LayerItem {

    @ManyToOne
    @JoinColumn(name = "character_item_id")
    private CharacterItem specificCard;

    public ChestLayerItem() {
    }

    public ChestLayerItem(Long id) {
        super(id);
    }

    // region Getters & Setters
    public CharacterItem getSpecificCard() {
        return specificCard;
    }

    public void setSpecificCard(CharacterItem specificCard) {
        this.specificCard = specificCard;
    }
    // endregion
}
