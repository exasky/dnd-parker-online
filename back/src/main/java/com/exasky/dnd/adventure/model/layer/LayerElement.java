package com.exasky.dnd.adventure.model.layer;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

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
    private String name;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
