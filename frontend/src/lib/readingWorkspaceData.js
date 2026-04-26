export const workspaceBooks = [
  {
    id: 'midnight-library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    progress: 65,
    lastRead: '2 hours ago',
    streakTag: 'Primary read',
    goal: 'Finish Chapter 9 tonight',
    summary:
      'A reflective novel about regret, alternate lives, and the quiet choices that define meaning.',
    chapters: [
      {
        id: 'mdl-1',
        title: 'Between Lives',
        content: [
          'Nora Seed finds herself in a library that exists between life and death, where every shelf offers a different version of the life she could have lived.',
          'Each choice becomes a doorway. Instead of asking whether a life is objectively better, the story asks what makes a life feel fully lived.',
          'The emotional force comes from the small details: friendships left behind, ambitions abandoned, and ordinary moments that suddenly feel precious.',
        ],
      },
      {
        id: 'mdl-2',
        title: 'The Weight of Regret',
        content: [
          'The novel turns regret into structure. Nora is not just thinking about decisions; she is able to step inside them and test what they mean.',
          'This makes the reading experience both philosophical and intimate. The narrative stays easy to follow while still raising deeper questions.',
          'By moving through alternate possibilities, Nora slowly learns that perfection is less important than presence, care, and self-acceptance.',
        ],
      },
      {
        id: 'mdl-3',
        title: 'Choosing a Life',
        content: [
          'As Nora explores more lives, the excitement of possibility gives way to something wiser: clarity about what truly matters.',
          'The chapter rhythm is clean and readable, making this a strong fit for reflection, book club discussion, and theme analysis.',
          'The book invites readers to stop chasing impossible certainty and instead notice the quiet value of the life already within reach.',
        ],
      },
    ],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=600',
    progress: 42,
    lastRead: 'Yesterday',
    streakTag: 'Daily habit',
    goal: 'Review implementation notes',
    summary:
      'A practical guide to behavior change built around small systems, consistency, and compounding progress.',
    chapters: [
      {
        id: 'ah-1',
        title: 'Tiny Gains',
        content: [
          'Small improvements are easy to dismiss in the moment, yet they compound into meaningful change over time.',
          'The core lesson is simple: focus less on dramatic transformation and more on building systems that are easy to repeat.',
          'This chapter works well as a reference chapter because its ideas are immediately actionable and easy to revisit.',
        ],
      },
      {
        id: 'ah-2',
        title: 'Identity First',
        content: [
          'Clear argues that lasting habits grow from identity. Instead of asking what you want to achieve, ask who you want to become.',
          'That shift changes behavior design. Habits stop feeling like tasks and start feeling like evidence of a chosen identity.',
          'This is especially useful for readers who want practical reading routines, note-taking consistency, or study discipline.',
        ],
      },
    ],
  },
  {
    id: 'klara-sun',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    progress: 18,
    lastRead: '3 days ago',
    streakTag: 'AI ethics',
    goal: 'Read one more chapter this week',
    summary:
      'A calm, intelligent novel about loneliness, care, and what we ask technology to become for us.',
    chapters: [
      {
        id: 'ks-1',
        title: 'Observation',
        content: [
          'Klara notices patterns in human behavior with patient precision, making observation itself part of the novel’s emotional texture.',
          'The prose remains restrained, but the restraint creates space for reflection on empathy, dependence, and vulnerability.',
          'Even early scenes reward close reading because the book’s meaning often lives in tone and inference rather than direct explanation.',
        ],
      },
    ],
  },
];

export const aiQuickSuggestions = [
  { id: 'summarize', label: 'Summarize', prompt: 'Summarize this chapter in simple terms.' },
  { id: 'explain', label: 'Explain', prompt: 'Explain the difficult part of this chapter.' },
  { id: 'quiz', label: 'Quiz', prompt: 'Generate 3 quiz questions from this chapter.' },
  { id: 'notes', label: 'Notes', prompt: 'Turn this chapter into short revision notes.' },
];

export const workspaceInsights = {
  dailyGoal: '30 min',
  streak: 12,
  resumeLabel: 'Resume where you left off',
  recommendation:
    'Project Hail Mary is a strong next read for your science-forward, reflective fiction profile.',
};
