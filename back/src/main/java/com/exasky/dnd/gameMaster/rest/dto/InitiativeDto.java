package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.model.Initiative;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class InitiativeDto {
    private Long id;
    private String characterName;
    private Short number;

    public static List<InitiativeDto> toDto(List<Initiative> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(InitiativeDto::toDto).collect(Collectors.toList());
    }

    public static InitiativeDto toDto(Initiative bo) {
        InitiativeDto dto = new InitiativeDto();

        dto.setId(bo.getId());
        dto.setCharacterName(Objects.isNull(bo.getCharacter()) ? "game-master" : bo.getCharacter().getName());
        dto.setNumber(bo.getNumber());

        return dto;
    }

    public static List<Initiative> toBo(List<InitiativeDto> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(InitiativeDto::toBo).collect(Collectors.toList());
    }

    private static Initiative toBo(InitiativeDto dto) {
        Initiative bo = new Initiative(dto.id);

        bo.setCharacter(new Character());
        bo.getCharacter().setName(dto.characterName);
        bo.setNumber(dto.number);

        return bo;
    }

    // region Getters & Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCharacterName() {
        return characterName;
    }

    public void setCharacterName(String characterName) {
        this.characterName = characterName;
    }

    public Short getNumber() {
        return number;
    }

    public void setNumber(Short number) {
        this.number = number;
    }

    // endregion
}
