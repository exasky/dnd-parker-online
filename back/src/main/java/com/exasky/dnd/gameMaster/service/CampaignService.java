package com.exasky.dnd.gameMaster.service;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.service.AdventureService;
import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@PreAuthorize("hasRole('ROLE_GM')")
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final AdventureService adventureService;
    private final CharacterService characterService;

    public CampaignService(CampaignRepository campaignRepository,
            AdventureService adventureService,
            CharacterService characterService) {
        this.campaignRepository = campaignRepository;
        this.adventureService = adventureService;
        this.characterService = characterService;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign getCampaign(Long id) {
        try {
            return campaignRepository.getReferenceById(id);
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return null;
        }
    }

    public Campaign copyCampaign(Long campaignId) {
        try {
            var toCopy = campaignRepository.getReferenceById(campaignId);
            var newCampaign = new Campaign();
            newCampaign.setName(toCopy.getName() + " - copy");

            newCampaign.setAdventures(toCopy.getAdventures().stream()
                    .map(adventure -> adventureService.copy(adventure, newCampaign))
                    .collect(Collectors.toList()));

            newCampaign.setCharacters(toCopy.getCharacters().stream()
                    .map(character -> characterService.copy(character, newCampaign))
                    .collect(Collectors.toList()));

            return newCampaign;
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return null;
        }
    }

    @Transactional
    public Campaign createCampaign(Campaign toCreate) {
        Campaign attachedCampaign = this.campaignRepository.save(new Campaign());

        attachedCampaign.setName(toCreate.getName());

        attachedCampaign.updateAdventures(toCreate.getAdventures().stream()
                .map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                .collect(Collectors.toList()));

        attachedCampaign.updateCharacters(toCreate.getCharacters().stream()
                .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                .collect(Collectors.toList()));

        if (!attachedCampaign.getAdventures().isEmpty()) {
            attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
        }

        return attachedCampaign;
    }

    @Transactional
    public Campaign updateCampaign(Long id, Campaign toUpdate) {
        try {
            var attachedCampaign = campaignRepository.getReferenceById(id);
            attachedCampaign.setName(toUpdate.getName());

            attachedCampaign.updateAdventures(toUpdate.getAdventures().stream()
                    .map(adventure -> adventureService.createOrUpdate(adventure, attachedCampaign))
                    .collect(Collectors.toList()));

            attachedCampaign.updateCharacters(toUpdate.getCharacters().stream()
                    .map(character -> characterService.createOrUpdate(character, attachedCampaign))
                    .collect(Collectors.toList()));

            if (!attachedCampaign.getAdventures().isEmpty()) {
                if (Objects.nonNull(attachedCampaign.getCurrentAdventure()) &&
                        attachedCampaign.getAdventures().stream()
                                .noneMatch(adv -> adv.getId().equals(attachedCampaign.getCurrentAdventure().getId()))) {
                    attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
                } else if (Objects.isNull(attachedCampaign.getCurrentAdventure())) {
                    attachedCampaign.setCurrentAdventure(attachedCampaign.getAdventures().get(0));
                }
            } else {
                attachedCampaign.setCurrentAdventure(null);
            }
            return attachedCampaign;
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
            return null;
        }
    }

    @Transactional
    public void deleteCampaign(Long campaignId) {
        try {
            var campaign = this.campaignRepository.getReferenceById(campaignId);

            campaign.getAdventures().forEach(adventureService::delete);
            campaign.getAdventures().clear();

            campaign.getCharacters().forEach(character -> {
                character.getEquipments().clear();
                character.getBackPack().clear();
            });
            campaign.getCharacters().clear();

            campaign.getDrawnItems().clear();

            campaignRepository.delete(campaign);
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.CAMPAIGN.NOT_FOUND);
        }
    }
}
