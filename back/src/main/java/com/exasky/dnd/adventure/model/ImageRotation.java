package com.exasky.dnd.adventure.model;

public enum ImageRotation {
    NONE(0), RIGHT(90), LEFT(-90), DOWN(180);

    private int rotationDegree;

    ImageRotation(int rotationDegree) {
        this.rotationDegree = rotationDegree;
    }

    public int getRotationDegree() {
        return rotationDegree;
    }

    public static ImageRotation getImageRotationFromCode(int rotationDegree) {
        for (ImageRotation e : ImageRotation.values()) {
            if (rotationDegree == e.rotationDegree) return e;
        }
        throw new IllegalArgumentException("Cannot find ImageRotation for value: " + rotationDegree);
    }
}
