import { MessageModel } from "@/shared/models"

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
