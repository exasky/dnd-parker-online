package com.exasky.dnd.gameMaster.rest;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.rest.dto.AdventureDto;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.AdventureMessageDto;
import com.exasky.dnd.gameMaster.rest.dto.CreateCampaignDto;
import com.exasky.dnd.gameMaster.rest.dto.SimpleCampaignDto;
import com.exasky.dnd.gameMaster.service.CampaignService;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(Constant.REST_URL + "/campaign")
public class CampaignRestController {
    private final CampaignService campaignService;
    private final SimpMessageSendingOperations messagingTemplate;

    public CampaignRestController(CampaignService campaignService, SimpMessageSendingOperations messagingTemplate) {
        this.campaignService = campaignService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping()
    public List<SimpleCampaignDto> getAllCampaigns() {
        return SimpleCampaignDto.toDto(campaignService.getAllCampaigns());
    }

    @GetMapping("/copy/{id}")
    public CreateCampaignDto copyCampaign(@PathVariable Long id) {
        return CreateCampaignDto.toDto(campaignService.copyCampaign(id));
    }

    @GetMapping("/{id}")
    public CreateCampaignDto getCampaign(@PathVariable Long id) {
        return CreateCampaignDto.toDto(campaignService.getCampaign(id));
    }

    @PostMapping
    public CreateCampaignDto createCampaign(@Valid @RequestBody CreateCampaignDto dto) {
        return CreateCampaignDto.toDto(campaignService.createCampaign(CreateCampaignDto.toBo(dto)));
    }

    @PutMapping("/{campaignId}")
    public CreateCampaignDto updateCampaign(@PathVariable Long campaignId, @Valid @RequestBody CreateCampaignDto dto) {
        Adventure previousCurrentAdventure = campaignService.getCampaign(campaignId).getCurrentAdventure();

        Campaign updatedCampaign = campaignService.updateCampaign(campaignId, CreateCampaignDto.toBo(dto));

        if (Objects.nonNull(previousCurrentAdventure)) {
            AdventureMessageDto wsDto = new AdventureMessageDto();
            wsDto.setType(AdventureMessageDto.AdventureMessageType.UPDATE_CAMPAIGN);
            if (Objects.nonNull(updatedCampaign.getCurrentAdventure())) {
                wsDto.setMessage(AdventureDto.toDto(updatedCampaign.getCurrentAdventure()));
            }
            this.messagingTemplate.convertAndSend("/topic/adventure/" + previousCurrentAdventure.getId(), wsDto);
        }

        return CreateCampaignDto.toDto(updatedCampaign);
    }

    @DeleteMapping("/{id}")
    public void deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
    }
}
