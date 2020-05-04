package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.log.AdventureLog;
import com.exasky.dnd.adventure.model.log.AdventureLogType;
import com.exasky.dnd.adventure.repository.AdventureLogRepository;
import com.exasky.dnd.adventure.repository.AdventureRepository;
import com.exasky.dnd.adventure.repository.CharacterItemRepository;
import com.exasky.dnd.adventure.repository.CharacterRepository;
import com.exasky.dnd.adventure.rest.dto.dice.OpenAttackDiceDto;
import com.exasky.dnd.adventure.rest.dto.trade.ValidateTradeDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Objects;

@Service
public class AdventureLogService {
    private final AdventureRepository adventureRepository;
    private final CharacterRepository characterRepository;
    private final CharacterItemRepository characterItemRepository;
    private final AdventureLogRepository adventureLogRepository;

    public AdventureLogService(AdventureRepository adventureRepository,
                               CharacterRepository characterRepository,
                               CharacterItemRepository characterItemRepository,
                               AdventureLogRepository adventureLogRepository) {
        this.adventureRepository = adventureRepository;
        this.characterRepository = characterRepository;
        this.characterItemRepository = characterItemRepository;
        this.adventureLogRepository = adventureLogRepository;
    }

    @Transactional
    public AdventureLog logAttack(Long adventureId, OpenAttackDiceDto dto) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.ATTACK);

        if (dto.getIsMonsterAttack()) {
            adventure.getMonsters().stream()
                    .filter(monsterLayer -> monsterLayer.getId().equals(dto.getFromAttackId())).findFirst()
                    .ifPresent(monsterLayerItem -> adventureLog.setFrom(monsterLayerItem.getMonster().getMonsterElement().getName()));
        } else {
            adventure.getCharacters().stream()
                    .filter(characterLayer -> characterLayer.getCharacter().getId().equals(dto.getFromAttackId())).findFirst()
                    .ifPresent(characterLayerItem -> {
                        adventureLog.setFrom(characterLayerItem.getCharacter().getDisplayName());
                        characterLayerItem.getCharacter().getEquipments().stream()
                                .filter(equipment -> equipment.getId().equals(dto.getFromAttackWeaponId()))
                                .findFirst().ifPresent(attackWeapon -> adventureLog.setFromId(attackWeapon.getName()));
                    });
        }

        if (dto.getIsMonsterAttacked()) {
            adventure.getMonsters().stream()
                    .filter(monsterLayer -> monsterLayer.getId().equals(dto.getToAttackId())).findFirst()
                    .ifPresent(monsterLayerItem -> adventureLog.setTo(monsterLayerItem.getMonster().getMonsterElement().getName()));
        } else {
            adventure.getCharacters().stream()
                    .filter(characterLayer -> characterLayer.getId().equals(dto.getToAttackId())).findFirst()
                    .ifPresent(characterLayerItem -> adventureLog.setTo(characterLayerItem.getCharacter().getDisplayName()));
        }

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }

    @Transactional
    public AdventureLog logDeath(Long adventureId, String name) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.DIE);

        adventureLog.setFrom(name);

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }

    @Transactional
    public AdventureLog logTrade(Long adventureId, ValidateTradeDto dto) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.TRADE);

        if (Objects.nonNull(dto.getFromCharacterId()))
            characterRepository.findById(dto.getFromCharacterId()).ifPresent(character -> adventureLog.setFrom(character.getDisplayName()));
        if (Objects.nonNull(dto.getFromCharacterEquipment()))
            characterItemRepository.findById(dto.getFromCharacterEquipment()).ifPresent(characterItem -> adventureLog.setFromId(characterItem.getName()));
        if (Objects.nonNull(dto.getToCharacterId()))
            characterRepository.findById(dto.getToCharacterId()).ifPresent(character -> adventureLog.setTo(character.getDisplayName()));
        if (Objects.nonNull(dto.getToCharacterEquipment()))
            characterItemRepository.findById(dto.getToCharacterEquipment()).ifPresent(characterItem -> adventureLog.setToId(characterItem.getName()));

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }

    @Transactional
    public AdventureLog logSwitch(Long adventureId, String fromName, Long fromItemId, Long toItemId) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.SWITCH);
        adventureLog.setFrom(fromName);
        if (Objects.nonNull(fromItemId))
            characterItemRepository.findById(fromItemId).ifPresent(characterItem -> adventureLog.setFromId(characterItem.getName()));
        if (Objects.nonNull(toItemId))
            characterItemRepository.findById(toItemId).ifPresent(characterItem -> adventureLog.setToId(characterItem.getName()));

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }

    @Transactional
    public AdventureLog logOpenChest(Long adventureId, Long characterId, String characterItem) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.OPEN_CHEST);
        adventureLog.setFrom(characterRepository.getOne(characterId).getDisplayName());
        adventureLog.setFromId(characterItem);

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }

    @Transactional
    public AdventureLog logTrapChest(Long adventureId, Long characterId, String trapItem) {
        Adventure adventure = adventureRepository.getOne(adventureId);

        AdventureLog adventureLog = new AdventureLog(adventure, AdventureLogType.OPEN_CHEST);
        adventureLog.setFrom(characterRepository.getOne(characterId).getDisplayName());
        adventureLog.setTo(trapItem);

        adventure.getLogs().add(adventureLog);

        return adventureLogRepository.save(adventureLog);
    }
}
