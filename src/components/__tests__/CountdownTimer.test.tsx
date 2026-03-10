import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CountdownTimer } from "../CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays countdown to future date", () => {
    const futureDate = new Date("2026-06-15T00:00:00Z");

    render(<CountdownTimer targetDate={futureDate} />);

    // Check initial render
    expect(screen.getByText(/days/i)).toBeInTheDocument();
    expect(screen.getByText(/hours/i)).toBeInTheDocument();
    expect(screen.getByText(/minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/seconds/i)).toBeInTheDocument();

    // Get initial seconds value (should be 00)
    const timeUnits = screen.getAllByText(/\d{2}/);
    expect(timeUnits.length).toBeGreaterThan(0);

    // Advance time by 1 second and run all timers
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // After 1 second, seconds should have changed
    // The countdown should show approximately 5 months, 14 days remaining
    expect(screen.getByText("05")).toBeInTheDocument(); // months
  });

  it("updates countdown every second", () => {
    const futureDate = new Date("2026-01-01T00:01:05Z"); // 1 minute 5 seconds in future

    render(<CountdownTimer targetDate={futureDate} />);

    // Helper to get seconds value specifically
    const getSecondsValue = () => {
      const secondsLabel = screen.getByText("Seconds");
      const secondsContainer = secondsLabel.parentElement;
      const secondsValue = secondsContainer?.querySelector(".text-7xl");
      return secondsValue?.textContent;
    };

    // Initially should show 5 seconds
    expect(getSecondsValue()).toBe("05");

    // Advance by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getSecondsValue()).toBe("04");

    // Advance by another second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getSecondsValue()).toBe("03");

    // Advance by 3 more seconds to get to exactly 1 minute
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(getSecondsValue()).toBe("00");
  });
});
