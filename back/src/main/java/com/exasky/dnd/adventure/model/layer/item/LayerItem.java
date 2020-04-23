package com.exasky.dnd.adventure.model.layer.item;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.LayerElement;

import javax.persistence.*;

@MappedSuperclass
public abstract class LayerItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "adventure_id")
    private Adventure adventure;

    @Column(name = "position_x")
    private Integer positionX;

    @Column(name = "position_y")
    private Integer positionY;

    @OneToOne
    @JoinColumn(name = "layer_element_id", referencedColumnName = "id")
    private LayerElement layerElement;

    public LayerItem() {
    }

    public LayerItem(Long id) {
        this.id = id;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public Adventure getAdventure() {
        return adventure;
    }

    public void setAdventure(Adventure adventure) {
        this.adventure = adventure;
    }

    public Integer getPositionX() {
        return positionX;
    }

    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }

    public Integer getPositionY() {
        return positionY;
    }

    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }

    public LayerElement getLayerElement() {
        return layerElement;
    }

    public void setLayerElement(LayerElement layerElement) {
        this.layerElement = layerElement;
    }
    // endregion
}
