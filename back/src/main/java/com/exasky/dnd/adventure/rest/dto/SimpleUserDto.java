package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.model.UserRole;

public class SimpleUserDto {
    private Long id;
    private String username;
    private UserRole role;

    public static SimpleUserDto toDto(DnDUser bo) {
        SimpleUserDto dto = new SimpleUserDto();

        dto.id = bo.getId();
        dto.username = bo.getUsername();
        dto.role = bo.getRole();

        return dto;
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

    // endregion
}
