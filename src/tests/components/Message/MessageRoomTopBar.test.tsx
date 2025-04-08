/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageRoomTopBar } from "@/components/Message/MessageRoom/MessageRoomTopBar"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

// Mock the appwrite client
vi.mock("appwrite", () => ({
  Client: vi.fn().mockImplementation(() => ({
    setEndpoint: vi.fn().mockReturnThis(),
    setProject: vi.fn().mockReturnThis()
  })),
  Storage: vi.fn().mockImplementation(() => ({
    getFilePreview: vi.fn().mockReturnValue({
      href: "mocked-image-url.jpg"
    })
  })),
  ImageFormat: { Png: "png" },
  ImageGravity: { Center: "center" }
}))

// Mock the useUserMessageRoom hook
vi.mock("@/hooks/useUserMessageRoom", () => ({
  useUserMessageRoom: () => ({
    getProperAvatar: vi.fn().mockReturnValue(<div data-testid="avatar">Avatar</div>)
  })
}))

// Mock the GroupInfoModal component
vi.mock("@/components/Modal/MessageRoom/GroupInfo/GroupInfoModal", () => ({
  GroupInfoModal: ({ openModal }: { openModal: boolean }) =>
    openModal ? <div data-testid="group-info-modal">Group Info Modal</div> : null
}))

// Mock the utils
vi.mock("@/utils", () => ({
  getAvatarPlaceholder: vi.fn().mockReturnValue("TU")
}))

describe("MessageRoomTopBar Component", () => {
  // Mock direct message room
  const mockDMRoom = {
    userInfo: {
      username: "user1",
      name: "User One",
      imageUrl: "user1-image.jpg"
    },
    messages: [],
    usersInfo: null,
    groupInfo: null,
    isGroup: false
  }

  // Mock group message room
  const mockGroupRoom = {
    userInfo: null,
    messages: [],
    usersInfo: [
      {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg"
      },
      {
        username: "user1",
        name: "User One",
        imageUrl: "user1-image.jpg"
      }
    ],
    groupInfo: {
      groupName: "Test Group",
      groupImageId: "group-image-id"
    },
    isGroup: true
  }

  const mockHandleBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders direct message room top bar correctly", () => {
    render(<MessageRoomTopBar myMessages={mockDMRoom as any} onBack={mockHandleBack} />)

    // Check if user name is displayed
    expect(screen.getByText("User One")).toBeInTheDocument()

    // Check if avatar is displayed
    expect(screen.getByTestId("avatar")).toBeInTheDocument()

    // Check if action buttons are displayed
    expect(screen.getByText("Make a Voice Call")).toBeInTheDocument()
    expect(screen.getByText("Make a Video Call")).toBeInTheDocument()

    // Group info button should not be displayed for DM
    expect(screen.queryByText("group info")).not.toBeInTheDocument()
  })

  test("renders group message room top bar correctly", () => {
    render(<MessageRoomTopBar myMessages={mockGroupRoom as any} onBack={mockHandleBack} />)

    // Check if group name is displayed
    expect(screen.getByText("Test Group")).toBeInTheDocument()

    // Check if avatar is displayed
    expect(screen.getByTestId("avatar")).toBeInTheDocument()

    // Check if all action buttons are displayed including group info
    expect(screen.getByText("group info")).toBeInTheDocument()
    expect(screen.getByText("Make a Voice Call")).toBeInTheDocument()
    expect(screen.getByText("Make a Video Call")).toBeInTheDocument()
  })

  test("calls onBack when back button is clicked", () => {
    render(<MessageRoomTopBar myMessages={mockDMRoom as any} onBack={mockHandleBack} />)

    // Find and click the back button
    const backButton = screen.getByRole("button", { name: /back/i })
    fireEvent.click(backButton)

    // Check if onBack was called
    expect(mockHandleBack).toHaveBeenCalled()
  })

  test("opens group info modal when group info button is clicked", () => {
    render(<MessageRoomTopBar myMessages={mockGroupRoom as any} onBack={mockHandleBack} />)

    // Group info modal should not be visible initially
    expect(screen.queryByTestId("group-info-modal")).not.toBeInTheDocument()

    // Find and click the group info button
    const groupInfoButton = screen.getByText("group info").closest("button")
    fireEvent.click(groupInfoButton!)

    // Group info modal should now be visible
    expect(screen.getByTestId("group-info-modal")).toBeInTheDocument()
  })

  test("enlarges image when avatar is clicked", () => {
    render(<MessageRoomTopBar myMessages={mockDMRoom as any} onBack={mockHandleBack} />)

    // Enlarged image view should not be visible initially
    expect(screen.queryByAltText("Enlarged Message")).not.toBeInTheDocument()

    // Find and click the avatar container
    const avatarContainer = screen.getByTestId("avatar").closest("div")
    fireEvent.click(avatarContainer!)

    // Enlarged image view should now be visible
    expect(screen.getByAltText("Enlarged Message")).toBeInTheDocument()

    // Click on the enlarged image view to close it
    fireEvent.click(screen.getByAltText("Enlarged Message"))

    // Enlarged image view should be closed
    expect(screen.queryByAltText("Enlarged Message")).not.toBeInTheDocument()
  })
})
