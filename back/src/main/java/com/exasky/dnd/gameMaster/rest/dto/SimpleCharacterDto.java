package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Character;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class SimpleCharacterDto {
    private Long id;
    private String name;

    public static List<SimpleCharacterDto> toDto(List<Character> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(SimpleCharacterDto::toDto).collect(Collectors.toList());
    }

    public static SimpleCharacterDto toDto(Character bo) {
        SimpleCharacterDto dto = new SimpleCharacterDto();

        dto.id = bo.getId();
        dto.name = bo.getName();

        return dto;
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

    // endregion
}
