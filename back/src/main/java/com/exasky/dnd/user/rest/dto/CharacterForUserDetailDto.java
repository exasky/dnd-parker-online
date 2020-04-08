package com.exasky.dnd.user.rest.dto;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CharacterForUserDetailDto {

    private Long id;
    private String name;
    private Long campaignId;
    private String campaignName;

    public static List<CharacterForUserDetailDto> toDto(List<Character> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(CharacterForUserDetailDto::toDto).collect(Collectors.toList());
    }

    public static CharacterForUserDetailDto toDto(Character bo) {
        CharacterForUserDetailDto dto = new CharacterForUserDetailDto();

        dto.id = bo.getId();
        dto.name = bo.getName();
        dto.campaignId = bo.getCampaign().getId();
        dto.campaignName = bo.getCampaign().getName();

        return dto;
    }

    public static List<Character> toBo(List<CharacterForUserDetailDto> dtos) {
        return Objects.isNull(dtos)
            ? new ArrayList<>()
            : dtos.stream().map(CharacterForUserDetailDto::toBo).collect(Collectors.toList());
    }

    public static Character toBo(CharacterForUserDetailDto dto) {
        Character bo = new Character(dto.id);

        bo.setName(dto.name);
        bo.setCampaign(new Campaign(dto.campaignId));
        bo.getCampaign().setName(dto.campaignName);

        return bo;
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

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }

    // endregion
}
