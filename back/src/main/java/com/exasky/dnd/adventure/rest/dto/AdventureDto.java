package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Adventure;

import java.util.List;

public class AdventureDto {
    private Long id;
    private String name;
    private Short level;
    private BoardDto[][] boards;
//    private LayerDto mjLayer;
//    private LayerDto characterLayer;
    private List<CharacterDto> characters;

    public static Adventure toBo(AdventureDto dto) {
        Adventure adventure = new Adventure();

        adventure.setName(dto.name);
        adventure.setLevel(dto.level);
        adventure.setBoards(BoardDto.toBo(dto.boards));
//        adventure.setMjLayer(LayerDto.toBo(dto.mjLayer));
//        adventure.setCharacterLayer(LayerDto.toBo(dto.characterLayer));

        return adventure;
    }

    public static AdventureDto toDto(Adventure bo) {
        AdventureDto dto = new AdventureDto();

        dto.setId(bo.getId());
        dto.setName(bo.getName());
        dto.setLevel(bo.getLevel());
        dto.setBoards(BoardDto.toDto(bo.getBoards()));
//        dto.setMjLayer(LayerDto.toDto(bo.getMjLayer()));
//        dto.setCharacterLayer(LayerDto.toDto(bo.getCharacterLayer()));
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

//    public LayerDto getMjLayer() {
//        return mjLayer;
//    }
//
//    public void setMjLayer(LayerDto mjLayer) {
//        this.mjLayer = mjLayer;
//    }
//
//    public LayerDto getCharacterLayer() {
//        return characterLayer;
//    }
//
//    public void setCharacterLayer(LayerDto characterLayer) {
//        this.characterLayer = characterLayer;
//    }

    public List<CharacterDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterDto> characters) {
        this.characters = characters;
    }

    // endregion
}
