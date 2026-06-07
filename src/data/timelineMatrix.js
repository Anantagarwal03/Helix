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
          { label: "Ignore it and stay in bed", targetId: "dd-tangent-death" }
        ]
      },
      'dd-tangent-death': {
        title: "Paradox Death",
        description: "Donnie ignores the voice. The jet engine crushes him. Without a Living Receiver, the Primary Universe continues, but the Artifact creates a localized time loop paradox.",
        type: 'tangent',
        effect: 'blackhole',
        isEnding: true,
        choices: []
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
          { label: "Stay at the party and wait", targetId: "dd-tangent-1" },
          { label: "Flee town with Gretchen", targetId: "dd-tangent-flee" }
        ]
      },
      'dd-tangent-flee': {
        title: "The Escape Attempt",
        description: "Donnie tries to drive Gretchen out of Middlesex. The storm intensifies, forming a massive tornado barrier around the town.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [
          { label: "Drive into the storm", targetId: "dd-tangent-flee-2" }
        ]
      },
      'dd-tangent-flee-2': {
        title: "Trapped in the Tangent",
        description: "The car is flipped. Gretchen dies, and Donnie is left trapped in the collapsing reality.",
        type: 'tangent',
        effect: 'blackhole',
        isEnding: true,
        choices: []
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
  },
  'the-sixth-sense': {
    rootNode: 'session-1',
    nodes: {
      'session-1': {
        title: "Treating Cole Sear",
        description: "Malcolm begins treating Cole, a boy who claims to see ghosts.",
        type: 'canonical',
        choices: [
          { label: "Believe his secret", targetId: 'the-secret' },
          { label: "Dismiss it as trauma", targetId: 'tangent-dismissal' }
        ]
      },
      'tangent-dismissal': {
        title: "A Failed Doctor",
        description: "Malcolm abandons Cole. Cole's condition worsens. Malcolm's lingering spirit becomes a malevolent poltergeist.",
        type: 'tangent',
        effect: 'blackhole',
        choices: []
      },
      'the-secret': {
        title: "I See Dead People",
        description: "Cole reveals his secret. Malcolm decides to help him rather than run.",
        type: 'canonical',
        choices: [
          { label: "Help the ghost in the house", targetId: 'kyras-tape' },
          { label: "Run away", targetId: 'tangent-cowardice' }
        ]
      },
      'tangent-cowardice': {
        title: "Running Away",
        description: "Cole runs away. The timeline is abandoned.",
        type: 'tangent',
        effect: 'blackhole',
        choices: []
      },
      'kyras-tape': {
        title: "The Tape Recording",
        description: "Cole helps Kyra's spirit reveal the truth.",
        type: 'canonical',
        choices: [
          { label: "Attend the school play", targetId: 'the-revelation' }
        ]
      },
      'the-revelation': {
        title: "The Final Truth",
        description: "Malcolm looks at the ring dropping. He realizes he has been dead the entire time.",
        type: 'canonical',
        isEnding: true,
        choices: []
      }
    }
  },
  'zodiac': {
    rootNode: 'the-first-cipher',
    nodes: {
      'the-first-cipher': {
        title: "The Chronicle Letter",
        description: "The killer sends a cipher to the Chronicle.",
        type: 'canonical',
        choices: [
          { label: "Graysmith decodes it", targetId: 'the-basement' },
          { label: "Leave it to the police", targetId: 'tangent-unsolved' }
        ]
      },
      'tangent-unsolved': {
        title: "Fading into Obscurity",
        description: "Graysmith stays a cartoonist. The Zodiac is forgotten, leaving a permanent gap in historical reality.",
        type: 'tangent',
        effect: 'blackhole',
        choices: []
      },
      'the-basement': {
        title: "Vaughn's Basement",
        description: "Graysmith investigates Vaughn's basement with the movie posters.",
        type: 'canonical',
        choices: [
          { label: "Flee the house", targetId: 'the-hardware-store' },
          { label: "Investigate the posters", targetId: 'tangent-basement-death' }
        ]
      },
      'tangent-basement-death': {
        title: "Trapped Underground",
        description: "Graysmith digs too deep and is trapped by Bob Vaughn. The timeline collapses.",
        type: 'tangent',
        effect: 'blackhole',
        choices: []
      },
      'the-hardware-store': {
        title: "The Hardware Store",
        description: "Graysmith looks Arthur Leigh Allen directly in the eyes. He knows.",
        type: 'canonical',
        isEnding: true,
        choices: []
      }
    }
  }
}
