import { AccountModel, MessageModel } from "@/shared/models"

export const usersMock: AccountModel[] = [
  {
    name: "Amirsaeed Aryanmehr",
    username: "Amir_Aryan",
    email: "amiraryanmehr@gmail.com",
    password: "amir123",
    bio: "I'm Amir Aryan, a seasoned cryptocurrency trader with over 8 years of experience navigating the volatile crypto markets. With a strong background in financial analysis and a passion for blockchain technology, I've dedicated my career to mastering the art of trading and helping others succeed in this exciting space.",
    followers: [
      { name: "mostafa", username: "mosi", imageUrl: "" },
      { name: "Hamid Naseri", username: "hamihami", imageUrl: "https://i.pravatar.cc/150?img=8" }
    ],
    followings: [],
    score: 20,
    hasPremium: false,
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "mostafa",
    username: "mosi",
    email: "mostafakamal@gmail.com",
    password: "mosi123",
    followers: [
      {
        name: "susba",
        username: "susbakun",
        imageUrl: ""
      }
    ],
    followings: [
      {
        name: "Ali",
        username: "Alid",
        imageUrl: ""
      },
      {
        name: "Amirsaeed Aryanmehr",
        username: "Amir_Aryan",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }
    ],
    score: 1,
    imageUrl: "",
    blockedAccounts: [],
    hasPremium: false,
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "steve",
    username: "stuDent",
    susbscriptionPlan: [
      { duration: "30 days", price: 29.99 },
      { duration: "3 months", price: 79.99 },
      { duration: "6 months", price: 159.99 },
      { duration: "12 months", price: 349.99 }
    ],
    email: "stevejobs@gmail.com",
    password: "steve123",
    subscribers: [
      {
        username: "Amir_Aryan",
        expireDate: new Date().getTime() + 250 * 24 * 60 * 60 * 1000
      },
      {
        username: "mosi",
        expireDate: new Date().getTime() + 21 * 24 * 60 * 60 * 1000
      }
    ],
    hasPremium: true,
    bio: "I'm committed to building a supportive and knowledgeable trading community. Follow my signals and join a network of like-minded individuals striving for excellence in the crypto markets. Let's navigate the world of cryptocurrency trading together and achieve financial success.",
    followers: [
      {
        name: "Hamid Naseri",
        username: "hamihami",
        imageUrl: "https://i.pravatar.cc/150?img=8"
      }
    ],
    followings: [
      {
        name: "Hamid Naseri",
        username: "hamihami",
        imageUrl: "https://i.pravatar.cc/150?img=8"
      }
    ],
    score: 18,
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "Hamid Naseri",
    username: "hamihami",
    email: "hamidnaseri@gmail.com",
    password: "hamid123",
    followers: [],
    followings: [
      {
        name: "Amirsaeed Aryanmehr",
        username: "Amir_Aryan",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      },
      {
        name: "steve",
        username: "stuDent",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
      }
    ],
    score: 5,
    hasPremium: false,
    imageUrl: "https://i.pravatar.cc/150?img=8",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "Ali",
    username: "Alid",
    email: "alidarparesh@gamil.com",
    password: "ali123",
    followers: [],
    followings: [
      {
        name: "Amir Pouya",
        username: "AmirP",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
      }
    ],
    score: 23,
    hasPremium: false,
    imageUrl: "",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "Amir Pouya",
    username: "AmirP",
    hasPremium: true,
    susbscriptionPlan: [
      { duration: "30 days", price: 59.99 },
      { duration: "3 months", price: 159.99 },
      { duration: "6 months", price: 349.99 },
      { duration: "12 months", price: 709.99 }
    ],
    subscribers: [
      {
        username: "hamihami",
        expireDate: new Date().getTime() + 20 * 24 * 60 * 60 * 1000
      },
      {
        username: "Alid",
        expireDate: new Date().getTime() + 24 * 60 * 60 * 1000
      }
    ],
    email: "amirpouya@gmail.com",
    password: "amirp123",
    bio: "Join me on this exciting journey in the crypto trading world. Together, we can turn market opportunities into profitable trades. Happy trading! 🚀📈",
    followers: [
      {
        name: "Ali",
        username: "Alid",
        imageUrl: ""
      }
    ],
    followings: [],
    score: 25,
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  },
  {
    name: "susba",
    username: "susbakun",
    email: "susbakun@gmail.com",
    password: "susba123",
    followers: [],
    followings: [
      {
        name: "mostafa",
        username: "mosi",
        imageUrl: ""
      }
    ],
    score: 8,
    hasPremium: false,
    imageUrl: "",
    blockedAccounts: [],
    bookmarks: { signals: [], posts: [] }
  }
]

