package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Dice;
import com.exasky.dnd.adventure.repository.DiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiceService {
    private final DiceRepository diceRepository;

    public DiceService(DiceRepository diceRepository) {
        this.diceRepository = diceRepository;
    }

    public List<Dice> getAllDices() {
        return this.diceRepository.findAll();
    }
}
