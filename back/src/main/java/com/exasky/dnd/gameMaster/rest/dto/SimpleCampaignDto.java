package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Campaign;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class SimpleCampaignDto {
    private Long id;
    private String name;
    private List<SimpleCharacterDto> characters = new ArrayList<>();

    public static List<SimpleCampaignDto> toDto(List<Campaign> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(SimpleCampaignDto::toDto).collect(Collectors.toList());
    }

    public static SimpleCampaignDto toDto(Campaign bo) {
        SimpleCampaignDto dto = new SimpleCampaignDto();

        dto.id = bo.getId();
        dto.name = bo.getName();
        dto.characters = SimpleCharacterDto.toDto(bo.getCharacters());

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

    public List<SimpleCharacterDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<SimpleCharacterDto> characters) {
        this.characters = characters;
    }

    // endregion
}
