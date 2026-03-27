import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthFormCard from "./AuthFormCard";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const defaultProps = {
  title: "Inicia Sessió",
  switchPrompt: "No tens compte?",
  switchLink: "Registra't",
  switchHref: "/register",
};

describe("Donat el component AuthFormCard", () => {
  describe("Quan es renderitza amb les props per defecte", () => {
    test("Ha de mostrar el títol", () => {
      render(
        <AuthFormCard {...defaultProps}>
          <input />
        </AuthFormCard>,
      );
      const heading = screen.getByRole("heading", { name: "Inicia Sessió" });
      expect(heading).toBeInTheDocument();
    });

    test("Ha de mostrar el text de canvi de pàgina", () => {
      render(
        <AuthFormCard {...defaultProps}>
          <input />
        </AuthFormCard>,
      );
      expect(screen.getByText("No tens compte?")).toBeInTheDocument();
    });

    test("Ha de mostrar el link amb l'href correcte", () => {
      render(
        <AuthFormCard {...defaultProps}>
          <input />
        </AuthFormCard>,
      );
      const link = screen.getByRole("link", { name: "Registra't" });
      expect(link).toHaveAttribute("href", "/register");
    });
  });

  describe("Quan es renderitza amb children", () => {
    test("Ha de mostrar el contingut fill dins el formulari", () => {
      render(
        <AuthFormCard {...defaultProps}>
          <input placeholder="Correu" />
        </AuthFormCard>,
      );
      expect(screen.getByPlaceholderText("Correu")).toBeInTheDocument();
    });
  });

  describe("Quan l'usuari envia el formulari", () => {
    test("Ha de cridar onSubmit", async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <AuthFormCard {...defaultProps} onSubmit={handleSubmit}>
          <button type="submit">Enviar</button>
        </AuthFormCard>,
      );

      await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
