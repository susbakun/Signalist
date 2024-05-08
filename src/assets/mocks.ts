import { AccountModel, PostModel } from '@/shared/models'

export const postsMock: PostModel[] = [
  {
    id: '1',
    content:
      "Just bought some Bitcoin! I've been closely following its performance lately, and I finally decided to jump in. The potential for growth in the crypto market is incredibly exciting, and I'm eager to see where this investment takes me. #crypto #bitcoin #investment",
    date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    likes: 20000,
    publisher: {
      name: 'amirsaeed aryanmehr',
      username: 'Amir Aryan',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
    },
    comments: [
      {
        body: 'Congratulations! Buying Bitcoin is a big step towards financial freedom. Make sure to hodl strong and enjoy the ride! 🚀 #bitcoin #hodl #cryptocurrency',
        commentId: '1',
        postId: '1',
        date: new Date().getTime(),
        likes: 10,
        publisher: {
          name: 'Ali',
          username: 'Alid',
          imageUrl: ''
        }
      },
      {
        body: "Welcome to the world of Bitcoin! It's always inspiring to see new investors joining the crypto community. Wishing you the best of luck on your investment journey! 💰 #crypto #investment #welcome",
        commentId: '2',
        postId: '1',
        likes: 2,
        date: new Date().getTime() - 24 * 60 * 60 * 1000,
        publisher: {
          name: 'steve',
          username: 'stuDent',
          imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
        }
      }
    ]
  },
  {
    id: '2',
    content:
      "Ethereum's smart contract capabilities continue to amaze me. The ability to create decentralized applications that run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference is revolutionary. It's inspiring to see the innovation happening in the Ethereum ecosystem, and I'm excited to be a part of it. #ethereum #smartcontracts #dapps",
    date: new Date().getTime() - 4 * 60 * 60 * 1000,
    likes: 1300,
    publisher: {
      name: 'Hamid Naseri',
      username: 'hamihami',
      imageUrl: ''
    },
    comments: [
      {
        body: "Couldn't agree more! Ethereum's smart contracts are truly revolutionary. The potential for decentralized applications to disrupt traditional industries is immense. Excited to see what the future holds for Ethereum and the entire blockchain ecosystem! 🌐💡 #ethereum #smartcontracts #innovation",
        commentId: '1',
        postId: '2',
        likes: 0,
        date: new Date().getTime() - 60 * 60 * 1000,
        publisher: {
          name: 'susba',
          username: 'susbakun',
          imageUrl: ''
        }
      }
    ]
  },
  {
    id: '3',
    content:
      "The altcoin market has been on fire lately, with many coins seeing significant gains. While Bitcoin has historically dominated the spotlight, it's fascinating to see the rise of alternative cryptocurrencies and the unique solutions they offer. As always, I'm approaching these investments with caution and doing my due diligence, but the potential for profits is certainly enticing. #altcoins #cryptocurrency #investing",
    date: new Date().getTime() - 60 * 60 * 1000,
    likes: 1300,
    publisher: {
      name: 'Amir Pouya',
      username: 'AmirP',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
    },
    comments: [
      {
        body: "Couldn't agree more! Ethereum's smart contracts are truly revolutionary. The potential for decentralized applications to disrupt traditional industries is immense. Excited to see what the future holds for Ethereum and the entire blockchain ecosystem! 🌐💡 #ethereum #smartcontracts #innovation",
        commentId: '1',
        postId: '3',
        likes: 0,
        date: new Date().getTime(),
        publisher: {
          name: 'mostafa',
          username: 'mosi',
          imageUrl: ''
        }
      }
    ]
  },
  {
    id: '4',
    content:
      "Keeping a close eye on the latest crypto projects and ICOs (initial coin offerings) is key to staying ahead in this fast-paced industry. With new coins and tokens launching regularly, there's no shortage of opportunities for investors to get involved. However, it's important to approach each investment with caution and conduct thorough research to ensure you're making informed decisions. #ICO #crypto #investing",
    date: new Date().getTime() - 2 * 60 * 1000,
    likes: 100,
    publisher: {
      name: 'amirsaeed aryanmehr',
      username: 'Amir Aryan',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
    },
    comments: [
      {
        body: 'Good for me btw, This is not a thing that just falls out of sky!!',
        commentId: '1',
        postId: '4',
        likes: 0,
        date: new Date().getTime(),
        publisher: {
          name: 'amirsaeed aryanmehr',
          username: 'Amir Aryan',
          imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
        }
      }
    ]
  }
]

export const usersMock: AccountModel[] = [
  {
    name: 'amirsaeed aryanmehr',
    username: 'Amir Aryan',
    email: 'amiraryanmehr@gmail.com',
    followers: ['mosi', 'hamihami'],
    followings: [],
    score: 20,
    imageUrl: ''
  },
  {
    name: 'mostafa',
    username: 'mosi',
    email: 'mostafakamal@gmail.com',
    followers: ['susbakun'],
    followings: ['Alid', 'Amir Aryan'],
    score: 1,
    imageUrl: ''
  },
  {
    name: 'steve',
    username: 'stuDent',
    email: 'stevejobs@gamil.com',
    followers: ['hamihami'],
    followings: ['hamihami'],
    score: 18,
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
  },
  {
    name: 'Hamid Naseri',
    username: 'hamihami',
    email: 'hamidnaseri@gmail.com',
    followers: [],
    followings: ['Amir Aryan', 'stuDent'],
    score: 5,
    imageUrl: ''
  },
  {
    name: 'Ali',
    username: 'Alid',
    email: 'alidarparesh@gamil.com',
    followers: [],
    followings: ['AmirP'],
    score: 23,
    imageUrl: ''
  },
  {
    name: 'Amir Pouya',
    username: 'AmirP',
    email: 'amirpouya@gmail.com',
    followers: ['Alid'],
    followings: [],
    score: 25,
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
  },
  {
    name: 'susba',
    username: 'susbakun',
    email: 'susbakun@gmail.com',
    followers: [],
    followings: ['mosi'],
    score: 8,
    imageUrl: ''
  }
]
