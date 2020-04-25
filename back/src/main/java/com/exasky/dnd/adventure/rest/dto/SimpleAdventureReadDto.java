package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Adventure;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class SimpleAdventureReadDto {
    private Long id;
    private String name;

    public static List<SimpleAdventureReadDto> toDto(List<Adventure> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(SimpleAdventureReadDto::toDto).collect(Collectors.toList());
    }

    private static SimpleAdventureReadDto toDto(Adventure adventure) {
        SimpleAdventureReadDto dto = new SimpleAdventureReadDto();

        dto.setId(adventure.getId());
        dto.setName(adventure.getName());

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
