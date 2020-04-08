package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.card.CardType;
import com.exasky.dnd.adventure.model.card.CharacterItem;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CharacterItemDto {
    private Long id;
    private String name;
    private Short level;
    private CardType type;

    public static List<CharacterItemDto> toDto(List<CharacterItem> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(CharacterItemDto::toDto).collect(Collectors.toList());
    }

    public static CharacterItemDto toDto(CharacterItem bo) {
        CharacterItemDto dto = new CharacterItemDto();

        dto.id = bo.getId();
        dto.level = bo.getLevel();
        dto.name = bo.getName();
        dto.type = bo.getType();

        return dto;
    }

    public static List<CharacterItem> toBo(List<CharacterItemDto> dtos) {
        return Objects.isNull(dtos)
                ? new ArrayList<>()
                : dtos.stream().map(CharacterItemDto::toBo).collect(Collectors.toList());
    }

    public static CharacterItem toBo(CharacterItemDto dto) {
        CharacterItem bo = new CharacterItem(dto.id);

        bo.setName(dto.name);
        bo.setLevel(dto.level);
        bo.setType(dto.type);

        return bo;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
