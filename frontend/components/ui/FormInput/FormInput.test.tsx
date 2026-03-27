import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "./FormInput";

describe("Donat el component FormInput", () => {
  describe("Quan es renderitza amb un placeholder", () => {
    test("Ha de mostrar l'input amb el placeholder", () => {
      render(<FormInput placeholder="Correu electrònic" />);
      const input = screen.getByPlaceholderText("Correu electrònic");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Quan l'usuari escriu text", () => {
    test("Ha de cridar onChange amb el valor introduït", async () => {
      const handleChange = vi.fn();
      render(<FormInput placeholder="Correu" onChange={handleChange} />);

      const input = screen.getByPlaceholderText("Correu");
      await userEvent.type(input, "test@example.com");

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue("test@example.com");
    });
  });

  describe("Quan es passa un type", () => {
    test("Ha de renderitzar l'input amb el type correcte", () => {
      render(<FormInput type="password" placeholder="Contrasenya" />);
      const input = screen.getByPlaceholderText("Contrasenya");
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("Quan es passa una className addicional", () => {
    test("Ha de combinar-la amb les classes per defecte", () => {
      render(<FormInput placeholder="Test" className="extra-class" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveClass("extra-class");
      expect(input).toHaveClass("rounded-lg");
    });
  });

  describe("Quan es passa un error", () => {
    test("Ha de mostrar el missatge d'error", () => {
      render(
        <FormInput placeholder="Correu" error="El correu és obligatori" />,
      );
      expect(screen.getByText("El correu és obligatori")).toBeInTheDocument();
    });

    test("Ha de marcar l'input com a aria-invalid", () => {
      render(<FormInput placeholder="Correu" error="Error" />);
      const input = screen.getByPlaceholderText("Correu");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("Ha de vincular l'error amb aria-describedby", () => {
      render(<FormInput placeholder="Correu" error="Error" />);
      const input = screen.getByPlaceholderText("Correu");
      const errorElement = screen.getByText("Error");
      expect(input).toHaveAttribute("aria-describedby", errorElement.id);
    });
  });

  describe("Quan no hi ha error", () => {
    test("No ha de mostrar cap missatge d'error", () => {
      render(<FormInput placeholder="Correu" />);
      expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });

    test("No ha de tenir aria-invalid", () => {
      render(<FormInput placeholder="Correu" />);
      const input = screen.getByPlaceholderText("Correu");
      expect(input).toHaveAttribute("aria-invalid", "false");
    });
  });
});
