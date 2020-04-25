package com.exasky.dnd.adventure.model;

import javax.persistence.*;

@Entity
@Table(name = "initiative")
public class Initiative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @OneToOne
    @JoinColumn(name = "character_id")
    private Character character;

    @Column
    private Short number;

    public Initiative() {
    }

    public Initiative(Long id) {
        this.id = id;
    }

    public Initiative(Campaign campaign, Character character) {
        this.campaign = campaign;
        this.character = character;
    }

    // region Getters & Setters
    public Long getId() {
        return id;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public Character getCharacter() {
        return character;
    }

    public void setCharacter(Character character) {
        this.character = character;
    }

    public Short getNumber() {
        return number;
    }

    public void setNumber(Short number) {
        this.number = number;
    }
    // endregion
}
