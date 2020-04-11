package com.exasky.dnd.user.service;

import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
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

    public DnDUser getById(Long id) {
        return userRepository.getOne(id);
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

        //noinspection ConstantConditions
        if (Objects.isNull(attachedUser)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
        }

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
    public DnDUser updatePassword(Long id, DnDUser toUpdate) {
        DnDUser attachedUser = userRepository.getOne(id);

        //noinspection ConstantConditions
        if (Objects.isNull(attachedUser)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
        }

        attachedUser.setPassword(loginService.encorePassword(toUpdate.getPassword()));

        return attachedUser;
    }

    @Transactional
    public void delete(Long id) {
        DnDUser attachedUser = userRepository.getOne(id);

        //noinspection ConstantConditions
        if (Objects.isNull(attachedUser)) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
        }

        attachedUser.getCharacters().forEach(prevCharacter -> prevCharacter.setUser(null));

        userRepository.delete(attachedUser);
    }
}
