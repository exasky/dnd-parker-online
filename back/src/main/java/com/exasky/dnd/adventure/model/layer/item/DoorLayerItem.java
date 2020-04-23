package com.exasky.dnd.adventure.model.layer.item;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "layer_item_door")
public class DoorLayerItem extends LayerItem {
    @Column()
    private Boolean vertical;

    @Column()
    private Boolean open;

    // region Getters & Setters

    public Boolean getVertical() {
        return vertical;
    }

    public void setVertical(Boolean vertical) {
        this.vertical = vertical;
    }

    public Boolean getOpen() {
        return open;
    }

    public void setOpen(Boolean open) {
        this.open = open;
    }

    // endregion
}
