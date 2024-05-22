import { AccountModel, PostModel, SignalModel } from '@/shared/models'
import { v4 } from 'uuid'

export const postsMock: PostModel[] = [
  {
    id: '1',
    content:
      "Just bought some Bitcoin! I've been closely following its performance lately, and I finally decided to jump in. The potential for growth in the crypto market is incredibly exciting, and I'm eager to see where this investment takes me. #crypto #bitcoin #investment",
    date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    isPremium: false,
    likes: 20000,
    publisher: {
      name: 'Amirsaeed Aryanmehr',
      username: 'Amir_Aryan',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
    },
    comments: [
      {
        body: 'Congratulations! Buying Bitcoin is a big step towards financial freedom. Make sure to hodl strong and enjoy the ride! 🚀 #bitcoin #hodl #cryptocurrency',
        commentId: '1',
        postId: '1',
        date: new Date().getTime(),
        likes: 0,
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
        likes: 3,
        date: new Date().getTime() - 60 * 60 * 1000,
        publisher: {
          name: 'steve',
          username: 'stuDent',
          imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
        }
      },
      {
        body: 'Great to see new faces diving into the crypto market! Best of luck with your Bitcoin journey. Remember, patience is key. 🌟 #crypto #Bitcoin #investment',
        commentId: '3',
        postId: '1',
        likes: 1,
        date: new Date().getTime() - 5 * 60 * 1000,
        publisher: {
          name: 'steve',
          username: 'stuDent',
          imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
        }
      },
      {
        body: 'Had a query about a transaction and the support team was quick and helpful. A+ service!',
        commentId: '4',
        postId: '1',
        likes: 10,
        date: new Date().getTime() - 24 * 60 * 60 * 1000,
        publisher: {
          name: 'Ali',
          username: 'Alid',
          imageUrl: ''
        }
      }
    ]
  },
  {
    id: '2',
    content:
      "Ethereum's smart contract capabilities continue to amaze me. The ability to create decentralized applications that run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference is revolutionary. It's inspiring to see the innovation happening in the Ethereum ecosystem, and I'm excited to be a part of it. #ethereum #smartcontracts #dapps",
    date: new Date().getTime() - 4 * 60 * 60 * 1000,
    isPremium: false,
    likes: 1300,
    publisher: {
      name: 'Hamid Naseri',
      username: 'hamihami',
      imageUrl: 'https://i.pravatar.cc/150?img=8'
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
    isPremium: true,
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
    isPremium: false,
    likes: 100,
    publisher: {
      name: 'Amirsaeed Aryanmehr',
      username: 'Amir_Aryan',
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
          name: 'Amirsaeed Aryanmehr',
          username: 'Amir_Aryan',
          imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
        }
      }
    ]
  }
]

