package com.exasky.dnd.adventure.model;

import com.exasky.dnd.adventure.model.card.CharacterItem;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaign")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @OneToMany(mappedBy = "campaign", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Adventure> adventures = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "current_adventure_id", referencedColumnName = "id")
    private Adventure currentAdventure;

    @ManyToMany()
    @JoinTable(name = "campaign_character_item",
            joinColumns = @JoinColumn(name = "campaign_id", table = "character_item"),
            inverseJoinColumns = @JoinColumn(name = "character_item_id"))
    List<CharacterItem> drawnItems = new ArrayList<>();

    @OneToMany(mappedBy = "campaign", orphanRemoval = true, cascade = CascadeType.ALL)
    List<Character> characters = new ArrayList<>();

    @OneToMany(mappedBy = "campaign", orphanRemoval = true, cascade = CascadeType.ALL)
    List<Initiative> characterTurns = new ArrayList<>();

    public Campaign() {
    }

    public Campaign(Long id) {
        this.id = id;
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

    public List<Adventure> getAdventures() {
        return adventures;
    }

    public void setAdventures(List<Adventure> adventures) {
        this.adventures = adventures;
    }

    public void updateAdventures(List<Adventure> adventures) {
        this.adventures.clear();
        this.adventures.addAll(adventures);
    }

    public Adventure getCurrentAdventure() {
        return currentAdventure;
    }

    public void setCurrentAdventure(Adventure currentAdventure) {
        this.currentAdventure = currentAdventure;
    }

    public List<CharacterItem> getDrawnItems() {
        return drawnItems;
    }

    public void setDrawnItems(List<CharacterItem> drawnCards) {
        this.drawnItems = drawnCards;
    }

    public void updateDrawnItems(List<CharacterItem> drawnCards) {
        this.drawnItems.clear();
        this.drawnItems.addAll(drawnCards);
    }

    public List<Character> getCharacters() {
        return characters;
    }

    public void setCharacters(List<Character> characters) {
        this.characters = characters;
    }

    public void updateCharacters(List<Character> characters) {
        this.characters.clear();
        this.characters.addAll(characters);
    }

    public List<Initiative> getCharacterTurns() {
        return characterTurns;
    }

    public void setCharacterTurns(List<Initiative> characterTurns) {
        this.characterTurns = characterTurns;
    }

    public void updateCharacterTurns(List<Initiative> characterTurns) {
        this.characterTurns.clear();
        this.characterTurns.addAll(characterTurns);
    }
    // endregion
}
