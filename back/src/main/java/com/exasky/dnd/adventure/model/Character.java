package com.exasky.dnd.adventure.model;

import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.user.model.DnDUser;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dnd_character")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO refacto to character_template_id
    @Column
    private String name;
    @Column(name = "display_name")
    private String displayName;

    @Column
    private Short hp;
    @Column(name = "max_hp")
    private Short maxHp;

    @Column
    private Short mp;
    @Column(name = "max_mp")
    private Short maxMp;

    @Column(name = "back_pack_size")
    private Short backPackSize;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private DnDUser user;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @OneToOne
    @JoinColumn(name = "initiative_id")
    private Initiative characterTurn;

    @ManyToMany
    @JoinTable(name = "character_equipment",
            joinColumns = @JoinColumn(name = "character_id", table = "character_item"),
            inverseJoinColumns = @JoinColumn(name = "character_item_id"))
    private List<CharacterItem> equipments = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "character_backpack",
            joinColumns = @JoinColumn(name = "character_id", table = "character_item"),
            inverseJoinColumns = @JoinColumn(name = "character_item_id"))
    private List<CharacterItem> backPack = new ArrayList<>();

    public Character() {
    }

    public Character(Long id) {
        this.id = id;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public DnDUser getUser() {
        return user;
    }

    public void setUser(DnDUser user) {
        this.user = user;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
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

    public Short getHp() {
        return hp;
    }

    public void setHp(Short hp) {
        this.hp = hp;
    }

    public Short getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(Short maxHp) {
        this.maxHp = maxHp;
    }

    public Short getMp() {
        return mp;
    }

    public void setMp(Short mp) {
        this.mp = mp;
    }

    public Short getMaxMp() {
        return maxMp;
    }

    public void setMaxMp(Short maxMp) {
        this.maxMp = maxMp;
    }

    public Initiative getCharacterTurn() {
        return characterTurn;
    }

    public void setCharacterTurn(Initiative characterTurn) {
        this.characterTurn = characterTurn;
    }

    public Short getBackPackSize() {
        return backPackSize;
    }

    public void setBackPackSize(Short backPackSize) {
        this.backPackSize = backPackSize;
    }

    public List<CharacterItem> getEquipments() {
        return equipments;
    }

    public void setEquipments(List<CharacterItem> equipment) {
        this.equipments = equipment;
    }

    public void updateEquipments(List<CharacterItem> equipment) {
        this.equipments.clear();
        this.equipments.addAll(equipment);
    }

    public List<CharacterItem> getBackPack() {
        return backPack;
    }

    public void setBackPack(List<CharacterItem> backPack) {
        this.backPack = backPack;
    }

    public void updateBackPack(List<CharacterItem> backPack) {
        this.backPack.clear();
        this.backPack.addAll(backPack);
    }

    // endregion
}
