package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.item.DoorLayerItem;

public class DoorLayerItemDto extends LayerItemDto<DoorLayerItemDto, DoorLayerItem> {
    private Boolean vertical;
    private Boolean open;

    @Override
    public DoorLayerItem createBoInstance(Long id) {
        return new DoorLayerItem(id);
    }

    @Override
    public DoorLayerItemDto createDtoInstance() {
        return new DoorLayerItemDto();
    }

    @Override
    public void specific_toBo(DoorLayerItem doorLayerItem) {
        doorLayerItem.setVertical(getVertical());
        doorLayerItem.setOpen(getOpen());
    }

    @Override
    protected void specific_toDto(DoorLayerItem bo, DoorLayerItemDto dto) {
        dto.setVertical(bo.getVertical());
        dto.setOpen(bo.getOpen());
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
