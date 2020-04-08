package com.exasky.dnd.adventure.rest.dto;

import com.exasky.dnd.adventure.model.Board;
import com.exasky.dnd.adventure.model.ImageRotation;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

public class BoardDto {
    private Long id;
    private Integer boardNumber;
    private Integer rotation;

    public static List<Board> toBo(BoardDto[][] dto) {
        List<Board> bos = new ArrayList<>();
        for (int row = 0; row < dto.length; row++) {
            for (int col = 0; col < dto[row].length; col++) {
                BoardDto board = dto[row][col];
                if (Objects.nonNull(board)) {
                    bos.add(toBo(board, row, col));
                }
            }
        }
        return bos;
    }

    private static Board toBo(BoardDto dto, int row, int col) {
        Board board = new Board(dto.id);

        board.setPositionX(col);
        board.setPositionY(row);
        board.setBoardNumber(dto.boardNumber);
        board.setRotation(ImageRotation.getImageRotationFromCode(dto.rotation));

        return board;
    }

    public static BoardDto[][] toDto(List<Board> bos) {
        @SuppressWarnings("OptionalGetWithoutIsPresent")
        Integer maxCol = bos.stream().map(Board::getPositionX).max(Comparator.comparingInt(o -> o)).get();
        @SuppressWarnings("OptionalGetWithoutIsPresent")
        Integer maxRow = bos.stream().map(Board::getPositionY).max(Comparator.comparingInt(o -> o)).get();

        BoardDto[][] dtos = new BoardDto[maxRow + 1][maxCol + 1];
        bos.forEach(bo -> {
            Integer row = bo.getPositionY();
            Integer col = bo.getPositionX();
            dtos[row][col] = toDto(bo);
        });
        return dtos;
    }

    private static BoardDto toDto(Board bo) {
        BoardDto dto = new BoardDto();

        dto.setId(bo.getId());
        dto.setBoardNumber(bo.getBoardNumber());
        dto.setRotation(bo.getRotation().getRotationDegree());

        return dto;
    }

    // region getters setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBoardNumber() {
        return boardNumber;
    }

    public void setBoardNumber(Integer boardNumber) {
        this.boardNumber = boardNumber;
    }

    public Integer getRotation() {
        return rotation;
    }

    public void setRotation(Integer rotation) {
        this.rotation = rotation;
    }
    // endregion
}