export const messagesMock: MessageModel = {
  // Amir_Aryan's messages
  Amir_Aryan: {
    "1": {
      userInfo: {
        name: "Amir Pouya",
        username: "AmirP",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
      },
      messages: [
        {
          sender: {
            name: "Amir Pouya",
            username: "AmirP",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
          },
          text: "Hey there!",
          date: new Date().getTime() - 38 * 22 * 58 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "Hello!",
          date: new Date().getTime() - 18 * 60 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    },
    "2": {
      userInfo: {
        name: "steve",
        username: "stuDent",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
      },
      messages: [
        {
          sender: {
            name: "steve",
            username: "stuDent",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
          },
          text: "How are you?",
          date: new Date().getTime() - 1 * 37 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "I am good, thanks!",
          date: new Date().getTime() - 9 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    },
    "3": {
      userInfo: {
        name: "Hamid Naseri",
        username: "hamihami",
        imageUrl: "https://i.pravatar.cc/150?img=8"
      },
      messages: [
        {
          sender: {
            name: "Hamid Naseri",
            username: "hamihami",
            imageUrl: "https://i.pravatar.cc/150?img=8"
          },
          text: "See you soon.",
          date: new Date().getTime() - 2 * 24 * 18 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "Yes, see you!",
          date: new Date().getTime() - 1.5 * 3 * 10 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    },
    "4": {
      userInfo: null,
      messages: [
        {
          sender: {
            name: "susba",
            username: "susbakun",
            imageUrl: ""
          },
          text: "What's up?",
          date: new Date().getTime() - 1 * 60 * 60 * 1000
        },
        {
          sender: {
            name: "Amir Pouya",
            username: "AmirP",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
          },
          text: "nothing just work",
          date: new Date().getTime() - 30 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "nothing goes on, what about you?",
          date: new Date().getTime() - 9 * 60 * 1000
        }
      ],
      isGroup: true,
      usersInfo: [
        {
          name: "Amirsaeed Aryanmehr",
          username: "Amir_Aryan",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        },
        {
          name: "Amir Pouya",
          username: "AmirP",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
        },
        {
          name: "susba",
          username: "susbakun",
          imageUrl: ""
        }
      ],
      groupInfo: {
        groupName: "colleagues"
      }
    }
  },

  // AmirP's messages
  AmirP: {
    "1": {
      userInfo: {
        name: "Amirsaeed Aryanmehr",
        username: "Amir_Aryan",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      },
      messages: [
        {
          sender: {
            name: "Amir Pouya",
            username: "AmirP",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
          },
          text: "Hey there!",
          date: new Date().getTime() - 38 * 22 * 58 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "Hello!",
          date: new Date().getTime() - 18 * 60 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    },
    "4": {
      userInfo: null,
      messages: [
        {
          sender: {
            name: "susba",
            username: "susbakun",
            imageUrl: ""
          },
          text: "What's up?",
          date: new Date().getTime() - 1 * 60 * 60 * 1000
        },
        {
          sender: {
            name: "Amir Pouya",
            username: "AmirP",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
          },
          text: "nothing just work",
          date: new Date().getTime() - 30 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "nothing goes on, what about you?",
          date: new Date().getTime() - 9 * 60 * 1000
        }
      ],
      isGroup: true,
      usersInfo: [
        {
          name: "Amirsaeed Aryanmehr",
          username: "Amir_Aryan",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        },
        {
          name: "Amir Pouya",
          username: "AmirP",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
        },
        {
          name: "susba",
          username: "susbakun",
          imageUrl: ""
        }
      ],
      groupInfo: {
        groupName: "colleagues"
      }
    }
  },

  // stuDent's messages
  stuDent: {
    "2": {
      userInfo: {
        name: "Amirsaeed Aryanmehr",
        username: "Amir_Aryan",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      },
      messages: [
        {
          sender: {
            name: "steve",
            username: "stuDent",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
          },
          text: "How are you?",
          date: new Date().getTime() - 1 * 37 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "I am good, thanks!",
          date: new Date().getTime() - 9 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    }
  },

  // hamihami's messages
  hamihami: {
    "3": {
      userInfo: {
        name: "Amirsaeed Aryanmehr",
        username: "Amir_Aryan",
        imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      },
      messages: [
        {
          sender: {
            name: "Hamid Naseri",
            username: "hamihami",
            imageUrl: "https://i.pravatar.cc/150?img=8"
          },
          text: "See you soon.",
          date: new Date().getTime() - 2 * 24 * 18 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "Yes, see you!",
          date: new Date().getTime() - 1.5 * 3 * 10 * 60 * 1000
        }
      ],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    }
  },

  // susbakun's messages
  susbakun: {
    "4": {
      userInfo: null,
      messages: [
        {
          sender: {
            name: "susba",
            username: "susbakun",
            imageUrl: ""
          },
          text: "What's up?",
          date: new Date().getTime() - 1 * 60 * 60 * 1000
        },
        {
          sender: {
            name: "Amir Pouya",
            username: "AmirP",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
          },
          text: "nothing just work",
          date: new Date().getTime() - 30 * 60 * 1000
        },
        {
          sender: {
            name: "Amirsaeed Aryanmehr",
            username: "Amir_Aryan",
            imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          },
          text: "nothing goes on, what about you?",
          date: new Date().getTime() - 9 * 60 * 1000
        }
      ],
      isGroup: true,
      usersInfo: [
        {
          name: "Amirsaeed Aryanmehr",
          username: "Amir_Aryan",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        },
        {
          name: "Amir Pouya",
          username: "AmirP",
          imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
        },
        {
          name: "susba",
          username: "susbakun",
          imageUrl: ""
        }
      ],
      groupInfo: {
        groupName: "colleagues"
      }
    }
  },

  // Empty message objects for other users who haven't started conversations yet
  mosi: {},
  Alid: {}
}
