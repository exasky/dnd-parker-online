package com.exasky.dnd.adventure.model.template;

import jakarta.persistence.*;

@Entity
@Table(name = "dnd_character_template")
public class CharacterTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "back_pack_size")
    private Short backPackSize;

    public CharacterTemplate() {
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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Short getBackPackSize() {
        return backPackSize;
    }

    public void setBackPackSize(Short backPackSize) {
        this.backPackSize = backPackSize;
    }

    // endregion
}
