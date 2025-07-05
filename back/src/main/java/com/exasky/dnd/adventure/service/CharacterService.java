package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Campaign;
import com.exasky.dnd.adventure.model.Character;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.CharacterRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
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
		return this.characterRepository.getReferenceById(id);
	}

	@Transactional
	public Character createOrUpdate(Character character, Campaign attachedCampaign) {
		Character attachedCharacter = Objects.nonNull(character.getId())
				? characterRepository.getReferenceById(character.getId())
				: characterRepository.save(new Character());

		attachedCharacter.setCampaign(attachedCampaign);
		attachedCharacter.setName(character.getName());
		attachedCharacter.setDisplayName(character.getDisplayName());
		attachedCharacter.setHp(character.getHp());
		attachedCharacter.setMaxHp(character.getMaxHp());
		attachedCharacter.setMp(character.getMp());
		attachedCharacter.setMaxMp(character.getMaxMp());
		attachedCharacter.setBackPackSize(character.getBackPackSize());

		attachedCharacter.updateBackPack(character.getBackPack().stream()
				.map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
				.collect(Collectors.toList()));

		attachedCharacter.updateEquipments(character.getEquipments().stream()
				.map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
				.collect(Collectors.toList()));

		return attachedCharacter;
	}

	public Character copy(Character toCopy, Campaign campaign) {
		Character attachedCharacter = new Character();

		attachedCharacter.setCampaign(campaign);
		attachedCharacter.setName(toCopy.getName());
		attachedCharacter.setDisplayName(toCopy.getDisplayName());
		attachedCharacter.setHp(toCopy.getHp());
		attachedCharacter.setMaxHp(toCopy.getMaxHp());
		attachedCharacter.setMp(toCopy.getMp());
		attachedCharacter.setMaxMp(toCopy.getMaxMp());
		attachedCharacter.setBackPackSize(toCopy.getBackPackSize());

		attachedCharacter.updateBackPack(toCopy.getBackPack().stream()
				.map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
				.collect(Collectors.toList()));

		attachedCharacter.updateEquipments(toCopy.getEquipments().stream()
				.map(characterItem -> characterItemRepository.getReferenceById(characterItem.getId()))
				.collect(Collectors.toList()));

		return attachedCharacter;
	}
}
