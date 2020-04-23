package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.TrapLayerItem;

public class TrapLayerItemDto extends LayerItemDto {
    private Boolean shown;
    private Boolean deactivated;

    @Override
    public TrapLayerItem toBo() {
        TrapLayerItem trapLayerItem = new TrapLayerItem();

        trapLayerItem.setShown(shown);
        trapLayerItem.setDeactivated(deactivated);
        super.toBo(trapLayerItem);

        return trapLayerItem;
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
