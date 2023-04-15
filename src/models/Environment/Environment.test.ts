import { default_elements, default_layout } from "../../utils/test-utils.js";
import { Environment, IElement, Layout, Position } from "./Environment.js";

describe("Environment", () => {
  const agent_id = "test-agent";
  const initial_position: Position = [1, 2];
  let env: Environment;

  beforeEach(() => {
    const agents: IElement[] = [
      {
        id: agent_id,
        initial_position,
        interact: () => {
          console.log(`Talk to ${agent_id}`);
        },
      },
    ];
    const layout: Layout = default_layout;
    env = new Environment(layout, [...default_elements, ...agents]);
  });

  test("Initialize correctly", () => {
    const position = env.get_element_position(agent_id);
    expect(position).toStrictEqual(initial_position);
  });

  test("Move agent", () => {
    const new_position: Position = [3, 2];
    env.move_element(agent_id, new_position);

    const position = env.get_element_position(agent_id);
    expect(position).toStrictEqual(new_position);
  });

  test("Return surroundings", () => {
    const interact = jest.fn();
    const portal: IElement = {
      id: "portal",
      initial_position: [initial_position[0] + 1, initial_position[1]],
      interact,
    };
    env.add_element(portal);
    const surroundings = env.get_surroundings(agent_id);
    expect(surroundings.bottom?.id).toBe(portal.id);
  });
});
