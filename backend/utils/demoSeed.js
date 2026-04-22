const Club = require('../models/Club');
const Contributor = require('../models/Contributor');
const Message = require('../models/Message');
const Progress = require('../models/Progress');
const User = require('../models/User');

const DEMO_IDS = {
  club: '6800c1010000000000000001',
  elena: '6800c1010000000000000011',
  alex: '6800c1010000000000000012',
  sam: '6800c1010000000000000013',
};

const defaultPassword = 'ReadTogether123';

const demoUsers = [
  {
    _id: DEMO_IDS.elena,
    name: 'Elena',
    email: 'elena@readtogether.demo',
    password: defaultPassword,
    avatar: 'https://i.pravatar.cc/100?img=22',
  },
  {
    _id: DEMO_IDS.alex,
    name: 'Alex',
    email: 'alex@readtogether.demo',
    password: defaultPassword,
    avatar: 'https://i.pravatar.cc/100?img=11',
  },
  {
    _id: DEMO_IDS.sam,
    name: 'Sam',
    email: 'sam@readtogether.demo',
    password: defaultPassword,
    avatar: 'https://i.pravatar.cc/100?img=33',
  },
];

const demoMessages = [
  {
    _id: '6800c1010000000000000101',
    clubId: DEMO_IDS.club,
    user: DEMO_IDS.alex,
    text: "Chapter 4 was absolutely mind-blowing! I didn't see that twist coming.",
    chapterNumber: null,
    createdAt: new Date('2026-04-17T10:30:00+05:30'),
    updatedAt: new Date('2026-04-17T10:30:00+05:30'),
  },
  {
    _id: '6800c1010000000000000102',
    clubId: DEMO_IDS.club,
    user: DEMO_IDS.elena,
    text: "I know, right? The way Haig describes the 'what if' scenarios is so relatable.",
    chapterNumber: null,
    createdAt: new Date('2026-04-17T10:35:00+05:30'),
    updatedAt: new Date('2026-04-17T10:35:00+05:30'),
  },
  {
    _id: '6800c1010000000000000103',
    clubId: DEMO_IDS.club,
    user: DEMO_IDS.sam,
    text: 'Do you think Nora will choose the glaciologist life?',
    chapterNumber: null,
    createdAt: new Date('2026-04-17T10:42:00+05:30'),
    updatedAt: new Date('2026-04-17T10:42:00+05:30'),
  },
  {
    _id: '6800c1010000000000000104',
    clubId: DEMO_IDS.club,
    user: DEMO_IDS.alex,
    text: 'Chapter 4 feels like the emotional turning point for the whole book.',
    chapterNumber: 4,
    createdAt: new Date('2026-04-17T10:48:00+05:30'),
    updatedAt: new Date('2026-04-17T10:48:00+05:30'),
  },
  {
    _id: '6800c1010000000000000105',
    clubId: DEMO_IDS.club,
    user: DEMO_IDS.elena,
    text: 'Agreed. The contrast between regret and possibility is so sharp there.',
    chapterNumber: 4,
    createdAt: new Date('2026-04-17T10:52:00+05:30'),
    updatedAt: new Date('2026-04-17T10:52:00+05:30'),
  },
];

const upsertUser = async (userData) => {
  const existingUser = await User.findById(userData._id);

  if (existingUser) {
    existingUser.name = userData.name;
    existingUser.email = userData.email;
    existingUser.avatar = userData.avatar;
    existingUser.profilePicture = userData.avatar;
    await existingUser.save();
    return existingUser;
  }

  const user = new User({
    ...userData,
    profilePicture: userData.avatar,
  });

  await user.save();
  return user;
};

const seedMessages = async () => {
  const existingCount = await Message.countDocuments({ clubId: DEMO_IDS.club });
  if (existingCount > 0) {
    return;
  }

  await Message.insertMany(demoMessages);
};

async function seedDemoData() {
  await Promise.all(demoUsers.map(upsertUser));

  await Club.findByIdAndUpdate(
    DEMO_IDS.club,
    {
      name: 'Sci-Fi Seekers',
      description: 'A futuristic reading circle for readers who love thought experiments and world-building.',
      members: [DEMO_IDS.elena, DEMO_IDS.alex, DEMO_IDS.sam],
      memberCount: 124,
      owner: DEMO_IDS.elena,
      book: {
        title: 'Dune',
        author: 'Frank Herbert',
        status: 'Done',
      },
      chapters: [
        { number: 1, title: 'Arrakis Awakens' },
        { number: 2, title: 'The Gom Jabbar' },
        { number: 3, title: 'Plans Within Plans' },
        { number: 4, title: 'Desert Prophecy' },
        { number: 5, title: 'The Fremen Path' },
      ],
      status: 'Reading Done',
      inviteLink: 'http://localhost:5173/invite/6800c1010000000000000001?code=demo',
      inviteCode: 'demo',
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  await Progress.findOneAndUpdate(
    { userId: DEMO_IDS.elena, clubId: DEMO_IDS.club },
    { completedChapters: [1, 2, 3] },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  await Promise.all([
    Contributor.findOneAndUpdate(
      { userId: DEMO_IDS.elena, clubId: DEMO_IDS.club },
      { points: 45 },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ),
    Contributor.findOneAndUpdate(
      { userId: DEMO_IDS.alex, clubId: DEMO_IDS.club },
      { points: 35 },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ),
    Contributor.findOneAndUpdate(
      { userId: DEMO_IDS.sam, clubId: DEMO_IDS.club },
      { points: 25 },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ),
  ]);

  await seedMessages();
}

module.exports = {
  DEMO_IDS,
  seedDemoData,
};
