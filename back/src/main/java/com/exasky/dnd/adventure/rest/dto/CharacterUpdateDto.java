package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Character;

public class CharacterUpdateDto {
    private Long id;
    private Short hp;
    private Short mp;

    public static Character toBo(CharacterUpdateDto dto) {
        Character character = new Character(dto.id);

        character.setHp(dto.hp);
        character.setMp(dto.mp);

        return character;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getHp() {
        return hp;
    }

    public void setHp(Short hp) {
        this.hp = hp;
    }

    public Short getMp() {
        return mp;
    }

    public void setMp(Short mp) {
        this.mp = mp;
    }

    // endregion
}
