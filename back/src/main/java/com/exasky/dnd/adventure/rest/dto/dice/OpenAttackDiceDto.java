package com.exasky.dnd.adventure.rest.dto.dice;

import com.exasky.dnd.adventure.rest.dto.SimpleUserDto;

public class OpenAttackDiceDto {
    private Long fromAttackId;
    private Long fromAttackWeaponId;
    private Long toAttackId;
    private Boolean isMonsterAttack;
    private Boolean isMonsterAttacked;
    private SimpleUserDto user;

    // region Getters & Setters

    public Long getFromAttackId() {
        return fromAttackId;
    }

    public void setFromAttackId(Long fromAttackId) {
        this.fromAttackId = fromAttackId;
    }

    public Long getFromAttackWeaponId() {
        return fromAttackWeaponId;
    }

    public void setFromAttackWeaponId(Long fromAttackWeaponId) {
        this.fromAttackWeaponId = fromAttackWeaponId;
    }

    public Long getToAttackId() {
        return toAttackId;
    }

    public void setToAttackId(Long toAttackId) {
        this.toAttackId = toAttackId;
    }

    public Boolean getIsMonsterAttack() {
        return isMonsterAttack;
    }

    public void setIsMonsterAttack(Boolean monsterAttack) {
        isMonsterAttack = monsterAttack;
    }

    public Boolean getIsMonsterAttacked() {
        return isMonsterAttacked;
    }

    public void setIsMonsterAttacked(Boolean monsterAttacked) {
        isMonsterAttacked = monsterAttacked;
    }

    public SimpleUserDto getUser() {
        return user;
    }

    public void setUser(SimpleUserDto user) {
        this.user = user;
    }
// endregion
}
