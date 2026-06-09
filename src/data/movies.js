import sixthSenseImg from '../assets/posters/sixth-sense.jpg'
import donnieDarkoImg from '../assets/posters/donnie-darko.jpg'
import zodiacImg from '../assets/posters/zodiac.jpg'
import taxiDriverImg from '../assets/posters/taxi-driver.jpg'
import oldboyImg from '../assets/posters/oldboy.jpg'

export const MOVIES = [
  {
    id: "sixth-sense",
    title: "The Sixth Sense",
    director: "M. Night Shyamalan",
    year: 1999,
    complexity: "Medium",
    poster: sixthSenseImg,
    posterUrl: sixthSenseImg,
    genres: ["Psychological Thriller", "Supernatural"],
    twistType: "Identity Reveal",
    accentColor: "#991b1b",
    twistScore: "9.8",
    nodes: 12,
    events: 23
  },
  {
    id: "donnie-darko",
    title: "Donnie Darko",
    director: "Richard Kelly",
    year: 2001,
    complexity: "High",
    poster: donnieDarkoImg,
    posterUrl: donnieDarkoImg,
    genres: ["Sci-Fi", "Psychological"],
    twistType: "Temporal Loop",
    accentColor: "#1e3a8a",
    twistScore: "9.4",
    nodes: 18,
    events: 31
  },
  {
    id: "zodiac",
    title: "Zodiac",
    director: "David Fincher",
    year: 2007,
    complexity: "High",
    poster: zodiacImg,
    posterUrl: zodiacImg,
    genres: ["Crime", "Mystery"],
    twistType: "Unreliable Reality",
    accentColor: "#15803d",
    twistScore: "8.7",
    nodes: 29,
    events: 54
  },
  {
    id: "taxi-driver",
    title: "Taxi Driver",
    director: "Martin Scorsese",
    year: 1976,
    complexity: "Medium",
    poster: taxiDriverImg,
    posterUrl: taxiDriverImg,
    genres: ["Crime", "Drama"],
    twistType: "Psychological Descent",
    accentColor: "#b45309",
    twistScore: "8.5",
    nodes: 21,
    events: 38
  },
  {
    id: "oldboy",
    title: "Oldboy",
    director: "Park Chan-wook",
    year: 2003,
    complexity: "Critical",
    poster: oldboyImg,
    posterUrl: oldboyImg,
    genres: ["Action", "Drama"],
    twistType: "Revenge Trap",
    accentColor: "#6b21a8",
    twistScore: "9.9",
    nodes: 24,
    events: 42
  }
];

export const STATS = [
  { label: 'Films Indexed',     value: '5',   color: '#00f2fe', badgeClass: 'badge-cyan'   },
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
