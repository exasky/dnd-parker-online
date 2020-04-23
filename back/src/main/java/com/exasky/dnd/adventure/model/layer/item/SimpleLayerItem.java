package com.exasky.dnd.adventure.model.layer.item;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "layer_item_simple")
public class SimpleLayerItem extends LayerItem {
    public SimpleLayerItem() {
    }

    public SimpleLayerItem(Long id) {
        super(id);
    }
}
