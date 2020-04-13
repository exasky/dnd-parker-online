package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Dice;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DiceDto {
    private Long id;
    private String name;

    public static List<DiceDto> toDto(List<Dice> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(DiceDto::toDto).collect(Collectors.toList());
    }

    public static DiceDto toDto(Dice bo) {
        DiceDto dto = new DiceDto();

        dto.setId(bo.getId());
        dto.setName(bo.getName());

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
