import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AppNavbar from "../navbar";

//Helper to render with Router (Navbar uses useLocation)
const renderWithRouter = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppNavbar />
    </MemoryRouter>,
  );
};

describe("AppNavbar", () => {
  it("renders all navigation links", () => {
    renderWithRouter();

    //ACT: Query for elements
    const homeLink = screen.getByRole("link", { name: /inicio/i });
    const rsvpLink = screen.getByRole("link", { name: /album/i });
    const galleryLink = screen.getByRole("link", {
      name: /confirma asistencia/i,
    });

    //ASSERT: Verify they exist
    expect(homeLink).toBeInTheDocument();
    expect(rsvpLink).toBeInTheDocument();
    expect(galleryLink).toBeInTheDocument();
  });

  it("highlights active link based on current route", () => {
    renderWithRouter("/rsvp");

    const rsvpLink = screen.getByRole("link", {
      name: /confirma asistencia/i,
    });

    expect(rsvpLink).toHaveAttribute("href", "/rsvp");
  });
});
