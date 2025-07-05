package com.exasky.dnd.user.service;

import com.exasky.dnd.adventure.service.CharacterService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.common.exception.ValidationCheckException;
import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    public DnDUser getById(Long id) {
        return userRepository.getReferenceById(id);
    }

    @Transactional
    public DnDUser create(DnDUser toCreate) {
        DnDUser attachedUser = loginService.register(toCreate.getUsername(), toCreate.getPassword());

        attachedUser.setRole(toCreate.getRole());
        attachedUser.updateCharacters(toCreate.getCharacters().stream()
                .map(character -> characterService.findById(character.getId()))
                .collect(Collectors.toList()));
        attachedUser.getCharacters().forEach(character -> character.setUser(attachedUser));

        return attachedUser;
    }

    @Transactional
    public DnDUser update(Long id, DnDUser toUpdate) {
        try {
            DnDUser attachedUser = userRepository.getReferenceById(id);

            attachedUser.getCharacters().forEach(prevCharacter -> prevCharacter.setUser(null));

            attachedUser.setUsername(toUpdate.getUsername());
            attachedUser.setRole(toUpdate.getRole());
            attachedUser.updateCharacters(toUpdate.getCharacters().stream()
                    .map(character -> characterService.findById(character.getId()))
                    .collect(Collectors.toList()));
            attachedUser.getCharacters().forEach(character -> character.setUser(attachedUser));

            return attachedUser;
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }
    }

    @Transactional
    public DnDUser updatePassword(Long id, DnDUser toUpdate) {
        try {
            DnDUser attachedUser = userRepository.getReferenceById(id);

            attachedUser.setPassword(loginService.encorePassword(toUpdate.getPassword()));

            return attachedUser;
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
            return null; // This line is unreachable but added to satisfy the compiler
        }
    }

    @Transactional
    public void delete(Long id) {
        try {
            DnDUser attachedUser = userRepository.getReferenceById(id);

            attachedUser.getCharacters().forEach(prevCharacter -> prevCharacter.setUser(null));

            userRepository.delete(attachedUser);
        } catch (EntityNotFoundException e) {
            ValidationCheckException.throwError(HttpStatus.NOT_FOUND, Constant.Errors.USER.NOT_FOUND);
            return; // This line is unreachable but added to satisfy the compiler
        }
    }
}
