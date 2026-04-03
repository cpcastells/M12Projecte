import { render, screen } from "@testing-library/react";
import Home from "./page";
import { AuthProvider } from "@/context/AuthContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Donada la pàgina principal", () => {
  describe("Quan un usuari hi entra", () => {
    test("Ha de veure el títol 'ABYSS'", () => {
      render(
        <AuthProvider>
          <Home />
        </AuthProvider>,
      );
      const title = screen.getByRole("heading", { name: /ABYSS/i });
      expect(title).toBeInTheDocument();
    });
  });
});
