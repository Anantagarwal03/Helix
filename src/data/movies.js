import sixthSenseImg from '../assets/posters/sixth-sense.jpg'
import donnieDarkoImg from '../assets/posters/donnie-darko.jpg'
import zodiacImg from '../assets/posters/zodiac.jpg'
import taxiDriverImg from '../assets/posters/taxi-driver.jpg'
import oldboyImg from '../assets/posters/oldboy.jpg'
import { STORY_GRAPHS } from './storyGraphs.js'

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
    nodes: 9,
    events: 4
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
    nodes: 10,
    events: 6
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
    nodes: 8,
    events: 4
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
    nodes: 9,
    events: 5
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
    nodes: 8,
    events: 4
  },
  {
    id: 'inception', title: 'Inception', director: 'Christopher Nolan', year: 2010,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Heist'], twistType: 'Dream Heist / Ambiguous Reality',
    accentColor: '#38bdf8', twistScore: '—', nodes: 11, events: 6,
  },
  {
    id: 'interstellar', title: 'Interstellar', director: 'Christopher Nolan', year: 2014,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Adventure'], twistType: 'Time Dilation / Gravity Message',
    accentColor: '#a78bfa', twistScore: '—', nodes: 12, events: 8,
  },
  {
    id: 'parasite', title: 'Parasite', director: 'Bong Joon-ho', year: 2019,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Thriller', 'Drama'], twistType: 'Hidden Bunker / Class Reversal',
    accentColor: '#fbbf24', twistScore: '—', nodes: 11, events: 6,
  },
  {
    id: 'butterfly-effect', title: 'The Butterfly Effect', director: 'Eric Bress & J. Mackye Gruber', year: 2004,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Thriller'], twistType: 'Timeline Rewrites / Self-Erasure',
    accentColor: '#34d399', twistScore: '—', nodes: 10, events: 6,
  },
  {
    id: 'fight-club', title: 'Fight Club', director: 'David Fincher', year: 1999,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Drama', 'Thriller'], twistType: 'Unreliable Narrator / Split Identity',
    accentColor: '#fb7185', twistScore: '—', nodes: 11, events: 7,
  },
  {
    id: 'source-code', title: 'Source Code', director: 'Duncan Jones', year: 2011,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Thriller'], twistType: 'Repeated Timeline / Alternate Reality',
    accentColor: '#22d3ee', twistScore: '—', nodes: 11, events: 6,
  },
  {
    id: 'nocturnal-animals', title: 'Nocturnal Animals', director: 'Tom Ford', year: 2016,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Thriller', 'Drama'], twistType: 'Story Within a Story / Emotional Revenge',
    accentColor: '#c084fc', twistScore: '—', nodes: 10, events: 5,
  },
  {
    id: 'tmdb-206487', title: 'Predestination', director: 'Michael and Peter Spierig', year: 2014,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Thriller'], twistType: 'Causal Loop / Identity Paradox',
    accentColor: '#60a5fa', twistScore: '—', nodes: 19, events: 12,
  },
  {
    id: 'arrival', title: 'Arrival', director: 'Denis Villeneuve', year: 2016,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Science Fiction', 'Drama'], twistType: 'Nonlinear Time / Language',
    accentColor: '#67e8f9', twistScore: '—', nodes: 18, events: 12,
  },
  {
    id: 'the-prestige', title: 'The Prestige', director: 'Christopher Nolan', year: 2006,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Drama', 'Mystery'], twistType: 'Rivalry / Duplicated Identity',
    accentColor: '#c4b5fd', twistScore: '—', nodes: 19, events: 11,
  },
  {
    id: 'gone-girl', title: 'Gone Girl', director: 'David Fincher', year: 2014,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Thriller', 'Mystery'], twistType: 'Unreliable Narration / Media Manipulation',
    accentColor: '#fda4af', twistScore: '—', nodes: 19, events: 12,
  },
  {
    id: 'get-out', title: 'Get Out', director: 'Jordan Peele', year: 2017,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Horror', 'Thriller'], twistType: 'Social Horror / Bodily Appropriation',
    accentColor: '#86efac', twistScore: '—', nodes: 19, events: 11,
  },
  {
    id: 'shutter-island', title: 'Shutter Island', director: 'Martin Scorsese', year: 2010,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Mystery', 'Thriller'], twistType: 'Delusion / Staged Investigation',
    accentColor: '#fdba74', twistScore: '—', nodes: 19, events: 12,
  },
  {
    id: 'se7en', title: 'Se7en', director: 'David Fincher', year: 1995,
    complexity: 'High', poster: null, posterUrl: null,
    genres: ['Crime', 'Mystery', 'Thriller'], twistType: 'Seven Deadly Sins / Forced Final Choice',
    accentColor: '#f87171', twistScore: '—', nodes: 20, events: 15,
  },
];

export const STATS = [
  { label: 'Films Indexed',     value: String(Object.keys(STORY_GRAPHS).length), color: '#00f2fe', badgeClass: 'badge-cyan' },
  { label: 'Characters Mapped', value: String(Object.values(STORY_GRAPHS).reduce((sum, graph) => sum + graph.nodes.filter(node => node.type === 'character').length, 0)), color: '#8b5cf6', badgeClass: 'badge-violet' },
  { label: 'Story Events',      value: String(Object.values(STORY_GRAPHS).reduce((sum, graph) => sum + graph.nodes.filter(node => node.type === 'event').length, 0)), color: '#ec4899', badgeClass: 'badge-pink' },
  { label: 'Twist Nodes',       value: String(Object.values(STORY_GRAPHS).reduce((sum, graph) => sum + graph.nodes.filter(node => node.type === 'twist').length, 0)), color: '#fbbf24', badgeClass: 'badge-slate' },
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
