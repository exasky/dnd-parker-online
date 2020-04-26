package com.exasky.dnd.adventure.rest;


import com.exasky.dnd.adventure.rest.dto.SimpleUserDto;
import com.exasky.dnd.adventure.rest.dto.dice.DiceMessageDto;
import com.exasky.dnd.adventure.rest.dto.dice.OpenAttackDiceDto;
import com.exasky.dnd.adventure.rest.dto.dice.SelectDicesDto;
import com.exasky.dnd.adventure.service.DiceService;
import com.exasky.dnd.common.Constant;
import com.exasky.dnd.gameMaster.rest.dto.DiceDto;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import static com.exasky.dnd.common.Utils.getCurrentUser;

@RestController
@RequestMapping(Constant.REST_URL + "/dice")
public class DiceRestController {

    private final DiceService diceService;
    private final SimpMessageSendingOperations messagingTemplate;

    public DiceRestController(DiceService diceService,
                              SimpMessageSendingOperations messagingTemplate) {
        this.diceService = diceService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<DiceDto> getAllDices() {
        return DiceDto.toDto(this.diceService.getAllDices());
    }

    @GetMapping("/open/{adventureId}")
    public void openDiceRoller(@PathVariable Long adventureId) {
        DiceMessageDto dto = new DiceMessageDto();
        dto.setType(DiceMessageDto.DiceMessageType.OPEN_DIALOG);
        dto.setMessage(SimpleUserDto.toDto(getCurrentUser()));

        this.messagingTemplate.convertAndSend("/topic/dice/" + adventureId, dto);
    }

    @PostMapping("/attack/{adventureId}")
    public void openAttackDiceRoller(@PathVariable Long adventureId, @RequestBody OpenAttackDiceDto dto) {
        dto.setUser(SimpleUserDto.toDto(getCurrentUser()));

        DiceMessageDto wsDto = new DiceMessageDto();
        wsDto.setType(DiceMessageDto.DiceMessageType.OPEN_ATTACK_DIALOG);
        wsDto.setMessage(dto);

        this.messagingTemplate.convertAndSend("/topic/dice/" + adventureId, wsDto);
    }

    @PostMapping("/select-dices/{adventureId}")
    public void selectDices(@PathVariable Long adventureId, @RequestBody SelectDicesDto dto) {
        DiceMessageDto responseDto = new DiceMessageDto();
        responseDto.setType(DiceMessageDto.DiceMessageType.SELECT_DICES);
        responseDto.setMessage(dto.getIds());

        this.messagingTemplate.convertAndSend("/topic/dice/" + adventureId, responseDto);
    }

    @PostMapping("/roll-dices/{adventureId}")
    public void rollDices(@PathVariable Long adventureId, @RequestBody SelectDicesDto dto) {
        DiceMessageDto responseDto = new DiceMessageDto();
        responseDto.setType(DiceMessageDto.DiceMessageType.ROLL_RESULT);

        Random r = new Random();
        responseDto.setMessage(
                dto.getIds().stream().map(id -> r.nextInt(6) + 1).collect(Collectors.toList())
        );

        this.messagingTemplate.convertAndSend("/topic/dice/" + adventureId, responseDto);
    }

    @GetMapping("/close/{adventureId}")
    public void closeDialog(@PathVariable Long adventureId) {
        DiceMessageDto responseDto = new DiceMessageDto();
        responseDto.setType(DiceMessageDto.DiceMessageType.CLOSE_DIALOG);
        this.messagingTemplate.convertAndSend("/topic/dice/" + adventureId, responseDto);
    }
}
