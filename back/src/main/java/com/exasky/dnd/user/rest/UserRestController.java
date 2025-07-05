package com.exasky.dnd.user.rest;

import com.exasky.dnd.common.Constant;
import com.exasky.dnd.user.rest.dto.DnDCreateUserDto;
import com.exasky.dnd.user.rest.dto.DnDUserDto;
import com.exasky.dnd.user.rest.dto.DnDUserUpdatePasswordDto;
import com.exasky.dnd.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping(Constant.REST_URL + "/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<DnDUserDto> getAll() {
        return DnDUserDto.toDto(this.userService.getAll());
    }

    @GetMapping("/{id}")
    public DnDUserDto getById(@PathVariable Long id) {
        return DnDUserDto.toDto(this.userService.getById(id));
    }

    @PostMapping
    public DnDUserDto create(@Valid @RequestBody DnDCreateUserDto dto) {
        return DnDUserDto.toDto(this.userService.create(DnDCreateUserDto.toBo(dto)));
    }

    @PutMapping("/{id}")
    public DnDUserDto update(@PathVariable Long id, @Valid @RequestBody DnDUserDto dto) {
        return DnDUserDto.toDto(this.userService.update(id, DnDUserDto.toBo(dto)));
    }

    @PutMapping("/update-password/{id}")
    public DnDUserDto updatePassword(@PathVariable Long id, @RequestBody DnDUserUpdatePasswordDto dto) {
        return DnDUserDto.toDto(this.userService.updatePassword(id, DnDUserUpdatePasswordDto.toBo(dto)));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        this.userService.delete(id);
    }
}
