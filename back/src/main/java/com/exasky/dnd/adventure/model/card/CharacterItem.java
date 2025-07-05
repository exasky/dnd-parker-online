package com.exasky.dnd.adventure.model.card;

import jakarta.persistence.*;

@Entity
@Table(name = "character_item")
public class CharacterItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private Short level;

    @Column
    @Enumerated(EnumType.STRING)
    private CardType type;

    public CharacterItem() {
    }

    public CharacterItem(Long id) {
        this.id = id;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Short getLevel() {
        return level;
    }

    public void setLevel(Short level) {
        this.level = level;
    }

    public CardType getType() {
        return type;
    }

    public void setType(CardType type) {
        this.type = type;
    }
    // endregion
}
