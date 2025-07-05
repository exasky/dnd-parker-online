package com.exasky.dnd.adventure.model.layer.item;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "layer_item_simple")
public class SimpleLayerItem extends LayerItem {
    public SimpleLayerItem() {
    }

    public SimpleLayerItem(Long id) {
        super(id);
    }
}
