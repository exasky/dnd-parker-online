package com.exasky.dnd.adventure.rest.dto.dice;

import java.util.List;

public class SelectDicesDto {
    private List<Long> ids;

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
