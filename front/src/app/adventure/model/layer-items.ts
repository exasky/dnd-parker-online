import {ImageRotation, LayerElement, LayerElementType} from "./adventure";

export const CHEST: LayerElement = {
  type: LayerElementType.CHEST,
  rotation: ImageRotation.NONE,
  icon: 'chest.png',
  rowSize: 1,
  colSize: 1
};

export const VERTICAL_DOOR_VERTICAL_OPENED: LayerElement = {
  type: LayerElementType.VERTICAL_DOOR_VERTICAL_OPENED,
  icon: 'vertical-door-vertical-opened.jpg',
  rowSize: 2,
  colSize: 1
}

export const VERTICAL_DOOR_VERTICAL_CLOSED: LayerElement = {
  type: LayerElementType.VERTICAL_DOOR_VERTICAL_CLOSED,
  icon: 'vertical-door-vertical-closed.jpg',
  rowSize: 2,
  colSize: 1
}

export const VERTICAL_DOOR_HORIZONTAL_OPENED: LayerElement = {
  type: LayerElementType.VERTICAL_DOOR_HORIZONTAL_OPENED,
  icon: 'vertical-door-opened.jpg',
  rowSize: 1,
  colSize: 2
}

export const VERTICAL_DOOR_HORIZONTAL_CLOSED: LayerElement = {
  type: LayerElementType.VERTICAL_DOOR_HORIZONTAL_CLOSED,
  icon: 'vertical-door-closed.jpg',
  rowSize: 1,
  colSize: 2
}
