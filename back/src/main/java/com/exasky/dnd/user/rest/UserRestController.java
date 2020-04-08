package com.exasky.dnd.user.rest;

import com.exasky.dnd.common.Constant;
import com.exasky.dnd.user.rest.dto.DnDCreateUserDto;
import com.exasky.dnd.user.rest.dto.DnDUserDto;
import com.exasky.dnd.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.REST_UTL + "/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<DnDUserDto> getAll() {
        return DnDUserDto.toDto(this.userService.getAll());
    }

    @PostMapping
    public DnDUserDto create(@RequestBody DnDCreateUserDto dto) {
        return DnDUserDto.toDto(this.userService.create(DnDCreateUserDto.toBo(dto)));
    }

    @PutMapping("/{id}")
    public DnDUserDto update(@PathVariable Long id, @RequestBody DnDUserDto dto) {
        return DnDUserDto.toDto(this.userService.update(id, DnDUserDto.toBo(dto)));
    }
}
