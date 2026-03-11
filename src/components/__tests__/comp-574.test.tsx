import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "../../../components/comp-547";
import { uploadFile } from "@/lib/storage";

// Mock the storage module so uploadFile never hits real Supabase
vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(),
}));

describe("FileUpload", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows upload button when files are selected", async () => {
    const user = userEvent.setup();
    const onFilesUploaded = vi.fn();

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

    // Return a never-resolving promise so the component stays in the uploading state
    vi.mocked(uploadFile).mockReturnValue(new Promise(() => {}));

    render(<FileUpload onFilesUploaded={vi.fn()} />);

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/upload image file/i);

    await user.upload(input, file);

    const uploadButton = screen.getByRole("button", { name: /upload/i });

    // Click upload – uploadFile is now pending, so the button should be disabled
    await user.click(uploadButton);

    // Button should be disabled while uploading
    expect(uploadButton).toBeDisabled();
    expect(uploadButton).toHaveTextContent(/uploading/i);
  });
});
