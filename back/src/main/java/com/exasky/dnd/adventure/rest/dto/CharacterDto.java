package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Character;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CharacterDto {
    private Long id;
    private String name;

    private Short maxHp;
    private Short hp;

    private Short maxMp;
    private Short mp;

    private List<CharacterItemDto> equippedItems;
    private List<CharacterItemDto> backpackItems;
    private Short backpackSize;

    private Long userId;

    public static List<CharacterDto> toDto(List<Character> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(CharacterDto::toDto).collect(Collectors.toList());
    }

    public static CharacterDto toDto(Character bo) {
        CharacterDto dto = new CharacterDto();

        dto.id = bo.getId();
        dto.name = bo.getName();
        dto.maxMp = bo.getMaxMp();
        dto.hp = bo.getHp();
        dto.maxMp = bo.getMp();
        dto.mp = bo.getMp();
        dto.backpackSize = bo.getBackPackSize();
        dto.equippedItems = CharacterItemDto.toDto(bo.getEquipments());
        dto.backpackItems = CharacterItemDto.toDto(bo.getBackPack());
        if (Objects.nonNull(bo.getUser())) {
            dto.userId = bo.getUser().getId();
        }

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

    public Short getHp() {
        return hp;
    }

    public void setHp(Short hp) {
        this.hp = hp;
    }

    public Short getMaxMp() {
        return maxMp;
    }

    public void setMaxMp(Short maxMp) {
        this.maxMp = maxMp;
    }

    public Short getMp() {
        return mp;
    }

    public void setMp(Short mp) {
        this.mp = mp;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // endregion
}
