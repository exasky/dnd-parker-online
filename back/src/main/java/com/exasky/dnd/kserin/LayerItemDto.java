package com.exasky.dnd.kserin;

public abstract class LayerItemDto {
    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public static LayerItemType type(LayerItemDto dto) {
        // TODO nullcheck & exception
        return LayerItemType.valueOf(dto.getType());
    }
}
