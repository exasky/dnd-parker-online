package com.exasky.dnd.user.rest;

import com.exasky.dnd.common.Constant;
import com.exasky.dnd.security.MyUserDetailsService;
import com.exasky.dnd.security.jwt.JwtTokenUtil;
import com.exasky.dnd.user.model.DnDUser;
import com.exasky.dnd.user.rest.dto.JwtDto;
import com.exasky.dnd.user.rest.dto.LoginDto;
import com.exasky.dnd.user.service.LoginService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constant.REST_UTL)
public class LoginRestController {

    private final LoginService loginService;

    private final MyUserDetailsService userDetailsService;

    private final AuthenticationManager authenticationManager;

    private final JwtTokenUtil jwtTokenUtil;

    public LoginRestController(LoginService loginService,
                               MyUserDetailsService userDetailsService,
                               AuthenticationManager authenticationManager,
                               JwtTokenUtil jwtTokenUtil) {
        this.loginService = loginService;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/login")
    public JwtDto login(@RequestBody LoginDto dto) throws Exception {
        authenticate(dto.getUsername(), dto.getPassword());
        final DnDUser userDetails = userDetailsService.loadUserByUsername(dto.getUsername());

        return new JwtDto(jwtTokenUtil.generateToken(userDetails));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping("/register")
    public void register(@RequestBody LoginDto dto) {
        this.loginService.register(dto.getUsername(), dto.getPassword());
    }
}
