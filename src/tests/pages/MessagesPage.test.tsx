import { MessagesPage } from "@/pages/MessagesPage"
import { ChatType } from "@/shared/types"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { vi } from "vitest"

// Mock the hooks and redux store
vi.mock("@/features/Message/messagesSlice", () => ({
  useAppSelector: vi.fn().mockImplementation((selector) => {
    // Mock the state that useAppSelector would return
    const mockState = {
      messages: {
        testuser: {
          user1: {
            isGroup: false,
            userInfo: {
              username: "user1",
              name: "User One",
              imageUrl: "user1-image.jpg"
            },
            messages: [
              {
                id: "1",
                text: "Hello there!",
                date: Date.now() - 3600000, // 1 hour ago
                sender: {
                  username: "user1",
                  name: "User One",
                  imageUrl: "user1-image.jpg"
                }
              }
            ]
          },
          group1: {
            isGroup: true,
            groupInfo: {
              id: "group1",
              groupName: "Test Group",
              groupImage: "group-image.jpg",
              createdBy: "testuser"
            },
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
              },
              {
                username: "user2",
                name: "User Two",
                imageUrl: "user2-image.jpg"
              }
            ],
            messages: [
              {
                id: "2",
                text: "Group message",
                date: Date.now() - 7200000, // 2 hours ago
                sender: {
                  username: "user2",
                  name: "User Two",
                  imageUrl: "user2-image.jpg"
                }
              }
            ]
          }
        }
      }
    }
    return selector(mockState)
  })
}))

vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser")
}))

// Mock the components used in MessagesPage
vi.mock("@/components", () => ({
  MessageRooms: ({ myMessages }: { myMessages: ChatType }) => (
    <div data-testid="message-rooms">
      {Object.keys(myMessages).map((roomId) => (
        <div key={roomId} data-testid="message-room-item" data-room-id={roomId}>
          {roomId}
        </div>
      ))}
    </div>
  )
}))

// Create a mock MessageRoom component for the Outlet
const MockMessageRoom = () => (
  <div data-testid="message-room-content">
    <button data-testid="back-button" onClick={() => {}}>
      Back
    </button>
    <div>Message Room Content</div>
  </div>
)

// Create a mock store
const mockStore = {
  getState: () => ({
    messages: {
      testuser: {
        user1: {
          isGroup: false,
          userInfo: {
            username: "user1",
            name: "User One",
            imageUrl: "user1-image.jpg"
          },
          messages: [
            {
              id: "1",
              text: "Hello there!",
              date: Date.now() - 3600000,
              sender: {
                username: "user1",
                name: "User One",
                imageUrl: "user1-image.jpg"
              }
            }
          ]
        },
        group1: {
          isGroup: true,
          groupInfo: {
            id: "group1",
            groupName: "Test Group",
            groupImage: "group-image.jpg",
            createdBy: "testuser"
          },
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
            },
            {
              username: "user2",
              name: "User Two",
              imageUrl: "user2-image.jpg"
            }
          ],
          messages: [
            {
              id: "2",
              text: "Group message",
              date: Date.now() - 7200000,
              sender: {
                username: "user2",
                name: "User Two",
                imageUrl: "user2-image.jpg"
              }
            }
          ]
        }
      }
    },
    users: [
      {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg",
        score: 100,
        blockedAccounts: [],
        followers: [],
        followings: []
      }
    ]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

describe("MessagesPage Component", () => {
  test("renders message rooms list when no chat is selected", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MessagesPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    )

    // Check if the message rooms list is rendered
    expect(screen.getByTestId("message-rooms")).toBeInTheDocument()

    // Check if both message rooms are listed
    const roomItems = screen.getAllByTestId("message-room-item")
    expect(roomItems.length).toBe(2)
    expect(roomItems[0].getAttribute("data-room-id")).toBe("user1")
    expect(roomItems[1].getAttribute("data-room-id")).toBe("group1")

    // Check that the empty state message for no selected chat is shown on larger screens
    expect(screen.getByText("Select a chat to start messaging")).toBeInTheDocument()
  })

  test("renders selected chat when a chat ID is provided", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MessagesPage />}>
              <Route path="user1" element={<MockMessageRoom />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    )

    // Navigate to the chat route
    window.history.pushState({}, "", "/user1")

    // Re-render with the new URL
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MessagesPage />}>
              <Route path="user1" element={<MockMessageRoom />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    )

    // Check if the message room content is rendered
    expect(screen.getByTestId("message-room-content")).toBeInTheDocument()

    // On mobile, the message rooms list should be hidden when a chat is selected
    const messageRooms = screen.getByTestId("message-rooms")
    expect(messageRooms).toHaveClass("hidden")
  })
})
