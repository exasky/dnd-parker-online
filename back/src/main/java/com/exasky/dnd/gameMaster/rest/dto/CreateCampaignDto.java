package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Campaign;

import java.util.ArrayList;
import java.util.List;

public class CreateCampaignDto {
    private Long id;
    private String name;
    private List<AdventureCreateDto> adventures = new ArrayList<>();
    private List<CharacterForCreateCampaignDto> characters = new ArrayList<>();

    public static Campaign toBo(CreateCampaignDto dto) {
        Campaign bo = new Campaign(dto.id);

        bo.setName(dto.name);
        bo.setAdventures(AdventureCreateDto.toBo(dto.adventures));
        bo.setCharacters(CharacterForCreateCampaignDto.toBo(dto.characters));

        return bo;
    }

    public static CreateCampaignDto toDto(Campaign bo) {
        CreateCampaignDto dto = new CreateCampaignDto();

        dto.id = bo.getId();
        dto.name = bo.getName();
        dto.adventures = AdventureCreateDto.toDto(bo.getAdventures());
        dto.characters = CharacterForCreateCampaignDto.toDto(bo.getCharacters());

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

    public List<AdventureCreateDto> getAdventures() {
        return adventures;
    }

    public void setAdventures(List<AdventureCreateDto> adventures) {
        this.adventures = adventures;
    }

    public List<CharacterForCreateCampaignDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterForCreateCampaignDto> characters) {
        this.characters = characters;
    }

    // endregion
}
