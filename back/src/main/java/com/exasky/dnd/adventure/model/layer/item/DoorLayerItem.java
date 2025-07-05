package com.exasky.dnd.adventure.model.layer.item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "layer_item_door")
public class DoorLayerItem extends LayerItem {
    @Column()
    private Boolean vertical;

    @Column()
    private Boolean open;

    public DoorLayerItem() {
    }

    public DoorLayerItem(Long id) {
        super(id);
    }

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
