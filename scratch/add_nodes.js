const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'TwistGraph3D.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const useEffectRegex = /useEffect\(\(\) => \{\s*if \(\!movies \|\| movies\.length === 0\) \{[\s\S]*?\}, \[movies, graphData\]\);\s*/;
content = content.replace(useEffectRegex, '');

// Strip 'setInternalGraphData(graphData)' usage, wait internalGraphData was set in state.
// We can just find INITIAL_GRAPH_DATA and modify it.

// Let's rewrite INITIAL_GRAPH_DATA fully to give explicit spatial coordinates (fx, fz, fy).
// We'll use string replacement.
const graphDataRegex = /export const INITIAL_GRAPH_DATA = \{[\s\S]*?\n\};\n/;

const newGraphData = `export const INITIAL_GRAPH_DATA = {
  nodes: [
    { id: 'sixth-sense', label: 'The Sixth Sense', film: 'sixth-sense', filmName: 'The Sixth Sense', type: 'film', size: 8, fx: 0, fz: -90, fy: 0,
      revealText: 'Not every gift is a blessing.', revealSubtext: 'Every clue was present from the opening frame.', revealClassification: 'Film Hub' },
    { id: 'sixth-sense-twist', label: 'Identity Reveal', film: 'sixth-sense', filmName: 'The Sixth Sense', type: 'twist', size: 7, fx: 0, fz: -70, fy: 0,
      revealText: 'Dr. Malcolm Crowe is actually a ghost.', revealSubtext: 'The ring on Anna\\'s bedside table...', revealClassification: 'Core Twist' },

    { id: 'donnie-darko', label: 'Donnie Darko', film: 'donnie-darko', filmName: 'Donnie Darko', type: 'film', size: 8, fx: 85, fz: -27, fy: 30,
      revealText: '28 days, 6 hours, 42 minutes, 12 seconds.', revealSubtext: 'The Tangent Universe has a lifespan.', revealClassification: 'Film Hub' },
    { id: 'donnie-darko-twist', label: 'Tangent Universe', film: 'donnie-darko', filmName: 'Donnie Darko', type: 'twist', size: 7, fx: 65, fz: -20, fy: 20,
      revealText: 'The primary universe is stable because Donnie stays in his bedroom.', revealSubtext: 'He sent the engine back through time.', revealClassification: 'Core Twist' },

    { id: 'zodiac', label: 'Zodiac', film: 'zodiac', filmName: 'Zodiac', type: 'film', size: 8, fx: 52, fz: 72, fy: -30,
      revealText: 'The killer was never convicted.', revealSubtext: 'Fincher\\'s film argues the truth is knowable.', revealClassification: 'Film Hub' },
    { id: 'zodiac-twist', label: 'Unreliable Reality', film: 'zodiac', filmName: 'Zodiac', type: 'twist', size: 7, fx: 40, fz: 55, fy: -20,
      revealText: 'The primary suspect is never caught.', revealSubtext: 'The Zodiac\\'s identity is officially unknown.', revealClassification: 'Core Twist' },

    { id: 'taxi-driver', label: 'Taxi Driver', film: 'taxi-driver', filmName: 'Taxi Driver', type: 'film', size: 8, fx: -52, fz: 72, fy: 30,
      revealText: 'Cinematic Narrative Archive Hub', revealSubtext: 'Director: Martin Scorsese', revealClassification: 'Film Hub' },
    { id: 'taxi-driver-twist', label: 'Psychological Descent', film: 'taxi-driver', filmName: 'Taxi Driver', type: 'twist', size: 7, fx: -40, fz: 55, fy: 20,
      revealText: 'Complexity Rating: Medium', revealSubtext: 'Historical data sequence generated via Twist Engine.', revealClassification: 'Core Twist' },

    { id: 'oldboy', label: 'Oldboy', film: 'oldboy', filmName: 'Oldboy', type: 'film', size: 8, fx: -85, fz: -27, fy: -30,
      revealText: 'Cinematic Narrative Archive Hub', revealSubtext: 'Director: Park Chan-wook', revealClassification: 'Film Hub' },
    { id: 'oldboy-twist', label: 'Revenge Trap', film: 'oldboy', filmName: 'Oldboy', type: 'twist', size: 7, fx: -65, fz: -20, fy: -20,
      revealText: 'Complexity Rating: Critical', revealSubtext: 'Historical data sequence generated via Twist Engine.', revealClassification: 'Core Twist' },
  ],
  links: [
    { source: 'sixth-sense', target: 'sixth-sense-twist', value: 1.0, film: 'sixth-sense' },
    { source: 'donnie-darko', target: 'donnie-darko-twist', value: 1.0, film: 'donnie-darko' },
    { source: 'zodiac', target: 'zodiac-twist', value: 1.0, film: 'zodiac' },
    { source: 'taxi-driver', target: 'taxi-driver-twist', value: 1.0, film: 'taxi-driver' },
    { source: 'oldboy', target: 'oldboy-twist', value: 1.0, film: 'oldboy' },
  ]
};
`;

content = content.replace(graphDataRegex, newGraphData);

// Remove internalGraphData state usage and just pass INITIAL_GRAPH_DATA
content = content.replace(/graphData=\{internalGraphData\}/g, 'graphData={INITIAL_GRAPH_DATA}');

fs.writeFileSync(filePath, content);
console.log('Successfully updated TwistGraph3D.jsx');
