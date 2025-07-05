package com.exasky.dnd.adventure.model.layer.item;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "layer_item_trap")
public class TrapLayerItem extends LayerItem {
    private Boolean shown;
    private Boolean deactivated;

    public TrapLayerItem() {
    }

    public TrapLayerItem(Long id) {
        super(id);
    }

    // region Getters & Setters

    public Boolean getShown() {
        return shown;
    }

    public void setShown(Boolean shown) {
        this.shown = shown;
    }

    public Boolean getDeactivated() {
        return deactivated;
    }

    public void setDeactivated(Boolean deactivated) {
        this.deactivated = deactivated;
    }

    // endregion
}
