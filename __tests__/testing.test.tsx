import TestPage from "../src/app/test/page";
import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Calculator", () => {
  it("renders a calculator", () => {
    render(<TestPage />);
    // check if all components are rendered
    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });
});