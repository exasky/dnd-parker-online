package com.exasky.dnd.adventure.model.log;

import com.exasky.dnd.adventure.model.Adventure;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "adventure_log")
public class AdventureLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date logDate;

    @ManyToOne
    @JoinColumn(name = "adventure_id")
    private Adventure adventure;

    @Enumerated(EnumType.STRING)
    @Column
    private AdventureLogType type;

    @Column(name = "from_user")
    private String from;

    @Column(name = "from_user_id")
    private String fromId;

    @Column(name = "to_user")
    private String to;

    @Column(name = "to_user_id")
    private String toId;

    public AdventureLog() {
        this.logDate = new Date();
    }

    public AdventureLog(Adventure attachedAdventure, AdventureLogType type) {
        this.adventure = attachedAdventure;
        this.type = type;
        this.logDate = new Date();
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public Date getLogDate() {
        return logDate;
    }

    public void setLogDate(Date logDate) {
        this.logDate = logDate;
    }

    public Adventure getAdventure() {
        return adventure;
    }

    public void setAdventure(Adventure adventure) {
        this.adventure = adventure;
    }

    public AdventureLogType getType() {
        return type;
    }

    public void setType(AdventureLogType type) {
        this.type = type;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getFromId() {
        return fromId;
    }

    public void setFromId(String fromId) {
        this.fromId = fromId;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getToId() {
        return toId;
    }

    public void setToId(String toId) {
        this.toId = toId;
    }
    // endregion
}
