package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.CharacterRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CharacterService {
    private final CharacterRepository characterRepository;
    private final CharacterItemRepository characterItemRepository;

    public CharacterService(CharacterRepository characterRepository,
                            CharacterItemRepository characterItemRepository) {
        this.characterRepository = characterRepository;
        this.characterItemRepository = characterItemRepository;
    }

    public Character findById(Long id) {
        return this.characterRepository.getOne(id);
    }

    @Transactional
    public Character createOrUpdate(Character character, Campaign attachedCampaign) {
        Character attachedCharacter = Objects.nonNull(character.getId())
                ? characterRepository.getOne(character.getId())
                : characterRepository.save(new Character());

        attachedCharacter.setCampaign(attachedCampaign);
        attachedCharacter.setName(character.getName());
        attachedCharacter.setHp(character.getHp());
        attachedCharacter.setMaxHp(character.getMaxHp());
        attachedCharacter.setMp(character.getMp());
        attachedCharacter.setMaxMp(character.getMaxMp());
        attachedCharacter.setBackPackSize(character.getBackPackSize());

        attachedCharacter.updateBackPack(character.getBackPack().stream()
                .map(characterItem -> characterItemRepository.getOne(characterItem.getId()))
                .collect(Collectors.toList()));

        attachedCharacter.updateEquipments(character.getEquipments().stream()
                .map(characterItem -> characterItemRepository.getOne(characterItem.getId()))
                .collect(Collectors.toList()));

        return attachedCharacter;
    }
}
