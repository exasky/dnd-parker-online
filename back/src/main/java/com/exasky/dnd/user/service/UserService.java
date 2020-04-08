package com.exasky.dnd.user.service;

import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final LoginService loginService;
    private final CharacterService characterService;

    public UserService(UserRepository userRepository,
                       LoginService loginService,
                       CharacterService characterService) {
        this.userRepository = userRepository;
        this.loginService = loginService;
        this.characterService = characterService;
    }

    public List<DnDUser> getAll() {
        return userRepository.findAll();
    }

    @Transactional
    public DnDUser create(DnDUser toCreate) {
        DnDUser attachedUser = loginService.register(toCreate.getUsername(), toCreate.getPassword());

        attachedUser.setRole(toCreate.getRole());
        attachedUser.updateCharacters(toCreate.getCharacters().stream()
                .map(character -> characterService.findById(character.getId()))
                .collect(Collectors.toList())
        );
        attachedUser.getCharacters().forEach(character -> character.setUser(attachedUser));

        return attachedUser;
    }

    @Transactional
    public DnDUser update(Long id, DnDUser toUpdate) {
        DnDUser attachedUser = userRepository.getOne(id);

        attachedUser.getCharacters().forEach(prevCharacter -> prevCharacter.setUser(null));

        attachedUser.setUsername(toUpdate.getUsername());
        attachedUser.setRole(toUpdate.getRole());
        attachedUser.updateCharacters(toUpdate.getCharacters().stream()
                .map(character -> characterService.findById(character.getId()))
                .collect(Collectors.toList())
        );
        attachedUser.getCharacters().forEach(character -> character.setUser(attachedUser));

        return attachedUser;
    }

    @Transactional
    public void delete(Long id) {
        DnDUser attachedUser = userRepository.getOne(id);

        attachedUser.getCharacters().forEach(prevCharacter -> prevCharacter.setUser(null));

        userRepository.delete(attachedUser);
    }
}
