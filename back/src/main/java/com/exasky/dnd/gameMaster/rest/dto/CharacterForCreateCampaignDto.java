package com.exasky.dnd.gameMaster.rest.dto;

import com.exasky.dnd.adventure.model.Character;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CharacterForCreateCampaignDto {
    private Long id;
    private String name;

    private Short maxHp;
    private Short maxMp;

    private List<CharacterItemDto> equippedItems;
    private List<CharacterItemDto> backpackItems;
    private Short backpackSize;

    public static List<Character> toBo(List<CharacterForCreateCampaignDto> dtos) {
        return Objects.isNull(dtos)
                ? new ArrayList<>()
                : dtos.stream().map(CharacterForCreateCampaignDto::toBo).collect(Collectors.toList());
    }

    public static Character toBo(CharacterForCreateCampaignDto dto) {
        Character bo = new Character();

        bo.setName(dto.name);
        bo.setMaxHp(dto.maxHp);
        bo.setHp(dto.maxHp);
        bo.setMaxMp(dto.maxMp);
        bo.setMp(dto.maxMp);
        bo.setBackPackSize(dto.backpackSize);

        bo.setEquipments(CharacterItemDto.toBo(dto.equippedItems));
        bo.setBackPack(CharacterItemDto.toBo(dto.backpackItems));

        return bo;
    }

    public static List<CharacterForCreateCampaignDto> toDto(List<Character> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(CharacterForCreateCampaignDto::toDto).collect(Collectors.toList());
    }

    public static CharacterForCreateCampaignDto toDto(Character bo) {
        CharacterForCreateCampaignDto dto = new CharacterForCreateCampaignDto();

        dto.id = bo.getId();
        dto.maxHp = bo.getMaxHp();
        dto.maxMp = bo.getMaxMp();
        dto.name = bo.getName();
        dto.backpackSize = bo.getBackPackSize();
        dto.backpackItems = CharacterItemDto.toDto(bo.getBackPack());
        dto.equippedItems = CharacterItemDto.toDto(bo.getEquipments());

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

    public Short getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(Short maxHp) {
        this.maxHp = maxHp;
    }

    public Short getMaxMp() {
        return maxMp;
    }

    public void setMaxMp(Short maxMp) {
        this.maxMp = maxMp;
    }

    public List<CharacterItemDto> getEquippedItems() {
        return equippedItems;
    }

    public void setEquippedItems(List<CharacterItemDto> equippedItems) {
        this.equippedItems = equippedItems;
    }

    public List<CharacterItemDto> getBackpackItems() {
        return backpackItems;
    }

    public void setBackpackItems(List<CharacterItemDto> backpackItems) {
        this.backpackItems = backpackItems;
    }

    public Short getBackpackSize() {
        return backpackSize;
    }

    public void setBackpackSize(Short backpackSize) {
        this.backpackSize = backpackSize;
    }
    // endregion
}
