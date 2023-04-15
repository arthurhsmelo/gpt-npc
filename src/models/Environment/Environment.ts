import cloneDeep from "lodash.clonedeep";

interface ILayoutPosition {
  content: IElement | null;
}

export type Layout = ILayoutPosition[][];
export type Position = readonly [number, number];
export interface IElementPosition {
  readonly id: string;
  position: Position;
}
export interface IElement {
  readonly id: string;
  readonly initial_position: Position;
  interact: () => void; // TODO
}
enum ESides {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left",
}

export type ISurroundings = {
  [key in ESides]: IElement | null;
};
export class Environment {
  constructor(layout: Layout, elements: IElement[]) {
    this.#layout = cloneDeep(layout);
    this.#elements = [...elements];
    this.#elements_positions = this.validate_initial_positions(elements);
  }

  #layout: Layout = [];
  #elements: IElement[] = [];
  #elements_positions: IElementPosition[] = [];

  public get_element_position(element_id: string) {
    const { position } = this.find_element_position(element_id);
    return position;
  }
  public move_element(element_id: string, new_position: Position) {
    const element_position = this.find_element_position(element_id);
    if (this.check_position_is_free(new_position)) {
      const old_position = element_position.position;
      element_position.position = new_position;

      this.#layout[old_position[0]][old_position[1]] = { content: null };
      this.#layout[new_position[0]][new_position[1]] = {
        content: this.get_element(element_id),
      };
    } else {
      throw new Error("Position is not free");
    }
  }
  public add_element(
    element: IElement,
    position: Position = element.initial_position
  ) {
    if (this.check_position_is_free(position)) {
      this.#elements.push(element);
      this.#layout[position[0]][position[1]] = { content: element };
    }
  }
  public get_surroundings(element_id: string): ISurroundings {
    const {
      position: [row, col],
    } = this.find_element_position(element_id);

    return Object.entries({
      top: [-1, 0],
      right: [0, 1],
      bottom: [1, 0],
      left: [0, -1],
    }).reduce(
      (acc, [side, [rowIncrement, colIncrement]]) => {
        const neighboor_row = row + rowIncrement;
        const neighboor_col = col + colIncrement;
        const neighboor =
          this.#layout[neighboor_row]?.[neighboor_col]?.content || null;
        return {
          ...acc,
          [side]: neighboor,
        };
      },
      { top: null, right: null, bottom: null, left: null }
    );
  }

  private find_element_position(element_id: string) {
    const element_position = this.#elements_positions.find(
      ({ id }) => id === element_id
    );
    if (!element_position) {
      throw new Error("Element not found");
    }
    return element_position;
  }
  private check_position_is_free(position: Position) {
    return this.#layout[position[0]]?.[position[1]].content === null;
  }
  private get_element(element_id: string) {
    const element = this.#elements.find((el) => el.id === element_id);
    if (!element) {
      throw new Error("Element not found");
    }
    return element;
  }
  private validate_initial_positions(elements: IElement[]) {
    return elements.map((element) => {
      if (!this.check_position_is_free(element.initial_position)) {
        throw new Error(`Initial position of ${element.id} is not free`);
      }
      if (!this.get_element(element.id)) {
        throw new Error(`Element not found: ${element.id}`);
      }

      this.#layout[element.initial_position[0]][element.initial_position[1]] = {
        content: element,
      };
      return {
        id: element.id,
        position: element.initial_position,
      };
    });
  }
}
