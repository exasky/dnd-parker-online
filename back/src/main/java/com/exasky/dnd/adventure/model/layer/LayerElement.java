package com.exasky.dnd.adventure.model.layer;

import com.exasky.dnd.adventure.model.ImageRotation;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

@Entity
@Table(name = "layer_element")
public class LayerElement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column
    @NotEmpty
    private LayerElementType type;

    @Column(name = "row_size")
    @NotEmpty
    private Integer rowSize;

    @Column(name = "col_size")
    @NotEmpty
    private Integer colSize;

    @Column
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column
    private ImageRotation rotation;

    public LayerElement() {
    }

    public LayerElement(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public LayerElementType getType() {
        return type;
    }

    public void setType(LayerElementType type) {
        this.type = type;
    }

    public Integer getRowSize() {
        return rowSize;
    }

    public void setRowSize(Integer rowSize) {
        this.rowSize = rowSize;
    }

    public Integer getColSize() {
        return colSize;
    }

    public void setColSize(Integer colSize) {
        this.colSize = colSize;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public ImageRotation getRotation() {
        return rotation;
    }

    public void setRotation(ImageRotation rotation) {
        this.rotation = rotation;
    }
}
