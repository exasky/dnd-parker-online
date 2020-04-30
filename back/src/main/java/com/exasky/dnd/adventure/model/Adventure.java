package com.exasky.dnd.adventure.model;

import com.exasky.dnd.adventure.model.layer.item.*;
import com.exasky.dnd.adventure.model.log.AdventureLog;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "adventure")
public class Adventure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private Short level;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @OneToOne
    @JoinColumn(name = "current_initiative_id")
    private Initiative currentInitiative;

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<DoorLayerItem> doors = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TrapLayerItem> traps = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ChestLayerItem> chests = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<MonsterLayerItem> monsters = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<CharacterLayerItem> characters = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<SimpleLayerItem> otherItems = new ArrayList<>();

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<AdventureLog> logs = new ArrayList<>();

    public Adventure() {
    }

    public Adventure(Long id) {
        this.id = id;
    }

    public Adventure(Campaign attachedCampaign) {
        this.campaign = attachedCampaign;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Short getLevel() {
        return level;
    }

    public void setLevel(Short level) {
        this.level = level;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public Initiative getCurrentInitiative() {
        return currentInitiative;
    }

    public void setCurrentInitiative(Initiative currentInitiative) {
        this.currentInitiative = currentInitiative;
    }

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public void updateBoards(List<Board> boards) {
        this.boards.clear();
        this.boards.addAll(boards);
    }

    public List<DoorLayerItem> getDoors() {
        return doors;
    }

    public void setDoors(List<DoorLayerItem> doors) {
        this.doors = doors;
    }

    public List<TrapLayerItem> getTraps() {
        return traps;
    }

    public void setTraps(List<TrapLayerItem> traps) {
        this.traps = traps;
    }

    public List<ChestLayerItem> getChests() {
        return chests;
    }

    public void setChests(List<ChestLayerItem> chests) {
        this.chests = chests;
    }

    public List<MonsterLayerItem> getMonsters() {
        return monsters;
    }

    public void setMonsters(List<MonsterLayerItem> monsters) {
        this.monsters = monsters;
    }

    public List<CharacterLayerItem> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CharacterLayerItem> characters) {
        this.characters = characters;
    }

    public List<SimpleLayerItem> getOtherItems() {
        return otherItems;
    }

    public void setOtherItems(List<SimpleLayerItem> otherItems) {
        this.otherItems = otherItems;
    }

    public List<AdventureLog> getLogs() {
        return logs;
    }

    public void setLogs(List<AdventureLog> logs) {
        this.logs = logs;
    }

    // endregion
}
