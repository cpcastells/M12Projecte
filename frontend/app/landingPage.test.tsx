import { render, screen } from "@testing-library/react";
import Home from "./page";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Donada la pàgina principal", () => {
  describe("Quan un usuari hi entra", () => {
    test("Ha de veure el títol 'ABYSS'", () => {
      render(
        <QueryProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </QueryProvider>,
      );
      const title = screen.getByRole("heading", { name: /ABYSS/i });
      expect(title).toBeInTheDocument();
    });
  });
});
