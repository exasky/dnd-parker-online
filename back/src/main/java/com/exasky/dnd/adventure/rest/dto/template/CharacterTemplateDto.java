package com.exasky.dnd.adventure.rest.dto.template;

import com.exasky.dnd.adventure.model.template.CharacterTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CharacterTemplateDto {
    private Long id;
    private String name;
    private String displayName;
    private Short backPackSize;

    public static List<CharacterTemplateDto> toDto(List<CharacterTemplate> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(CharacterTemplateDto::toDto).collect(Collectors.toList());
    }

    public static CharacterTemplateDto toDto(CharacterTemplate bo) {
        CharacterTemplateDto dto = new CharacterTemplateDto();

        dto.id = bo.getId();
        dto.name = bo.getName();
        dto.displayName = bo.getDisplayName();
        dto.backPackSize = bo.getBackPackSize();

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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Short getBackPackSize() {
        return backPackSize;
    }

    public void setBackPackSize(Short backPackSize) {
        this.backPackSize = backPackSize;
    }

    // endregion

}
