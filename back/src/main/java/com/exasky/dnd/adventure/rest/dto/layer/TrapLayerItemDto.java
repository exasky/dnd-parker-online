package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.TrapLayerItem;

public class TrapLayerItemDto extends LayerItemDto<TrapLayerItemDto, TrapLayerItem> {
    private Boolean shown;
    private Boolean deactivated;

    @Override
    public TrapLayerItem createBoInstance(Long id) {
        return new TrapLayerItem(id);
    }

    @Override
    public TrapLayerItemDto createDtoInstance() {
        return new TrapLayerItemDto();
    }

    @Override
    public void specific_toBo(TrapLayerItem trapLayerItem) {
        trapLayerItem.setShown(getShown());
        trapLayerItem.setDeactivated(getDeactivated());
    }

    @Override
    protected void specific_toDto(TrapLayerItem bo, TrapLayerItemDto dto) {
        dto.setShown(bo.getShown());
        dto.setDeactivated(bo.getDeactivated());
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
