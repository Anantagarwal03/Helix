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
          { label: "Call the police immediately", targetId: "tangent-police" },
          { label: "Flee town with Gretchen", targetId: "dd-tangent-flee" }
        ]
      },
      'tangent-police': {
        title: "Police Intervention",
        description: "The police arrive early. The fight is broken up, but Donnie never realizes his true purpose. Reality collapses slowly.",
        type: 'tangent',
        choices: [{ label: "Reality collapses. Wake up.", targetId: "dd-root" }]
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
        choices: [{ label: "Reality collapses. Wake up.", targetId: "dd-root" }]
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
        choices: [{ label: "Reality collapses. Wake up.", targetId: "dd-root" }]
      }
    }
  },
  'the-sixth-sense': {
    rootNode: 'session-1',
    nodes: {
      'session-1': {
        title: "Treating Cole Sear",
        description: "Malcolm meets a terrified boy who claims to see the deceased. He must choose how to approach the diagnosis.",
        type: 'canonical',
        choices: [
          { label: "Validate his reality", targetId: "the-secret" },
          { label: "Medicate heavily", targetId: "tangent-medication" },
          { label: "Transfer patient to another doctor", targetId: "tangent-transfer" }
        ]
      },
      'tangent-transfer': {
        title: "A Tragic Handoff",
        description: "Malcolm hands Cole to another therapist. Cole's condition deteriorates, and Malcolm is left wandering forever, never realizing his true state.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Restart session.", targetId: "session-1" }]
      },
      'tangent-medication': {
        title: "The Chemical Veil",
        description: "Cole is heavily medicated. The spirits vanish, but his connection to the living world fades. Malcolm never uncovers his own truth.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Restart session.", targetId: "session-1" }]
      },
      'the-secret': {
        title: "I See Dead People",
        description: "Cole confides his terrifying secret to Malcolm. A young ghost named Kyra appears in Cole's room seeking help.",
        type: 'canonical',
        choices: [
          { label: "Urge Cole to investigate her death", targetId: "kyras-wake" },
          { label: "Advise Cole to ignore and suppress her", targetId: "tangent-haunting" }
        ]
      },
      'tangent-haunting': {
        title: "Unfinished Business",
        description: "Kyra's spirit grows malicious from neglect. The house becomes host to an aggressive haunting, trapping Cole in a cycle of terror.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Restart session.", targetId: "session-1" }]
      },
      'kyras-wake': {
        title: "The Kyra Manifestation",
        description: "Cole slips into Kyra's wake and retrieves a hidden videotape proving her stepmother poisoned her.",
        type: 'canonical',
        choices: [
          { label: "Hand the tape to the father publicly", targetId: "the-exposure" },
          { label: "Confront the stepmother privately", targetId: "tangent-retaliation" }
        ]
      },
      'tangent-retaliation': {
        title: "Silence in the Suburbs",
        description: "The stepmother destroys the evidence and frames Cole for theft. Malcolm's window of closure slams shut.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Restart session.", targetId: "session-1" }]
      },
      'the-exposure': {
        title: "Truth Unleashed",
        description: "The tape plays. The murder is exposed. Kyra's soul finds peace, liberating Cole's burden. Now, Malcolm must confront his own cold distance from his wife.",
        type: 'canonical',
        choices: [
          { label: "Return home to fix his marriage", targetId: "the-revelation" }
        ]
      },
      'the-revelation': {
        title: "The Wedding Ring Falls",
        description: "Malcolm watches his wife drop his gold band. He looks down at his blood-soaked shirt. The timeline closes as he finds acceptance.",
        type: 'canonical',
        choices: [{ label: "Reality collapses. Wake up.", targetId: "session-1" }]
      }
    }
  },
  'zodiac': {
    rootNode: 'the-chronicle-letter',
    nodes: {
      'the-chronicle-letter': {
        title: "The Cipher Arrives",
        description: "The San Francisco Chronicle receives an encrypted letter from a killer. Robert Graysmith studies the cryptogram.",
        type: 'canonical',
        choices: [
          { label: "Decode manually", targetId: "vaughns-lead" },
          { label: "Give to Bureaucracy", targetId: "tangent-cold-case" },
          { label: "Publish unedited immediately", targetId: "tangent-panic" }
        ]
      },
      'tangent-panic': {
        title: "City in Panic",
        description: "The raw letter causes mass hysteria. The killer changes his pattern entirely, slipping through the fingers of the SFPD forever.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Return to the letter.", targetId: "the-chronicle-letter" }]
      },
      'tangent-cold-case': {
        title: "The Bureaucratic Abyss",
        description: "The code sits in federal archives for decades. The trail goes cold immediately, and the killer vanishes seamlessly into history.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Return to the letter.", targetId: "the-chronicle-letter" }]
      },
      'vaughns-lead': {
        title: "The Film Poster Clue",
        description: "Graysmith's obsession leads him to Bob Vaughn's house, a theater organist who may hold matching handwriting samples.",
        type: 'canonical',
        choices: [
          { label: "Follow Vaughn down into his dark basement", targetId: "tangent-basement-trap" },
          { label: "Excuse himself and track Vallejo records", targetId: "vallejo-records" }
        ]
      },
      'tangent-basement-trap': {
        title: "The Basement Dead End",
        description: "The floorboards creak upstairs. Graysmith realizes too late he walked into an isolated trap. He becomes another ghost in the investigation.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Return to the letter.", targetId: "the-chronicle-letter" }]
      },
      'vallejo-records': {
        title: "The Arthur Leigh Allen File",
        description: "Graysmith uncovers a matching palm print and matching watch brand name from a prime suspect in Vallejo.",
        type: 'canonical',
        choices: [
          { label: "Confront the suspect at the hardware store", targetId: "the-hardware-store" },
          { label: "Leake the address to vigilantes", targetId: "tangent-mistrial" }
        ]
      },
      'tangent-mistrial': {
        title: "Contaminated Justice",
        description: "A premature confrontation ruins the legal chain of custody. The suspect beats the charges on a technicality.",
        type: 'tangent',
        effect: 'blackhole',
        choices: [{ label: "Reality collapses. Return to the letter.", targetId: "the-chronicle-letter" }]
      },
      'the-hardware-store': {
        title: "The Final Gaze",
        description: "Graysmith walks into the Vallejo hardware store. He locks eyes with Arthur Leigh Allen. No words are spoken. Total closure achieved.",
        type: 'canonical',
        isEnding: true,
        choices: []
      }
    }
  }
}
