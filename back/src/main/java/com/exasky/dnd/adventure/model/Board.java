package com.exasky.dnd.adventure.model;

import javax.persistence.*;

@Entity
@Table(name = "board")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "adventure_id")
    private Adventure adventure;

    /**
     * COL
     */
    @Column(name = "position_x")
    private Integer positionX;

    /**
     * ROW
     */
    @Column(name = "position_y")
    private Integer positionY;

    @Column(name = "board_number")
    private Integer boardNumber;

    @Enumerated(EnumType.STRING)
    @Column
    private ImageRotation rotation;

    public Board() {
    }

    public Board(Long id) {
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

    public Integer getBoardNumber() {
        return boardNumber;
    }

    public void setBoardNumber(Integer boardNumber) {
        this.boardNumber = boardNumber;
    }

    public ImageRotation getRotation() {
        return rotation;
    }

    public void setRotation(ImageRotation rotation) {
        this.rotation = rotation;
    }
    // endregion
}
