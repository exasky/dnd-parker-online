package com.exasky.dnd.user.rest.dto;

import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.model.UserRole;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DnDUserDto {
    private Long id;
    private String username;
    private UserRole role;
    private List<CharacterForUserDetailDto> characters = new ArrayList<>();

    public static List<DnDUserDto> toDto(List<DnDUser> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(DnDUserDto::toDto).collect(Collectors.toList());
    }

    public static DnDUserDto toDto(DnDUser bo) {
        DnDUserDto dto = new DnDUserDto();

        dto.setId(bo.getId());
        dto.setRole(bo.getRole());
        dto.setUsername(bo.getUsername());
        dto.setCharacters(CharacterForUserDetailDto.toDto(bo.getCharacters()));

        return dto;
    }

    public static DnDUser toBo(DnDUserDto dto) {
        DnDUser bo = new DnDUser();

        bo.setRole(dto.role);
        bo.setUsername(dto.username);
        bo.setCharacters(CharacterForUserDetailDto.toBo(dto.getCharacters()));

        return bo;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public List<CharacterForUserDetailDto> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterForUserDetailDto> characters) {
        this.characters = characters;
    }

    // endregion
}
