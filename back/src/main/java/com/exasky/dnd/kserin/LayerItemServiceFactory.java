package com.exasky.dnd.kserin;

import com.exasky.dnd.adventure.model.layer.item.LayerItem;

public class LayerItemServiceFactory {
    public LayerServiceStrategy<? extends LayerItem> get(LayerItemType itemType) {
        switch (itemType) {
            case DOOR:
                return new DoorLayerItemService(); // TODO ou l'objet Spring
            default:
                return null;
        }
    }
}
