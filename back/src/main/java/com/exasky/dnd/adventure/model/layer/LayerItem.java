package com.exasky.dnd.adventure.model.layer;

import javax.persistence.*;

@Entity
@Table(name = "layer_item")
public class LayerItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "layer_id")
    private Layer layer;

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

    public Layer getLayer() {
        return layer;
    }

    public void setLayer(Layer layer) {
        this.layer = layer;
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
