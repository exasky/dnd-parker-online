package com.exasky.dnd.adventure.model;

import com.exasky.dnd.adventure.model.layer.Layer;

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

    @OneToMany(mappedBy = "adventure", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mj_layer_id", referencedColumnName = "id")
    private Layer mjLayer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "character_layer_id", referencedColumnName = "id")
    private Layer characterLayer;

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

    public Layer getMjLayer() {
        return mjLayer;
    }

    public void setMjLayer(Layer mjLayer) {
        this.mjLayer = mjLayer;
    }

    public Layer getCharacterLayer() {
        return characterLayer;
    }

    public void setCharacterLayer(Layer characterLayer) {
        this.characterLayer = characterLayer;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    // endregion
}