export const usersMock: AccountModel[] = [
  {
    name: 'Amirsaeed Aryanmehr',
    username: 'Amir_Aryan',
    email: 'amiraryanmehr@gmail.com',
    bio: "I'm Amir Aryan, a seasoned cryptocurrency trader with over 8 years of experience navigating the volatile crypto markets. With a strong background in financial analysis and a passion for blockchain technology, I've dedicated my career to mastering the art of trading and helping others succeed in this exciting space.",
    followers: [
      { name: 'mostafa', username: 'mosi', imageUrl: '' },
      { name: 'Hamid Naseri', username: 'hamihami', imageUrl: 'https://i.pravatar.cc/150?img=8' }
    ],
    followings: [],
    score: 20,
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
  },
  {
    name: 'mostafa',
    username: 'mosi',
    email: 'mostafakamal@gmail.com',
    followers: [
      {
        name: 'susba',
        username: 'susbakun',
        imageUrl: ''
      }
    ],
    followings: [
      {
        name: 'Ali',
        username: 'Alid',
        imageUrl: ''
      },
      {
        name: 'Amirsaeed Aryanmehr',
        username: 'Amir_Aryan',
        imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
      }
    ],
    score: 1,
    imageUrl: ''
  },
  {
    name: 'steve',
    username: 'stuDent',
    email: 'stevejobs@gamil.com',
    subscribed: true,
    hasPremium: true,
    bio: "I'm committed to building a supportive and knowledgeable trading community. Follow my signals and join a network of like-minded individuals striving for excellence in the crypto markets. Let's navigate the world of cryptocurrency trading together and achieve financial success.",
    followers: [
      {
        name: 'Hamid Naseri',
        username: 'hamihami',
        imageUrl: 'https://i.pravatar.cc/150?img=8'
      }
    ],
    followings: [
      {
        name: 'Hamid Naseri',
        username: 'hamihami',
        imageUrl: 'https://i.pravatar.cc/150?img=8'
      }
    ],
    score: 18,
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
  },
  {
    name: 'Hamid Naseri',
    username: 'hamihami',
    email: 'hamidnaseri@gmail.com',
    followers: [],
    followings: [
      {
        name: 'Amirsaeed Aryanmehr',
        username: 'Amir_Aryan',
        imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
      },
      {
        name: 'steve',
        username: 'stuDent',
        imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
      }
    ],
    score: 5,
    imageUrl: 'https://i.pravatar.cc/150?img=8'
  },
  {
    name: 'Ali',
    username: 'Alid',
    email: 'alidarparesh@gamil.com',
    followers: [],
    followings: [
      {
        name: 'Amir Pouya',
        username: 'AmirP',
        imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
      }
    ],
    score: 23,
    imageUrl: ''
  },
  {
    name: 'Amir Pouya',
    username: 'AmirP',
    hasPremium: true,
    email: 'amirpouya@gmail.com',
    bio: 'Join me on this exciting journey in the crypto trading world. Together, we can turn market opportunities into profitable trades. Happy trading! 🚀📈',
    followers: [
      {
        name: 'Ali',
        username: 'Alid',
        imageUrl: ''
      }
    ],
    followings: [],
    score: 25,
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
  },
  {
    name: 'susba',
    username: 'susbakun',
    email: 'susbakun@gmail.com',
    followers: [],
    followings: [
      {
        name: 'mostafa',
        username: 'mosi',
        imageUrl: ''
      }
    ],
    score: 8,
    imageUrl: ''
  }
]

export const signalsMock: SignalModel[] = [
  {
    id: v4(),
    market: {
      name: 'BTC/USD',
      uuid: 'Qwsogvtv82FCd'
    },
    entry: 61000,
    likes: 20000,
    isPremium: false,
    targets: [
      { id: v4(), value: 61500, touched: true },
      { id: v4(), value: 62000, touched: true },
      { id: v4(), value: 63000, touched: true }
    ],
    openTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    closeTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    stoploss: 60000,
    description: '',
    status: 'closed',
    showChart: true,
    publisher: {
      name: 'Amirsaeed Aryanmehr',
      username: 'Amir_Aryan',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
    }
  },
  {
    id: v4(),
    market: {
      name: 'BNB/USD',
      uuid: 'WcwrkfNI4FUAe'
    },
    entry: 600,
    status: 'open',
    showChart: true,
    likes: 0,
    isPremium: true,
    targets: [
      { id: v4(), value: 630, touched: undefined },
      { id: v4(), value: 640, touched: undefined },
      { id: v4(), value: 650, touched: undefined }
    ],
    openTime: new Date().getTime() - 2 * 60 * 1000,
    closeTime: new Date().getTime() + 30 * 60 * 1000,
    date: new Date().getTime() - 30 * 60 * 1000,
    stoploss: 530,
    description: '',
    publisher: {
      name: 'Amir Pouya',
      username: 'AmirP',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
    }
  },
  {
    id: v4(),
    market: {
      name: 'ETH/USD',
      uuid: 'razxDUgYGNAdQ'
    },
    entry: 2887,
    status: 'closed',
    likes: 1000,
    isPremium: true,
    subscribed: true,
    showChart: true,
    targets: [
      { id: v4(), value: 2900, touched: true },
      { id: v4(), value: 3420, touched: false }
    ],
    openTime: new Date().getTime() - 2 * 60 * 60 * 1000,
    closeTime: new Date().getTime() - 1 * 60 * 60 * 1000,
    date: new Date().getTime() - 3 * 60 * 60 * 1000,
    stoploss: 2680,
    description:
      'Are you holding for the long term, actively trading short-term price movements, or adopting a different approach? What rationale guides your strategy?',
    publisher: {
      name: 'steve',
      username: 'stuDent',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
    }
  }
]
