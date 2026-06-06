export const timelineMatrix = {
  'donnie-darko': {
    rootNode: 'dd-root',
    nodes: {
      'dd-root': {
        title: "The Jet Engine Incident",
        description: "October 2, 1988. A mysterious voice calls out to Donnie in the middle of the night, urging him to wake up. A jet engine is destined to crash into his bedroom.",
        type: 'canonical',
        bgImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80",
        choices: [
          { label: "Follow the voice (Frank)", targetId: "dd-tangent-active" },
          { label: "Ignore it and stay in bed", targetId: "dd-tangent-start" }
        ]
      },
      'dd-tangent-start': {
        title: "The Unstable Timeline",
        description: "Donnie ignores Frank. The engine crashes but he miraculously survives. Without Frank's guidance, the universe immediately becomes highly unstable.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [
          { label: "Go outside", targetId: "dd-tangent-middle" }
        ]
      },
      'dd-tangent-middle': {
        title: "The Sky Tears Apart",
        description: "The sky begins to tear apart with violent temporal storms. Physics start to break down around him as the paradox reaches critical mass.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [
          { label: "Wait for the end", targetId: "dd-tangent-end" }
        ]
      },
      'dd-tangent-end': {
        title: "Total Collapse",
        description: "Total collapse. The tangent universe folds in on itself, crushing all life and erasing the timeline completely.",
        type: 'tangent',
        effect: 'blackhole',
        isEnding: true,
        choices: []
      },
      'dd-tangent-active': {
        title: "The Tangent Universe Awakens",
        description: "Donnie sleepwalks to the golf course, surviving the crash. The 28-day countdown begins. Frank demands he flood the local school.",
        type: 'canonical',
        bgImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=2000&q=80",
        choices: [
          { label: "Obey Frank and flood the school", targetId: "dd-meet-gretchen" },
          { label: "Resist Frank's manipulation", targetId: "dd-frank-retaliates" }
        ]
      },
      'dd-frank-retaliates': {
        title: "The Artifact Fails",
        description: "Donnie refuses to cause chaos. Frank becomes hostile. Without the chain of events, Donnie never meets Gretchen, fails to send the engine back, and a black hole swallows the universe.",
        type: 'tangent',
        effect: 'blackhole',
        isEnding: true,
        choices: []
      },
      'dd-meet-gretchen': {
        title: "A New Variable",
        description: "Because the school is flooded, Donnie waits for the bus and meets Gretchen Ross. She becomes his tether to the world, setting up the ultimate sacrifice. Frank demands he burn down Jim Cunningham's house.",
        type: 'canonical',
        bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80",
        choices: [
          { label: "Burn down the house", targetId: "dd-grandma-death" },
          { label: "Refuse the violence", targetId: "dd-time-expires" }
        ]
      },
      'dd-time-expires': {
        title: "The 28 Days Run Out",
        description: "Donnie refuses to commit arson. The timeline stalls. On Halloween night, the 28-day limit expires without the engine being sent back, resulting in a cataclysmic collapse of space-time.",
        type: 'tangent',
        effect: 'blackhole',
        isEnding: true,
        choices: []
      },
      'dd-grandma-death': {
        title: "The Cellar Door",
        description: "The fire exposes Jim Cunningham's secrets. The timeline accelerates toward the Halloween party. Gretchen arrives, distraught. Donnie realizes they must visit Grandma Death's house.",
        type: 'canonical',
        bgImage: "https://images.unsplash.com/photo-1505364841922-386b1603ba7d?auto=format&fit=crop&w=2000&q=80",
        choices: [
          { label: "Go to Grandma Death's cellar", targetId: "dd-the-confrontation" },
          { label: "Stay at the party and wait", targetId: "dd-tangent-1" }
        ]
      },
      'dd-tangent-1': {
        title: "Splintering Reality",
        description: "Reality begins to splinter.",
        type: 'tangent',
        effect: 'blackhole',
        tangentDepth: 1,
        choices: [
          { label: "Watch it fall apart", targetId: "dd-tangent-2" }
        ]
      },
      'dd-tangent-2': {
        title: "The Collapse",
        description: "The tangent universe collapses.",
        type: 'tangent',
        effect: 'blackhole',
        tangentDepth: 2,
        choices: [
          { label: "Face the end", targetId: "dd-tangent-loop" }
        ]
      },
      'dd-tangent-loop': {
        title: "Time Folds",
        description: "Time folds. Return to October 2nd.",
        type: 'tangent',
        effect: 'blackhole',
        tangentDepth: 3,
        choices: [
          { label: "Collapse and Rewind", targetId: "dd-root" }
        ]
      },
      'dd-the-confrontation': {
        title: "The Final Sacrifice",
        description: "Gretchen is killed. Donnie shoots Frank in the eye, completing the loop. Armed with telekinesis, he tears the jet engine from the sky and sends it back to the primary universe, restoring order at the cost of his own life.",
        type: 'canonical',
        bgImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=80",
        isEnding: true,
        choices: []
      }
    }
  }
}
