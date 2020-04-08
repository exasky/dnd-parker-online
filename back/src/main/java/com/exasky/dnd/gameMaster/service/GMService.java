package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.card.CharacterItem;
import com.exasky.dnd.adventure.model.layer.LayerElement;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.gameMaster.repository.GMLayerElementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
// TODO preauthorize gm
public class GMService {

    private final GMLayerElementRepository layerElementRepository;

    private final CampaignRepository campaignRepository;

    private final CharacterItemRepository characterItemRepository;

    private final AdventureService adventureService;

    private final CharacterService characterService;

    @Autowired
    public GMService(GMLayerElementRepository repository,
                     CampaignRepository campaignRepository,
                     CharacterItemRepository characterItemRepository,
                     AdventureService adventureService,
                     CharacterService characterService) {
        this.layerElementRepository = repository;
        this.campaignRepository = campaignRepository;
        this.characterItemRepository = characterItemRepository;
        this.adventureService = adventureService;
        this.characterService = characterService;
    }

    public List<LayerElement> getAddableElements() {
        return this.layerElementRepository.findAll();
    }

    public List<CharacterItem> getAllCharacterItems() {
        return this.characterItemRepository.findAll();
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign getCampaign(Long id) {
        return campaignRepository.getOne(id);
    }

    @Transactional
    public Campaign create(Campaign toCreate) {
        Campaign attachedCampaign = this.campaignRepository.save(new Campaign());

        attachedCampaign.updateAdventures(toCreate.getAdventures().stream().
                map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                .collect(Collectors.toList()));

        attachedCampaign.updateCharacters(toCreate.getCharacters().stream()
                .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                .collect(Collectors.toList()));

        return attachedCampaign;
    }

    @Transactional
    public Campaign update(Long id, Campaign toUpdate) {
        Campaign attachedCampaign = this.campaignRepository.getOne(id);

        attachedCampaign.updateAdventures(toUpdate.getAdventures().stream().
                map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                .collect(Collectors.toList()));

        attachedCampaign.updateCharacters(toUpdate.getCharacters().stream()
                .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                .collect(Collectors.toList()));

        return attachedCampaign;
    }
}
