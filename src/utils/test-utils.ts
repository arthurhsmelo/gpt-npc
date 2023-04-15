import { IElement, Layout } from "../models/Environment/Environment.js";

export const default_layout: Layout = [
  [{ content: null }, { content: null }, { content: null }, { content: null }],
  [{ content: null }, { content: null }, { content: null }, { content: null }],
  [{ content: null }, { content: null }, { content: null }, { content: null }],
  [{ content: null }, { content: null }, { content: null }, { content: null }],
];

const door: IElement = {
  id: "door",
  initial_position: [0, 0],
  interact: () => {
    console.log("Open/Close door");
  },
};
export const default_elements: IElement[] = [door];
