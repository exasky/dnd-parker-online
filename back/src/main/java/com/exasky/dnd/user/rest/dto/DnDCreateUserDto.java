package com.exasky.dnd.user.rest.dto;

import com.exasky.dnd.common.Constant;
import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.model.UserRole;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class DnDCreateUserDto {
    @NotNull(message = Constant.Errors.USER.NAME_EMPTY)
    @NotEmpty(message = Constant.Errors.USER.NAME_EMPTY)
    private String username;

    @NotNull(message = Constant.Errors.USER.ROLE_EMPTY)
    private UserRole role;

    @NotNull(message = Constant.Errors.USER.PASSWORD_EMPTY)
    @NotEmpty(message = Constant.Errors.USER.PASSWORD_EMPTY)
    private String password;

    private List<CharacterForUserDetailDto> characters = new ArrayList<>();

    public static DnDCreateUserDto toDto(DnDUser bo) {
        DnDCreateUserDto dto = new DnDCreateUserDto();

        dto.setRole(bo.getRole());
        dto.setUsername(bo.getUsername());
        dto.setCharacters(CharacterForUserDetailDto.toDto(bo.getCharacters()));

        return dto;
    }

    public static DnDUser toBo(DnDCreateUserDto dto) {
        DnDUser bo = new DnDUser();

        bo.setPassword(dto.password);
        bo.setRole(dto.role);
        bo.setUsername(dto.username);
        bo.setCharacters(CharacterForUserDetailDto.toBo(dto.getCharacters()));

        return bo;
    }

    // region Getters & Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    // endregion
}
