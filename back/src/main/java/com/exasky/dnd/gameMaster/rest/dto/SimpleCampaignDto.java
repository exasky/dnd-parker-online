package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.common.Utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class SimpleCampaignDto {
    private Long id;
    private String name;
    private Long currentAdventureId;
    private String currentAdventureName;
    private List<String> currentCharacterDisplayName;
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
        if (Objects.nonNull(bo.getCurrentAdventure())) {
            dto.currentAdventureName = bo.getCurrentAdventure().getName();
            dto.currentAdventureId = bo.getCurrentAdventure().getId();
        }
        dto.characters = SimpleCharacterDto.toDto(bo.getCharacters());
        dto.currentCharacterDisplayName = bo.getCharacters().stream()
                .filter(character -> Objects.nonNull(character.getUser()) && Utils.getCurrentUser().getId().equals(character.getUser().getId()))
                .map(Character::getDisplayName)
                .collect(Collectors.toList());

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

    public Long getCurrentAdventureId() {
        return currentAdventureId;
    }

    public void setCurrentAdventureId(Long currentAdventureId) {
        this.currentAdventureId = currentAdventureId;
    }

    public String getCurrentAdventureName() {
        return currentAdventureName;
    }

    public void setCurrentAdventureName(String currentAdventureName) {
        this.currentAdventureName = currentAdventureName;
    }

    public List<String> getCurrentCharacterDisplayName() {
        return currentCharacterDisplayName;
    }

    public void setCurrentCharacterDisplayName(List<String> currentCharacterDisplayName) {
        this.currentCharacterDisplayName = currentCharacterDisplayName;
    }

    public List<SimpleCharacterDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<SimpleCharacterDto> characters) {
        this.characters = characters;
    }

    // endregion
}
