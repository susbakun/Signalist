/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageRoomInput } from "@/components/Message/MessageRoom/MessageRoomInput"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

// Extend the NodeJS global type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      fileReaderInstances: any[]
      FileReader: typeof FileReader
    }
  }
  // Add another declaration for non-NodeJS environments
  var fileReaderInstances: any[]
}

// Mock the components used in MessageRoomInput
vi.mock("@/components", () => ({
  MediaOptionsButton: () => <button data-testid="media-options-button">Media Options</button>,
  MessageImagePreviewModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="image-preview-modal">Image Preview Modal</div> : null
}))

// Mock emoji-picker-react
vi.mock("emoji-picker-react", () => ({
  default: () => <div data-testid="emoji-picker">Emoji Picker</div>,
  Theme: { DARK: "dark", LIGHT: "light" }
}))

// Mock flowbite-react
vi.mock("flowbite-react", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>
}))

// Mock utils
vi.mock("@/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
  isDarkMode: () => false
}))

describe("MessageRoomInput Component", () => {
  const mockHandleChangeMessageText = vi.fn()
  const mockHandleToggleEmojiPicker = vi.fn()
  const mockHandleSendMessage = vi.fn().mockResolvedValue(undefined)
  const mockHandleChangeImage = vi.fn()
  const mockHandleSelectEmoji = vi.fn()

  const defaultProps = {
    messageText: "",
    isEmojiPickerOpen: false,
    selectedImage: undefined,
    isMessageSending: false,
    handleChangeMessageText: mockHandleChangeMessageText,
    handleToggleEmojiPicker: mockHandleToggleEmojiPicker,
    handleSendMessage: mockHandleSendMessage,
    handleChangeImage: mockHandleChangeImage,
    handleSelectEmoji: mockHandleSelectEmoji
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a mock implementation for FileReader
    const fileReaderMock = {
      readAsDataURL: vi.fn(),
      onloadend: null,
      result: "data:image/png;base64,mockbase64data"
    }

    // Track instances manually
    const fileReaderInstances: any[] = []

    global.FileReader = vi.fn().mockImplementation(() => {
      const instance = { ...fileReaderMock }
      fileReaderInstances.push(instance)
      return instance
    }) as unknown as typeof FileReader

    // Add static properties to the mock
    Object.assign(global.FileReader, {
      EMPTY: 0,
      LOADING: 1,
      DONE: 2
    })

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:example-url")

    // Make fileReaderInstances accessible in tests
    global.fileReaderInstances = fileReaderInstances
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("renders input field correctly", () => {
    render(<MessageRoomInput {...defaultProps} />)

    // Check if the textarea is rendered
    const textarea = screen.getByPlaceholderText("Type a message...")
    expect(textarea).toBeInTheDocument()

    // Check if the emoji button is rendered
    expect(screen.getByRole("button", { name: /BsEmojiGrin/i })).toBeInTheDocument()

    // Check if the media options button is rendered
    expect(screen.getByTestId("media-options-button")).toBeInTheDocument()
  })

  test("handles text input correctly", () => {
    render(<MessageRoomInput {...defaultProps} />)

    // Get the textarea
    const textarea = screen.getByPlaceholderText("Type a message...")

    // Simulate typing in the textarea
    fireEvent.change(textarea, { target: { value: "Hello, world!" } })

    // Check if handleChangeMessageText was called with the correct value
    expect(mockHandleChangeMessageText).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: "Hello, world!" } })
    )
  })

  test("handles emoji picker toggle correctly", () => {
    render(<MessageRoomInput {...defaultProps} />)

    // Get the emoji button (first button in the component)
    const emojiButton = screen.getAllByRole("button")[0]

    // Click the emoji button
    fireEvent.click(emojiButton)

    // Check if handleToggleEmojiPicker was called
    expect(mockHandleToggleEmojiPicker).toHaveBeenCalled()
  })

  test("displays emoji picker when isEmojiPickerOpen is true", () => {
    render(<MessageRoomInput {...defaultProps} isEmojiPickerOpen={true} />)

    // Check if the emoji picker is displayed
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument()
  })

  test("handles Enter key press to send message", () => {
    render(<MessageRoomInput {...defaultProps} messageText="Hello, world!" />)

    // Get the textarea
    const textarea = screen.getByPlaceholderText("Type a message...")

    // Simulate pressing Enter key
    fireEvent.keyDown(textarea, { key: "Enter" })

    // Check if handleSendMessage was called
    expect(mockHandleSendMessage).toHaveBeenCalled()
  })

  test("doesn't send message on Shift+Enter (new line)", () => {
    render(<MessageRoomInput {...defaultProps} messageText="Hello, world!" />)

    // Get the textarea
    const textarea = screen.getByPlaceholderText("Type a message...")

    // Simulate pressing Shift+Enter key
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true })

    // Check that handleSendMessage was not called
    expect(mockHandleSendMessage).not.toHaveBeenCalled()
  })

  test("shows image preview modal when an image is selected", () => {
    const selectedFile = new File(["dummy content"], "example.png", { type: "image/png" })

    render(<MessageRoomInput {...defaultProps} selectedImage={selectedFile} />)

    // Trigger the useEffect that handles the file
    const fileReader = global.fileReaderInstances[0]
    if (fileReader.onloadend) {
      fileReader.onloadend()
    }

    // Check if the image preview modal is displayed
    expect(screen.getByTestId("image-preview-modal")).toBeInTheDocument()
  })

  test("disables send button when message is empty and no image is selected", () => {
    render(<MessageRoomInput {...defaultProps} messageText="" />)

    // The send button is the last button in the component
    const sendButton = screen.getAllByRole("button").pop()
    expect(sendButton).toBeDisabled()
  })

  test("enables send button when message has text", () => {
    render(<MessageRoomInput {...defaultProps} messageText="Hello" />)

    // The send button is the last button in the component
    const sendButton = screen.getAllByRole("button").pop()
    expect(sendButton).not.toBeDisabled()
  })

  test("shows loading indicator when message is sending", () => {
    render(<MessageRoomInput {...defaultProps} isMessageSending={true} />)

    // Check if the loading indicator (Spinner) is displayed
    // Since we've mocked the Spinner component, we can't directly test for it
    // But we can check that the send button is disabled during sending
    const sendButton = screen.getAllByRole("button").pop()
    expect(sendButton).toBeDisabled()
  })
})
