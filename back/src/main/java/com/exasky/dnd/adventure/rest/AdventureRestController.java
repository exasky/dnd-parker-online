package com.exasky.dnd.adventure.rest;

import com.exasky.dnd.gameMaster.rest.dto.AdventureCreateDto;
import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.adventure.rest.dto.SimpleAdventureReadDto;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.common.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_UTL + "/adventure")
public class AdventureRestController {

    private final AdventureService adventureService;

    @Autowired
    public AdventureRestController(AdventureService adventureService)  {
        this.adventureService = adventureService;
    }

    @GetMapping
    public List<SimpleAdventureReadDto> getSimpleAdventures() {
        return SimpleAdventureReadDto.toDto(this.adventureService.getAdventures());
    }

    @GetMapping("/{id}")
    public AdventureDto getAdventure(@PathVariable Long id) {
        return AdventureDto.toDto(this.adventureService.getById(id));
    }
}
