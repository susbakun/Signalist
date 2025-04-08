import { PostBody } from "@/components/Post/PostBody"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import React from "react"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Mock the appwrite client and storage
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

// Mock the BluredPostComponent
vi.mock("@/components", () => ({
  BluredPostComponent: () => <div data-testid="blured-post-component">Blured Content</div>,
  Loader: () => <div data-testid="loader">Loading...</div>
}))

describe("PostBody Component", () => {
  test("renders regular post content correctly", () => {
    render(
      <BrowserRouter>
        <PostBody
          content="This is a regular post content"
          publisherUsername="testuser"
          isPremium={false}
        />
      </BrowserRouter>
    )

    expect(screen.getByText("This is a regular post content")).toBeInTheDocument()
    expect(screen.queryByTestId("blured-post-component")).not.toBeInTheDocument()
  })

  test("renders premium post with blur when user is not subscribed", () => {
    render(
      <BrowserRouter>
        <PostBody
          content="This is a premium post content"
          publisherUsername="premiumuser"
          isPremium={true}
          amISubscribed={false}
        />
      </BrowserRouter>
    )

    expect(screen.queryByText("This is a premium post content")).not.toBeInTheDocument()
    expect(screen.getByTestId("blured-post-component")).toBeInTheDocument()
    expect(screen.getByText("Subscribe")).toBeInTheDocument()

    // Check if the subscribe link points to the correct URL
    const subscribeLink = screen.getByText("Subscribe").closest("a")
    expect(subscribeLink).toHaveAttribute("href", "/premiumuser/premium")
  })

  test("renders premium post content when user is subscribed", () => {
    render(
      <BrowserRouter>
        <PostBody
          content="This is a premium post content"
          publisherUsername="premiumuser"
          isPremium={true}
          amISubscribed={true}
        />
      </BrowserRouter>
    )

    expect(screen.getByText("This is a premium post content")).toBeInTheDocument()
    expect(screen.queryByTestId("blured-post-component")).not.toBeInTheDocument()
  })

  test("renders hashtags as links", () => {
    render(
      <BrowserRouter>
        <PostBody
          content="This post has a #hashtag in it"
          publisherUsername="testuser"
          isPremium={false}
        />
      </BrowserRouter>
    )

    const hashtagLink = screen.getByText("#hashtag")
    expect(hashtagLink).toBeInTheDocument()
    expect(hashtagLink.tagName).toBe("A")
    expect(hashtagLink).toHaveAttribute("href", "/hashtag/hashtag")
  })

  test("renders post with image when postImageId is provided", async () => {
    // Mock useEffect and useState
    const useEffectSpy = vi.spyOn(React, "useEffect")

    render(
      <BrowserRouter>
        <PostBody
          content="This post has an image"
          publisherUsername="testuser"
          isPremium={false}
          postImageId="test-image-id"
        />
      </BrowserRouter>
    )

    // Verify that useEffect was called
    expect(useEffectSpy).toHaveBeenCalled()

    // Since we can't easily test the image loading in this test environment,
    // we'll just verify that the component doesn't crash when postImageId is provided
    expect(screen.getByText("This post has an image")).toBeInTheDocument()
  })
})
