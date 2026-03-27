import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormButton from "./FormButton";

describe("Donat el component FormButton", () => {
  describe("Quan es renderitza amb text", () => {
    test("Ha de mostrar el text del botó", () => {
      render(<FormButton>Entrar</FormButton>);
      const button = screen.getByRole("button", { name: "Entrar" });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Quan es renderitza sense especificar type", () => {
    test("Ha de tenir type='submit' per defecte", () => {
      render(<FormButton>Enviar</FormButton>);
      const button = screen.getByRole("button", { name: "Enviar" });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Quan l'usuari fa clic", () => {
    test("Ha de cridar l'onClick handler", async () => {
      const handleClick = vi.fn();
      render(<FormButton onClick={handleClick}>Clic</FormButton>);

      await userEvent.click(screen.getByRole("button", { name: "Clic" }));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Quan el botó està deshabilitat", () => {
    test("No ha de cridar onClick", async () => {
      const handleClick = vi.fn();
      render(
        <FormButton onClick={handleClick} disabled>
          Deshabilitat
        </FormButton>,
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Deshabilitat" }),
      );
      expect(handleClick).not.toHaveBeenCalled();
    });

    test("Ha de tenir la classe opacity-40", () => {
      render(<FormButton disabled>Deshabilitat</FormButton>);
      const button = screen.getByRole("button", { name: "Deshabilitat" });
      expect(button).toHaveClass("opacity-40");
      expect(button).toHaveClass("cursor-not-allowed");
    });
  });
});
