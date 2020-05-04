package com.exasky.dnd.adventure.service.layer;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.layer.item.CharacterLayerItem;
import com.exasky.dnd.adventure.repository.CharacterRepository;
import com.exasky.dnd.adventure.repository.LayerElementRepository;
import com.exasky.dnd.adventure.repository.layer.CharacterLayerItemRepository;
import org.springframework.stereotype.Service;

@Service
public class CharacterLayerItemService extends ParentLayerItemService<CharacterLayerItem> {
    private final CharacterRepository characterRepository;

    public CharacterLayerItemService(CharacterLayerItemRepository characterLayerItemRepository,
                                     LayerElementRepository repo,
                                     CharacterRepository characterRepository) {
        super(characterLayerItemRepository, repo);
        this.characterRepository = characterRepository;
    }

    @Override
    protected CharacterLayerItem createInstance() {
        return new CharacterLayerItem();
    }

    @Override
    protected void specific_create(CharacterLayerItem newLayerItem, CharacterLayerItem toCreate, Adventure attachedAdventure) {
        newLayerItem.setCharacter(characterRepository.getOne(toCreate.getCharacter().getId()));
    }

    @Override
    public void specific_update(CharacterLayerItem updatedLayerItem, CharacterLayerItem toUpdate) {
        specific_create(updatedLayerItem, toUpdate, null);
    }

    @Override
    public void specific_copy(CharacterLayerItem newLayerItem, CharacterLayerItem toCopy, Adventure adventure) {
        specific_create(newLayerItem, toCopy, null);
    }
}
