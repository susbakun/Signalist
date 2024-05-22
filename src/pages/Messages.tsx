import { useState } from 'react'

const chats = [
  {
    id: 1,
    name: 'Amir Pouya',
    lastMessage: 'Hey there!',
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
  },
  {
    id: 2,
    name: 'steve',
    lastMessage: 'How are you?',
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
  },
  {
    id: 3,
    name: 'Hamid Naseri',
    lastMessage: 'See you soon.',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
]

const messages = {
  1: [
    { sender: 'Amir Pouya', text: 'Hey there!' },
    { sender: 'Me', text: 'Hello!' }
  ],
  2: [
    { sender: 'steve', text: 'How are you?' },
    { sender: 'Me', text: 'I am good, thanks!' }
  ],
  3: [
    { sender: 'Hamid Naseri', text: 'See you soon.' },
    { sender: 'Me', text: 'Yes, see you!' }
  ]
}

export const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<null | number>(null)

  return (
    <div
      className="flex h-screen bg-primary-main dark:bg-[#101827] text-gray-600
    dark:text-gray-100"
    >
      <div className="w-1/3 bg-gray-200/80 dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-3 mb-2 bg-gray-100
          dark:bg-gray-700 rounded-lg cursor-pointer hover:dark:bg-gray-600
          hover:bg-gray-300"
            onClick={() => setSelectedChat(chat.id)}
          >
            <img
              src={chat.avatar}
              alt={`${chat.name}'s avatar`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold">{chat.name}</h3>
              <p className="text-gray-400">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col">
        {selectedChat ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {chats.find((chat) => chat.id === selectedChat)?.name}
            </h2>
            <div className="flex-grow overflow-y-auto space-y-4">
              {messages[selectedChat as keyof typeof messages].map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.sender === 'Me'
                        ? 'bg-primary-link-button dark:bg-dark-link-button text-white'
                        : 'dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-gray-100'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800
              dark:text-gray-100 placeholder-gray-500 text-gray-600
                focus:outline-none focus:ring-2 focus:ring-primary-link-button focus:dark:ring-dark-link-button border-none"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
