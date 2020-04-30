package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.log.AdventureLog;
import com.exasky.dnd.adventure.model.log.AdventureLogType;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class AdventureLogDto {
    private Long id;
    private AdventureLogType type;
    private String from;
    private String fromId;
    private String to;
    private String toId;

    public static List<AdventureLogDto> toDto(List<AdventureLog> bos) {
        return Objects.isNull(bos)
                ? new ArrayList<>()
                : bos.stream().map(AdventureLogDto::toDto).collect(Collectors.toList());
    }

    public static AdventureLogDto toDto(AdventureLog bo) {
        AdventureLogDto dto = new AdventureLogDto();

        dto.setId(bo.getId());
        dto.setType(bo.getType());
        dto.setFrom(bo.getFrom());
        dto.setFromId(bo.getFromId());
        dto.setTo(bo.getTo());
        dto.setToId(bo.getToId());

        return dto;
    }

    // region Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
