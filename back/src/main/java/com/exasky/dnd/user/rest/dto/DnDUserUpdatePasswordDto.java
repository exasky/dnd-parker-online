package com.exasky.dnd.user.rest.dto;

import com.exasky.dnd.user.model.DnDUser;

public class DnDUserUpdatePasswordDto {
    private Long id;
    private String password;

    public static DnDUser toBo(DnDUserUpdatePasswordDto dto) {
        DnDUser bo = new DnDUser(dto.id);

        bo.setPassword(dto.password);

        return bo;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // endregion
}
