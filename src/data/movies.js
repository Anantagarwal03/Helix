// The Labyrinth — Canonical data constants
export const MOVIES = [
  {
    id: 1,
    slug: 'sixth-sense',
    title: 'The Sixth Sense',
    year: 1999,
    director: 'M. Night Shyamalan',
    genres: ['Psychological Thriller', 'Supernatural', 'Drama'],
    tagline: 'Not every gift is a blessing.',
    twistScore: 9.8,
    twistType: 'Identity Reveal',
    runtime: 107,
    poster: '/the_sixth_sense.png',
    nodes: 12,
    events: 23,
    synopsis: 'A child psychologist discovers that his patient, a troubled boy, can see and communicate with the dead — but neither of them understand the full truth until it is too late.',
    accentColor: '#00f2fe',
    badgeClass: 'badge-cyan',
  },
  {
    id: 2,
    slug: 'donnie-darko',
    title: 'Donnie Darko',
    year: 2001,
    director: 'Richard Kelly',
    genres: ['Sci-Fi', 'Psychological', 'Dark Fantasy'],
    tagline: 'Dark. Darker. Darko.',
    twistScore: 9.4,
    twistType: 'Temporal Loop',
    runtime: 113,
    poster: '/donnie_darko.png',
    nodes: 18,
    events: 31,
    synopsis: 'A troubled teenager navigates a fractured timeline, guided by a demonic rabbit who reveals that the universe itself is tearing apart — and only one act of sacrifice can close the loop.',
    accentColor: '#8b5cf6',
    badgeClass: 'badge-violet',
  },
  {
    id: 3,
    slug: 'zodiac',
    title: 'Zodiac',
    year: 2007,
    director: 'David Fincher',
    genres: ['Crime', 'Mystery', 'Procedural Thriller'],
    tagline: 'There is more than one way to lose your life to a killer.',
    twistScore: 8.7,
    twistType: 'Unreliable Reality',
    runtime: 157,
    poster: '/zodiac.png',
    nodes: 29,
    events: 54,
    synopsis: 'A San Francisco cartoonist becomes obsessed with identifying the Zodiac Killer — a case where the evidence points everywhere and nowhere, and the truth is always just out of reach.',
    accentColor: '#ec4899',
    badgeClass: 'badge-pink',
  },
]

export const STATS = [
  { label: 'Films Indexed',     value: '3',   color: '#00f2fe', badgeClass: 'badge-cyan'   },
  { label: 'Characters Mapped', value: '47',  color: '#8b5cf6', badgeClass: 'badge-violet' },
  { label: 'Story Events',      value: '108', color: '#ec4899', badgeClass: 'badge-pink'   },
  { label: 'Twist Nodes',       value: '23',  color: '#fbbf24', badgeClass: 'badge-slate'  },
]

export const TABLE_SAMPLE_DATA = [
  { movie: 'The Sixth Sense', character: 'Malcolm Crowe',   event: 'First Patient Session',    twist: 'Identity Reveal',    timestamp: 'Act I  · 00:12' },
  { movie: 'The Sixth Sense', character: 'Cole Sear',       event: 'Basement Confrontation',   twist: 'Identity Reveal',    timestamp: 'Act II · 00:47' },
  { movie: 'Donnie Darko',    character: 'Donnie Darko',    event: 'Frank Appears in Mirror',  twist: 'Temporal Loop',      timestamp: 'Act I  · 00:08' },
  { movie: 'Donnie Darko',    character: 'Frank',           event: 'Engine Tears Through Sky', twist: 'Temporal Loop',      timestamp: 'Act III· 01:43' },
  { movie: 'Zodiac',          character: 'Robert Graysmith', event: 'Cipher Decoded',          twist: 'Unreliable Reality', timestamp: 'Act II · 01:01' },
  { movie: 'Zodiac',          character: 'Det. Toschi',     event: 'Prime Suspect Identified', twist: 'Unreliable Reality', timestamp: 'Act III· 02:14' },
]

export const TWIST_TYPES = [
  'Identity Reveal', 'Temporal Loop', 'Unreliable Reality',
  'Dual Timeline', 'Simulation', 'Unreliable Narrator',
  'Hidden Motive', 'False Memory',
]
