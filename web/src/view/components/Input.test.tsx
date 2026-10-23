import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
  it("should associate the label with the input field via default id (name)", () => {
    render(<Input name="email" placeholder="E-mail" />);

    const input = screen.getByLabelText("E-mail");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
  });

  it("should associate the label with the input field when a custom id is provided", () => {
    render(<Input name="email" id="custom-email-id" placeholder="E-mail" />);

    const input = screen.getByLabelText("E-mail");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "custom-email-id");
  });

  it("should render error message and error styles when error prop is provided", () => {
    render(
      <Input
        name="email"
        placeholder="E-mail"
        error="O e-mail é obrigatório"
      />
    );

    const errorMessage = screen.getByText("O e-mail é obrigatório");
    expect(errorMessage).toBeInTheDocument();

    const input = screen.getByLabelText("E-mail");
    expect(input.className).toContain("border-red-900");
  });

  it("should not render error message when error prop is omitted", () => {
    render(<Input name="email" placeholder="E-mail" />);

    expect(screen.queryByText("O e-mail é obrigatório")).not.toBeInTheDocument();
    const input = screen.getByLabelText("E-mail");
    expect(input.className).not.toContain("border-red-900");
  });

  it("should allow user to type into the input", () => {
    render(<Input name="email" placeholder="E-mail" />);

    const input = screen.getByLabelText("E-mail") as HTMLInputElement;
    expect(input.value).toBe("");

    return userEvent.type(input, "usuario@fincheck.com").then(() => {
      expect(input.value).toBe("usuario@fincheck.com");
    });
  });

  it("should correctly forward ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} name="email" placeholder="E-mail" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.id).toBe("email");
  });
});
