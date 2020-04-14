package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.CharacterTemplate;
import com.exasky.dnd.adventure.model.layer.Layer;
import com.exasky.dnd.adventure.model.layer.LayerItem;
import com.exasky.dnd.adventure.repository.AdventureRepository;
import com.exasky.dnd.adventure.repository.CampaignRepository;
import com.exasky.dnd.adventure.repository.CharacterTemplateRepository;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.exasky.dnd.adventure.model.layer.LayerElementType.*;
import static com.exasky.dnd.common.Utils.getCurrentUser;

@Service
public class AdventureService {

    private final AdventureRepository repository;
    private final CampaignRepository campaignRepository;
    private final CharacterTemplateRepository characterTemplateRepository;
    private final LayerItemService layerItemService;
    private final BoardService boardService;

    @Autowired
    public AdventureService(AdventureRepository repository,
                            CampaignRepository campaignRepository,
                            CharacterTemplateRepository characterTemplateRepository,
                            LayerItemService layerItemService,
                            BoardService boardService) {
        this.repository = repository;
        this.campaignRepository = campaignRepository;
        this.characterTemplateRepository = characterTemplateRepository;
        this.layerItemService = layerItemService;
        this.boardService = boardService;
    }

    public List<CharacterTemplate> getAllCharacterTemplate() {
        return characterTemplateRepository.findAll();
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

    public List<Campaign> getCampaignsForCurrentUser() {
        return this.campaignRepository.findAllForUser(getCurrentUser().getId());
    }

    @Transactional
    public LayerItem addLayerItem(Long id, LayerItem toAdd) {
        Adventure attachedAdventure = repository.getOne(id);

        Layer layerToAdd = getLayerForLayerElement(attachedAdventure, toAdd);
        LayerItem attachedLayerItem = this.layerItemService.createOrUpdate(toAdd, layerToAdd);
        layerToAdd.getItems().add(attachedLayerItem);

        return attachedLayerItem;
    }

    @Transactional
    public LayerItem updateLayerItem(Long adventureId, LayerItem toAdd) {
        Adventure attachedAdventure = repository.getOne(adventureId);

        Layer layerToUpdate = getLayerForLayerElement(attachedAdventure, toAdd);
        LayerItem attachedLayerItem = this.layerItemService.createOrUpdate(toAdd, layerToUpdate);

        LayerItem previousLayerItem = layerToUpdate.getItems().stream()
                .filter(layerItem -> layerItem.getId().equals(attachedLayerItem.getId()))
                .findFirst()
                .orElse(null);

        if (Objects.isNull(previousLayerItem)) {
            ValidationCheckException.throwError(Constant.Errors.ADVENTURE.LAYER_ITEM_NOT_FOUND);
        }

        int idx = layerToUpdate.getItems().indexOf(previousLayerItem);
        layerToUpdate.getItems().set(idx, attachedLayerItem);

//        int index;
//        for (index = 0; index < layerToUpdate.getItems().size(); index++) {
//            LayerItem currentLayerItem = layerToUpdate.getItems().get(index);
//            if (currentLayerItem.getId().equals(attachedLayerItem.getId())) {
//                break;
//            }
//        }
//        layerToUpdate.getItems().set(index, attachedLayerItem);

        return attachedLayerItem;
    }

    @Transactional
    public void deleteLayerItem(Long adventureId, Long layerItemId) {
        Adventure attachedAdventure = repository.getOne(adventureId);
        LayerItem attachedLayerItem = this.layerItemService.getOne(layerItemId);

        Layer layerForLayerElement = getLayerForLayerElement(attachedAdventure, attachedLayerItem);
        layerForLayerElement.getItems().remove(attachedLayerItem);
    }

    private Layer getLayerForLayerElement(Adventure attachedAdventure, LayerItem layerItem) {
        return Arrays.asList(CHARACTER, MONSTER, TREE, PYLON).contains(layerItem.getLayerElement().getType())
                ? attachedAdventure.getCharacterLayer()
                : attachedAdventure.getMjLayer();
    }
}
