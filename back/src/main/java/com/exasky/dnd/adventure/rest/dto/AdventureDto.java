package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.rest.dto.layer.*;
import com.exasky.dnd.gameMaster.rest.dto.InitiativeDto;

import java.util.List;

public class AdventureDto {
    private Long id;
    private String name;
    private Short level;
    private BoardDto[][] boards;

    private List<TrapLayerItemDto> traps;
    private List<DoorLayerItemDto> doors;
    private List<ChestLayerItemDto> chests;
    private List<MonsterLayerItemDto> monsters;
    private List<SimpleLayerItemDto> otherItems;

    private List<InitiativeDto> characterTurns;

    private List<CharacterDto> characters;

    public static AdventureDto toDto(Adventure bo) {
        AdventureDto dto = new AdventureDto();

        dto.setId(bo.getId());
        dto.setName(bo.getName());
        dto.setLevel(bo.getLevel());
        dto.setBoards(BoardDto.toDto(bo.getBoards()));

        dto.setTraps(TrapLayerItemDto.toDto(bo.getTraps()));
        dto.setDoors(DoorLayerItemDto.toDto(bo.getDoors()));
        dto.setChests(ChestLayerItemDto.toDto(bo.getChests()));
        dto.setMonsters(MonsterLayerItemDto.toDto(bo.getMonsters()));
        dto.setOtherItems(SimpleLayerItemDto.toDto(bo.getOtherItems()));

        dto.setCharacterTurns(InitiativeDto.toDto(bo.getCampaign().getCharacterTurns()));

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

    public List<ChestLayerItemDto> getChests() {
        return chests;
    }

    public void setChests(List<ChestLayerItemDto> chests) {
        this.chests = chests;
    }

    public List<MonsterLayerItemDto> getMonsters() {
        return monsters;
    }

    public void setMonsters(List<MonsterLayerItemDto> monsters) {
        this.monsters = monsters;
    }

    public List<SimpleLayerItemDto> getOtherItems() {
        return otherItems;
    }

    public void setOtherItems(List<SimpleLayerItemDto> otherItems) {
        this.otherItems = otherItems;
    }

    public List<InitiativeDto> getCharacterTurns() {
        return characterTurns;
    }

    public void setCharacterTurns(List<InitiativeDto> characterTurns) {
        this.characterTurns = characterTurns;
    }

    public List<CharacterDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterDto> characters) {
        this.characters = characters;
    }

    // endregion
}
