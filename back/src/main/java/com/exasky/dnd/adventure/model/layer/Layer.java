package com.exasky.dnd.adventure.model.layer;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "layer")
public class Layer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy="layer", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<LayerItem> items = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<LayerItem> getItems() {
        return items;
    }

    public void setItems(List<LayerItem> items) {
        this.items = items;
    }

    public void updateItems(List<LayerItem> items) {
        this.items.clear();
        this.items.addAll(items);
    }
}

