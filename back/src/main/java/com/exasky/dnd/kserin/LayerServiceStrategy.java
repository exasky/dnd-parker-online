package com.exasky.dnd.kserin;

import com.exasky.dnd.adventure.model.layer.item.LayerItem;

public interface LayerServiceStrategy<I extends LayerItem> {
    I addLayerItem(Long adventureId, I toAdd);
}
