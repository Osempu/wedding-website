import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "../../../components/comp-547";

describe("FileUpload", () => {
  it("shows upload button when files are selected", async () => {
    const user = userEvent.setup();
    const onFilesUploaded = vi.fn(); // Mock function

    render(<FileUpload onFilesUploaded={onFilesUploaded} />);

    // Initially no upload button (no files selected)
    expect(
      screen.queryByRole("button", { name: /upload/i }),
    ).not.toBeInTheDocument();

    // Create a fake image file
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/upload image file/i);

    // Simulate file selection
    await user.upload(input, file);

    // Upload button should appear
    expect(
      screen.getByRole("button", { name: /upload 1 image/i }),
    ).toBeInTheDocument();
  });
  it("disables upload button during upload", async () => {
    const user = userEvent.setup();
    const mockUpload = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<FileUpload onFilesUploaded={mockUpload} />);

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/upload image file/i);

    await user.upload(input, file);

    const uploadButton = screen.getByRole("button", { name: /upload/i });

    // Click upload
    await user.click(uploadButton);

    // Button should be disabled
    expect(uploadButton).toBeDisabled();
    expect(uploadButton).toHaveTextContent(/uploading/i);
  });
});
