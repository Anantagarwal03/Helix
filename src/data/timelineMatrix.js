export const timelineMatrix = {
  'donnie-darko': {
    rootNode: 'dd-root',
    nodes: {
      'dd-root': {
        title: "The Jet Engine Incident",
        description: "October 2, 1988. A mysterious voice calls out to Donnie in the middle of the night, urging him to wake up. A jet engine is destined to crash into his bedroom.",
        choices: [
          { label: "Follow the voice (Frank)", targetId: "dd-tangent-active" },
          { label: "Ignore it and stay in bed", targetId: "dd-instant-collapse" }
        ]
      },
      'dd-instant-collapse': {
        title: "Primary Universe Preserved",
        description: "Donnie ignores the voice and is crushed by the jet engine. He dies instantly. The Tangent Universe never forms. The primary timeline remains intact, but Donnie's story ends here.",
        isEnding: true,
        choices: []
      },
      'dd-tangent-active': {
        title: "The Tangent Universe Awakens",
        description: "Donnie sleepwalks to the golf course, surviving the crash. The 28-day countdown begins. Frank demands he flood the local school.",
        choices: [
          { label: "Obey Frank and flood the school", targetId: "dd-meet-gretchen" },
          { label: "Resist Frank's manipulation", targetId: "dd-frank-retaliates" }
        ]
      },
      'dd-meet-gretchen': {
        title: "A New Variable",
        description: "Because the school is flooded, Donnie waits for the bus and meets Gretchen Ross. She becomes his tether to the world, setting up the ultimate sacrifice.",
        isEnding: true,
        choices: []
      },
      'dd-frank-retaliates': {
        title: "The Artifact Fails",
        description: "Donnie refuses to cause chaos. Frank becomes hostile. Without the chain of events, Donnie never meets Gretchen, fails to send the engine back, and a black hole swallows the universe.",
        isEnding: true,
        choices: []
      }
    }
  }
}
