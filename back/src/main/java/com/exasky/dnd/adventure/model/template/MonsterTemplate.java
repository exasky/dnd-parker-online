package com.exasky.dnd.adventure.model.template;

import com.exasky.dnd.adventure.model.layer.LayerElement;

import jakarta.persistence.*;

@Entity
@Table(name = "dnd_monster_template")
public class MonsterTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "max_hp")
    private Short maxHp;

    @Column(name = "move_points")
    private Short movePoints;

    @Column(name = "armor")
    private Short armor;

    @Column(name = "ud_resist")
    private Short udResist;

    @OneToOne
    @JoinColumn(name = "monster_element_id")
    private LayerElement monsterElement;

    public MonsterTemplate() {
    }

    public MonsterTemplate(Long id) {
        this.id = id;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public Short getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(Short maxHp) {
        this.maxHp = maxHp;
    }

    public Short getMovePoints() {
        return movePoints;
    }

    public void setMovePoints(Short movePoints) {
        this.movePoints = movePoints;
    }

    public Short getArmor() {
        return armor;
    }

    public void setArmor(Short armor) {
        this.armor = armor;
    }

    public Short getUdResist() {
        return udResist;
    }

    public void setUdResist(Short udResist) {
        this.udResist = udResist;
    }

    public LayerElement getMonsterElement() {
        return monsterElement;
    }

    public void setMonsterElement(LayerElement monsterElement) {
        this.monsterElement = monsterElement;
    }

    // region
}
