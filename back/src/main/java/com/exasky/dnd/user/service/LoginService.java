package com.exasky.dnd.user.service;

import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.model.UserRole;
import com.exasky.dnd.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public LoginService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public DnDUser register(String username, String password) {
        DnDUser s = new DnDUser();

        s.setUsername(username);
        s.setRole(UserRole.ROLE_GM);
        s.setPassword(passwordEncoder.encode(password));

        return this.userRepository.save(s);
    }
}
