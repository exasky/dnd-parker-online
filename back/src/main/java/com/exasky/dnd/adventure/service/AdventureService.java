package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.repository.AdventureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AdventureService {

    private final AdventureRepository repository;
    private final LayerService layerService;
    private final BoardService boardService;

    @Autowired
    public AdventureService(AdventureRepository repository,
                            LayerService layerService,
                            BoardService boardService) {
        this.repository = repository;
        this.layerService = layerService;
        this.boardService = boardService;
    }

    public List<Adventure> getAdventures() {
        return this.repository.findAll();
    }

    public Adventure getById(Long id) {
        return this.repository.getOne(id);
    }

    @Transactional
    public Adventure createOrUpdate(Adventure adventure, Campaign attachedCampaign) {
        Adventure attachedAdventure = Objects.nonNull(adventure.getId())
                ? repository.getOne(adventure.getId())
                : repository.save(new Adventure(attachedCampaign));

        attachedAdventure.setName(adventure.getName());
        attachedAdventure.setLevel(adventure.getLevel());

        attachedAdventure.updateBoards(boardService.createOrUpdate(attachedAdventure, adventure.getBoards()));

        return attachedAdventure;
    }
}
