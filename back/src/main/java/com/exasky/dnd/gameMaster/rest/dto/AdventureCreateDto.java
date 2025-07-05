package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.rest.dto.BoardDto;
import com.exasky.dnd.common.Constant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class AdventureCreateDto {
    private Long id;

    @NotEmpty(message = Constant.Errors.ADVENTURE.NAME_EMPTY)
    private String name;

    @NotNull(message = Constant.Errors.ADVENTURE.LEVEL_DIFFICULTY)
    @Min(value = 1, message = Constant.Errors.ADVENTURE.LEVEL_DIFFICULTY)
    @Max(value = 3, message = Constant.Errors.ADVENTURE.LEVEL_DIFFICULTY)
    private Short level;

    @NotNull(message = Constant.Errors.ADVENTURE.BOARD_EMPTY)
    private BoardDto[][] boards;

    public static List<Adventure> toBo(List<AdventureCreateDto> dto) {
        return Objects.isNull(dto)
                ? new ArrayList<>()
                : dto.stream().map(AdventureCreateDto::toBo).collect(Collectors.toList());
    }

    public static Adventure toBo(AdventureCreateDto dto) {
        Adventure bo = new Adventure(dto.id);

        bo.setName(dto.name);
        bo.setLevel(dto.level);
        bo.setBoards(BoardDto.toBo(dto.boards));

        return bo;
    }

    public static List<AdventureCreateDto> toDto(List<Adventure> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(AdventureCreateDto::toDto).collect(Collectors.toList());
    }

    public static AdventureCreateDto toDto(Adventure bo) {
        AdventureCreateDto dto = new AdventureCreateDto();

        dto.setId(bo.getId());
        dto.setName(bo.getName());
        dto.setLevel(bo.getLevel());
        dto.setBoards(BoardDto.toDto(bo.getBoards()));

        return dto;
    }

    // region Getter & Setters
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

    public BoardDto[][] getBoards() {
        return boards;
    }

    public void setBoards(BoardDto[][] boards) {
        this.boards = boards;
    }
    // endregion
}
