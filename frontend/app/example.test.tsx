import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Donada una pàgina d'exemple", () => {
  describe("Quan un usuari hi entra", () => {
    test("Ha de veure un títol 'To get started, edit the page.tsx file.'", () => {
      const nomTítol = "To get started, edit the page.tsx file.";

      render(<Home />);
      const title = screen.getByRole("heading", { name: nomTítol });

      expect(title).toBeInTheDocument();
    });
  });
});
