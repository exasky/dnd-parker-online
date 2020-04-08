package com.exasky.dnd.adventure.service;

import com.exasky.dnd.adventure.model.Adventure;
import com.exasky.dnd.adventure.model.Board;
import com.exasky.dnd.adventure.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> createOrUpdate(Adventure attachedAdventure, List<Board> boards) {
        return boards.stream()
                .map(board ->
                        Objects.isNull(board.getId())
                                ? create(attachedAdventure, board)
                                : update(board)
                )
                .collect(Collectors.toList());
    }

    private Board create(Adventure attachedAdventure, Board toCreate) {
        Board toSave = new Board();

        toSave.setAdventure(attachedAdventure);
        toSave.setRotation(toCreate.getRotation());
        toSave.setPositionX(toCreate.getPositionX());
        toSave.setPositionY(toCreate.getPositionY());
        toSave.setBoardNumber(toCreate.getBoardNumber());

        return boardRepository.save(toSave);
    }

    private Board update(Board toUpdate) {
        Board attachedToUpdate = boardRepository.getOne(toUpdate.getId());

        attachedToUpdate.setRotation(toUpdate.getRotation());
        attachedToUpdate.setPositionX(toUpdate.getPositionX());
        attachedToUpdate.setPositionY(toUpdate.getPositionY());
        attachedToUpdate.setBoardNumber(toUpdate.getBoardNumber());

        return boardRepository.save(attachedToUpdate);
    }
}
