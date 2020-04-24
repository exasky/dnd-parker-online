package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.rest.dto.layer.DoorLayerItemDto;
import com.exasky.dnd.adventure.rest.dto.layer.SimpleLayerItemDto;
import com.exasky.dnd.adventure.rest.dto.layer.TrapLayerItemDto;

import java.util.List;

public class AdventureDto {
    private Long id;
    private String name;
    private Short level;
    private BoardDto[][] boards;

    private List<TrapLayerItemDto> traps;
    private List<DoorLayerItemDto> doors;
    private List<SimpleLayerItemDto> otherItems;

    private List<CharacterDto> characters;

    public static Adventure toBo(AdventureDto dto) {
        Adventure adventure = new Adventure(dto.id);

        adventure.setName(dto.getName());
        adventure.setLevel(dto.getLevel());
        adventure.setBoards(BoardDto.toBo(dto.getBoards()));
        adventure.setTraps(TrapLayerItemDto.toBo(dto.getTraps()));
        adventure.setDoors(DoorLayerItemDto.toBo(dto.getDoors()));
        adventure.setOtherItems(SimpleLayerItemDto.toBo(dto.getOtherItems()));

        return adventure;
    }

    public static AdventureDto toDto(Adventure bo) {
        AdventureDto dto = new AdventureDto();

        dto.setId(bo.getId());
        dto.setName(bo.getName());
        dto.setLevel(bo.getLevel());
        dto.setBoards(BoardDto.toDto(bo.getBoards()));
        dto.setTraps(TrapLayerItemDto.toDto(bo.getTraps(), new TrapLayerItemDto()));
        dto.setDoors(DoorLayerItemDto.toDto(bo.getDoors(), new DoorLayerItemDto()));
        dto.setOtherItems(SimpleLayerItemDto.toDto(bo.getOtherItems(), new SimpleLayerItemDto()));
        dto.setCharacters(CharacterDto.toDto(bo.getCampaign().getCharacters()));

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

    public List<TrapLayerItemDto> getTraps() {
        return traps;
    }

    public void setTraps(List<TrapLayerItemDto> traps) {
        this.traps = traps;
    }

    public List<DoorLayerItemDto> getDoors() {
        return doors;
    }

    public void setDoors(List<DoorLayerItemDto> doors) {
        this.doors = doors;
    }

    public List<SimpleLayerItemDto> getOtherItems() {
        return otherItems;
    }

    public void setOtherItems(List<SimpleLayerItemDto> otherItems) {
        this.otherItems = otherItems;
    }

    public List<CharacterDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterDto> characters) {
        this.characters = characters;
    }

    // endregion
}
