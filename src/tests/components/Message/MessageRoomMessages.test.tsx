import { MessageRoomMessages } from "@/components/Message/MessageRoom/MessageRoomMessages"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
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
    getProperAvatar: vi.fn().mockReturnValue(<div>Avatar</div>)
  })
}))

// Mock the utils
vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser"),
  formatMessageDate: vi.fn().mockReturnValue("10:30 AM"),
  getAvatarPlaceholder: vi.fn().mockReturnValue("TU"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cn: (...classes: any[]) => classes.filter(Boolean).join(" ")
}))

describe("MessageRoomMessages Component", () => {
  const mockMessages = [
    {
      id: "1",
      text: "Hello there!",
      date: Date.now() - 3600000, // 1 hour ago
      sender: {
        username: "user1",
        name: "User One",
        imageUrl: "user1-image.jpg"
      }
    },
    {
      id: "2",
      text: "Hi, how are you?",
      date: Date.now() - 1800000, // 30 minutes ago
      sender: {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg"
      }
    },
    {
      id: "3",
      text: "I'm good, thanks!",
      date: Date.now() - 900000, // 15 minutes ago
      sender: {
        username: "user1",
        name: "User One",
        imageUrl: "user1-image.jpg"
      }
    }
  ]

  const mockMessagesWithImage = [
    ...mockMessages,
    {
      id: "4",
      text: "Check out this image",
      date: Date.now() - 600000, // 10 minutes ago
      sender: {
        username: "user1",
        name: "User One",
        imageUrl: "user1-image.jpg"
      },
      messageImageId: "image-123"
    }
  ]

  const mockHandleBlurEmojiPicker = vi.fn()

  test("renders messages correctly", () => {
    render(
      <BrowserRouter>
        <MessageRoomMessages
          messages={mockMessages}
          isGroup={false}
          handleBlurEmojiPicker={mockHandleBlurEmojiPicker}
        />
      </BrowserRouter>
    )

    // Check if all messages are rendered
    expect(screen.getByText("Hello there!")).toBeInTheDocument()
    expect(screen.getByText("Hi, how are you?")).toBeInTheDocument()
    expect(screen.getByText("I'm good, thanks!")).toBeInTheDocument()

    // Check if the messages have the correct sender information
    expect(screen.getAllByText(/User One/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Test User/i).length).toBeGreaterThanOrEqual(1)
  })

  test("renders messages with images correctly", () => {
    render(
      <BrowserRouter>
        <MessageRoomMessages
          messages={mockMessagesWithImage}
          isGroup={false}
          handleBlurEmojiPicker={mockHandleBlurEmojiPicker}
        />
      </BrowserRouter>
    )

    // Check if the message with image is rendered
    expect(screen.getByText("Check out this image")).toBeInTheDocument()

    // Since we've mocked the image loading, we can't directly test the image element
    // But we can verify that the component doesn't crash when messageImageId is provided
  })

  test("handles group messages correctly", () => {
    render(
      <BrowserRouter>
        <MessageRoomMessages
          messages={mockMessages}
          isGroup={true}
          handleBlurEmojiPicker={mockHandleBlurEmojiPicker}
        />
      </BrowserRouter>
    )

    // In group chats, sender names should be displayed for all messages
    expect(screen.getAllByText(/User One/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Test User/i).length).toBeGreaterThanOrEqual(1)
  })

  test("calls handleBlurEmojiPicker when clicked", () => {
    const { container } = render(
      <BrowserRouter>
        <MessageRoomMessages
          messages={mockMessages}
          isGroup={false}
          handleBlurEmojiPicker={mockHandleBlurEmojiPicker}
        />
      </BrowserRouter>
    )

    // Click on the messages container (the main div in the component)
    fireEvent.click(container.firstChild!)

    // Check if handleBlurEmojiPicker was called
    expect(mockHandleBlurEmojiPicker).toHaveBeenCalled()
  })
})
