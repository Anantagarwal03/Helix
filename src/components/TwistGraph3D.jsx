import { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'

const NODE_COLOR = {
  film: '#fbbf24',
  character: '#00f2fe',
  event: '#8b5cf6',
  twist: '#ec4899',
}

export const INITIAL_GRAPH_DATA = {
  nodes: [
    // --- THE SIXTH SENSE ---
    { id: 'sixth-sense', label: 'The Sixth Sense', type: 'film', size: 9, revealText: 'Story map: The Sixth Sense', revealSubtext: 'A spoiler-heavy map of the film’s major character and event connections.', revealClassification: 'Film Hub' },
    { id: 'ss-malcolm', label: 'Malcolm Crowe', type: 'character', size: 5.5, revealText: 'The therapist whose story is reframed', revealSubtext: 'Malcolm works with Cole while grieving the distance in his marriage. The ending reveals that his own death has shaped his point of view.', revealClassification: 'Character', timelineOrder: 2, timelineStage: 'Main story', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }] },
    { id: 'ss-cole', label: 'Cole Sear', type: 'character', size: 5.5, revealText: 'The child who understands the dead', revealSubtext: 'Cole is frightened by the spirits he sees. Once he begins listening to them, he can help them and later explain his experience to his mother.', revealClassification: 'Character', timelineOrder: 3, timelineStage: 'Main story', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }] },
    { id: 'ss-vincent', label: 'Vincent Gray', type: 'character', size: 5, revealText: 'The former patient from the opening', revealSubtext: 'Vincent returns to Malcolm’s home and shoots him. His reappearance echoes Malcolm’s earlier professional failure and sets the hidden story in motion.', revealClassification: 'Character', timelineOrder: 1, timelineStage: 'Opening', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }, { label: 'Library of Congress hosted film study', url: 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/80/26/2019668026/2019668026.pdf' }] },
    { id: 'ss-anna', label: 'Anna Crowe', type: 'character', size: 5, revealText: 'Malcolm’s wife and unfinished bond', revealSubtext: 'Malcolm interprets Anna’s distance as marital estrangement. The final scene shows that she is grieving his death, which Malcolm has not remembered.', revealClassification: 'Character', timelineOrder: 2, timelineStage: 'Main story', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }] },
    { id: 'ss-shooting', label: 'Vincent shoots Malcolm', type: 'event', size: 4.5, revealText: 'The concealed turning point', revealSubtext: 'Vincent confronts Malcolm at home and shoots him. The film transitions forward in a way that initially suggests Malcolm survives.', revealClassification: 'Opening event', timelineOrder: 1, timelineStage: 'Opening', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }, { label: 'Library of Congress hosted film study', url: 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/80/26/2019668026/2019668026.pdf' }] },
    { id: 'ss-confession', label: 'Cole explains what he sees', type: 'event', size: 4.5, revealText: 'Cole gives Malcolm the rule needed to understand the story', revealSubtext: 'After Cole shares that he sees dead people who do not know they are dead, Malcolm begins to reinterpret Cole’s experiences. This rule also becomes key to Malcolm’s own realization.', revealClassification: 'Revelation', timelineOrder: 4, timelineStage: 'Midpoint', sources: [{ label: 'Library of Congress hosted film study', url: 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/80/26/2019668026/2019668026.pdf' }] },
    { id: 'ss-kyra', label: 'Cole helps Kyra’s family', type: 'event', size: 4.5, revealText: 'Cole learns to help a spirit communicate', revealSubtext: 'Cole follows the ghost of Kyra to her funeral and helps deliver evidence to her father, showing Malcolm that Cole’s experiences are not simply hallucinations.', revealClassification: 'Character turning point', timelineOrder: 5, timelineStage: 'Later story', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }] },
    { id: 'ss-ring', label: 'Anna drops Malcolm’s ring', type: 'event', size: 4.5, revealText: 'A visual clue breaks Malcolm’s assumption', revealSubtext: 'When Anna’s hand releases Malcolm’s wedding ring, he notices that the ring is not on his own finger. The clue leads him to recall the opening shooting.', revealClassification: 'Clue', timelineOrder: 6, timelineStage: 'Finale', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }, { label: 'Library of Congress hosted film study', url: 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/80/26/2019668026/2019668026.pdf' }] },
    { id: 'ss-twist', label: 'Malcolm realizes he is dead', type: 'twist', size: 8, revealText: 'The ending changes the meaning of earlier scenes', revealSubtext: 'The ring clue triggers Malcolm’s memory of being shot. He understands that he has been dead since the opening and that Cole’s explanation applied to him too.', revealClassification: 'Identity reveal', timelineOrder: 7, timelineStage: 'Finale', sources: [{ label: 'AFI Catalog synopsis', url: 'https://catalog.afi.com/Film/55204-THE-SIXTH-SENSE' }, { label: 'Library of Congress hosted film study', url: 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/80/26/2019668026/2019668026.pdf' }] },

    // --- DONNIE DARKO ---
    { id: 'donnie-darko', label: 'Donnie Darko', type: 'film', size: 9, revealText: '28 days, 6 hours, 42 minutes, 12 seconds.', revealSubtext: 'The countdown to the absolute collapse of reality.', revealClassification: 'Film Hub' },
    { id: 'dd-donnie', label: 'Donnie (protagonist)', graphLabel: 'Donnie', type: 'character', size: 5.5, revealText: 'The teenager at the center of the loop', revealSubtext: 'Donnie is drawn into an increasingly strange chain of warnings, choices, and consequences.', revealClassification: 'Character', timelineOrder: 1, timelineStage: 'Donnie sleepwalks away' },
    { id: 'dd-frank', label: 'Frank the Rabbit', graphLabel: 'Frank', type: 'character', size: 5.5, revealText: 'The masked messenger', revealSubtext: 'A giant rabbit appears to Donnie and predicts that the world will end. The reason Frank can guide him is revealed later.', revealClassification: 'Character', timelineOrder: 2, timelineStage: 'A warning from Frank', sources: [{ label: '20th Century Studios synopsis', url: 'https://www.20thcenturystudios.com/movies/donnie-darko' }, { label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-countdown', label: 'The End-of-the-World Countdown', graphLabel: 'Countdown', type: 'event', size: 4.5, revealText: 'A precise deadline', revealSubtext: 'Frank gives Donnie a countdown to the end of the world, turning the strange encounter into a clock for the story.', revealClassification: 'Warning', timelineOrder: 3, timelineStage: 'The countdown begins', sources: [{ label: '20th Century Studios synopsis', url: 'https://www.20thcenturystudios.com/movies/donnie-darko' }] },
    { id: 'dd-engine', label: 'Jet Engine Crash', graphLabel: 'Engine crash', type: 'event', size: 4.5, revealText: 'The impossible engine', revealSubtext: 'A jet engine crashes through Donnie’s bedroom while he is away. Its unexplained arrival becomes the central mystery.', revealClassification: 'Opening anomaly', timelineOrder: 4, timelineStage: 'The engine falls', sources: [{ label: '20th Century Studios synopsis', url: 'https://www.20thcenturystudios.com/movies/donnie-darko' }, { label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-flooding', label: 'The School Flooding', graphLabel: 'School flood', type: 'event', size: 4.5, revealText: 'A destructive act changes Donnie’s path', revealSubtext: 'Donnie floods his school after Frank’s influence. The disruption brings him closer to Gretchen.', revealClassification: 'Turning point', timelineOrder: 5, timelineStage: 'The school is flooded', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-gretchen', label: 'Gretchen Ross', graphLabel: 'Gretchen', type: 'character', size: 5.5, revealText: 'A new connection for Donnie', revealSubtext: 'Gretchen becomes close to Donnie as his world grows stranger. Their relationship raises the personal stakes of the ending.', revealClassification: 'Character', timelineOrder: 6, timelineStage: 'Donnie meets Gretchen', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-book', label: 'The Philosophy of Time Travel', graphLabel: 'Time-travel book', type: 'event', size: 4.5, revealText: 'A guide to the strange events', revealSubtext: 'Donnie studies Roberta Sparrow’s book, which gives him a framework for understanding the unstable timeline and the engine.', revealClassification: 'Clue', timelineOrder: 7, timelineStage: 'The rules take shape', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-gretchen-death', label: 'Gretchen Is Killed', graphLabel: 'Gretchen dies', type: 'event', size: 4.5, revealText: 'The personal cost of the loop', revealSubtext: 'Frank runs over Gretchen. Her death becomes the immediate catalyst for Donnie’s confrontation with Frank.', revealClassification: 'Late-story event', timelineOrder: 8, timelineStage: 'The loss that changes everything', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-frank-shot', label: 'Donnie Shoots Frank', graphLabel: 'Frank is shot', type: 'event', size: 4.5, revealText: 'The rabbit mask comes off', revealSubtext: 'Donnie shoots Frank in the eye. The ending reframes this event as the reason the dead Frank can later guide him.', revealClassification: 'Causal loop', timelineOrder: 9, timelineStage: 'Frank is shot', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },
    { id: 'dd-twist', label: 'Donnie Closes the Tangent Universe', graphLabel: 'Loop closes', type: 'twist', size: 8, revealText: 'The ending completes the loop', revealSubtext: 'Donnie returns to the night of the engine crash and stays in his room. His death prevents the tangent timeline’s later tragedies and returns the engine to the primary timeline.', revealClassification: 'Core twist', timelineOrder: 10, timelineStage: 'The loop closes', sources: [{ label: 'Donnie Darko screenplay', url: 'https://ftp.dailyscript.com/scripts/donniedarko.pdf' }] },

    // --- ZODIAC ---
    { id: 'zodiac', label: 'Zodiac', type: 'film', size: 9, revealText: 'This is the Zodiac speaking.', revealSubtext: 'A cold case mystery that slowly consumes everyone who investigates it.', revealClassification: 'Film Hub' },
    { id: 'z-attacks', label: 'The Zodiac Attacks Begin', graphLabel: 'First attacks', type: 'event', size: 4.5, revealText: 'A case opens with a string of attacks', revealSubtext: 'Violence in the Bay Area draws investigators into a case that will resist a clear conclusion.', revealClassification: 'Opening event', timelineOrder: 1, timelineStage: 'The attacks begin', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-robert', label: 'Robert Graysmith', graphLabel: 'Graysmith', type: 'character', size: 5.5, revealText: 'The cartoonist drawn into the case', revealSubtext: 'Robert follows the clues long after the case has consumed the professional investigators around him.', revealClassification: 'Character', timelineOrder: 2, timelineStage: 'The case takes hold', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-cipher', label: 'The San Francisco Ciphers', graphLabel: 'Ciphers', type: 'event', size: 4.5, revealText: 'The taunting letters', revealSubtext: 'The killer sends cryptic symbols and letters to newspapers, drawing investigators and readers into the case.', revealClassification: 'Event', timelineOrder: 3, timelineStage: 'The ciphers arrive', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-avery', label: 'Paul Avery', graphLabel: 'Avery', type: 'character', size: 5.5, revealText: 'The reporter on the Zodiac story', revealSubtext: 'Avery covers the letters and investigation for the San Francisco Chronicle as the case grows more threatening.', revealClassification: 'Character', timelineOrder: 4, timelineStage: 'The press joins the hunt', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-cipher-solved', label: 'A Cipher Is Decoded', graphLabel: 'Cipher decoded', type: 'event', size: 4.5, revealText: 'A clue yields a message, not an identity', revealSubtext: 'Decoding a cipher gives investigators and the public more of the killer’s voice, but it does not settle who he is.', revealClassification: 'Clue', timelineOrder: 5, timelineStage: 'A cipher is cracked', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-allen', label: 'Arthur Leigh Allen', graphLabel: 'Allen', type: 'character', size: 5.5, revealText: 'A leading suspect', revealSubtext: 'Circumstantial clues make Allen a focus of suspicion, but the film does not establish that he was the Zodiac.', revealClassification: 'Character', timelineOrder: 6, timelineStage: 'A suspect emerges', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-case-stalls', label: 'The Investigation Stalls', graphLabel: 'Leads stall', type: 'event', size: 4.5, revealText: 'The clues do not close the case', revealSubtext: 'Investigators pursue leads across jurisdictions, but none produces a conclusive identification.', revealClassification: 'Late-story event', timelineOrder: 7, timelineStage: 'No decisive proof', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },
    { id: 'z-twist', label: 'Unresolvable Mystery', graphLabel: 'Case unresolved', type: 'twist', size: 8, revealText: 'The mystery remains unresolved', revealSubtext: 'The film ends without a definitive identification of the killer, leaving the long trail of clues without closure.', revealClassification: 'Core twist', timelineOrder: 8, timelineStage: 'No conclusive answer', sources: [{ label: 'AFI synopsis', url: 'https://watch.afi.com/movie/zodiac' }] },

    // --- TAXI DRIVER ---
    { id: 'taxi-driver', label: 'Taxi Driver', type: 'film', size: 9, revealText: 'You talkin to me?', revealSubtext: 'A psychological descent into night-shrouded urban isolation.', revealClassification: 'Film Hub' },
    { id: 'td-travis', label: 'Travis Bickle', graphLabel: 'Travis', type: 'character', size: 5.5, revealText: 'The isolated cab driver', revealSubtext: 'A lonely veteran takes night shifts in New York and struggles to connect with the people around him.', revealClassification: 'Character', timelineOrder: 1, timelineStage: 'Isolation takes root', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-night-shifts', label: 'Travis Works the Night Shift', graphLabel: 'Night shifts', type: 'event', size: 4.5, revealText: 'The city becomes Travis’s routine', revealSubtext: 'Driving through the city at night deepens Travis’s sense of isolation and exposes him to the violence he fixates on.', revealClassification: 'Event', timelineOrder: 2, timelineStage: 'The city after dark', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-betsy', label: 'Betsy', graphLabel: 'Betsy', type: 'character', size: 5.5, revealText: 'The campaign worker Travis idealizes', revealSubtext: 'Travis becomes interested in Betsy, who works on a presidential campaign, but he misreads their connection.', revealClassification: 'Character', timelineOrder: 3, timelineStage: 'A connection breaks down', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-diner', label: 'The Diner Meeting', graphLabel: 'Diner meeting', type: 'event', size: 4.5, revealText: 'The other drivers notice his change', revealSubtext: 'Travis talks with fellow cab drivers, but the exchange offers little support as his behavior grows more alarming.', revealClassification: 'Event', timelineOrder: 4, timelineStage: 'A failed attempt to connect', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-iris', label: 'Iris Steensma', graphLabel: 'Iris', type: 'character', size: 5.5, revealText: 'The young runaway Travis meets', revealSubtext: 'Travis encounters Iris, a young runaway under the control of a pimp, and becomes determined to take her away from that life.', revealClassification: 'Character', timelineOrder: 5, timelineStage: 'Travis meets Iris', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-weapons', label: 'Travis Prepares for Violence', graphLabel: 'Weapons and plans', type: 'event', size: 4.5, revealText: 'His private anger takes physical form', revealSubtext: 'Travis acquires weapons and trains alone, turning his vague anger into a plan for public violence.', revealClassification: 'Turning point', timelineOrder: 6, timelineStage: 'A plan takes shape', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-palantine', label: 'Travis Abandons the Assassination Attempt', graphLabel: 'Campaign attempt', type: 'event', size: 4.5, revealText: 'One target escapes his plan', revealSubtext: 'Travis approaches a campaign appearance armed, but is noticed and flees before he can reach Senator Palantine.', revealClassification: 'Late-story event', timelineOrder: 7, timelineStage: 'The first plan collapses', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-shootout', label: 'Travis Attacks the Brothel', graphLabel: 'Brothel shootout', type: 'event', size: 4.5, revealText: 'A violent rescue attempt', revealSubtext: 'Travis returns to Iris’s location and kills several men in a shootout, leaving himself gravely wounded.', revealClassification: 'Climax', timelineOrder: 8, timelineStage: 'The violent climax', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },
    { id: 'td-twist', label: 'The Accidental Hero', graphLabel: 'Accidental hero', type: 'twist', size: 8, revealText: 'The press turns violence into heroism', revealSubtext: 'Travis survives the shootout and the press celebrates him for rescuing Iris, giving his violence a public meaning he did not originally seek.', revealClassification: 'Core twist', timelineOrder: 9, timelineStage: 'Violence reframed as heroism', sources: [{ label: 'BFI film guide', url: 'https://www.bfi.org.uk/film/d964bfb7-729b-5181-85f8-35b1bd3a21a3/taxi-driver' }] },

    // --- OLDBOY ---
    { id: 'oldboy', label: 'Oldboy', type: 'film', size: 9, revealText: 'Laugh, and the world laughs with you.', revealSubtext: 'A masterpiece tracking carefully calculated vengeance.', revealClassification: 'Film Hub' },
    { id: 'ob-captivity', label: 'Dae-su Is Imprisoned', graphLabel: 'Imprisonment', type: 'event', size: 4.5, revealText: 'A sudden disappearance begins the mystery', revealSubtext: 'Dae-su is abducted and held in a locked room without being told who ordered his confinement or why.', revealClassification: 'Opening event', timelineOrder: 1, timelineStage: 'The unexplained captivity', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-daesu', label: 'Oh Dae-su', graphLabel: 'Dae-su', type: 'character', size: 5.5, revealText: 'The man searching for an explanation', revealSubtext: 'After years in captivity, Dae-su is released and sets out to learn who imprisoned him and why.', revealClassification: 'Character', timelineOrder: 2, timelineStage: 'Captivity and release', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-release', label: 'Dae-su Is Released', graphLabel: 'Unexpected release', type: 'event', size: 4.5, revealText: 'Freedom comes with no explanation', revealSubtext: 'Dae-su is abruptly released after fifteen years, then receives clues that lead him toward the person behind his captivity.', revealClassification: 'Turning point', timelineOrder: 3, timelineStage: 'The search begins', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-miha', label: 'Mi-do', graphLabel: 'Mi-do', type: 'character', size: 5.5, revealText: 'A chef who helps Dae-su', revealSubtext: 'Mi-do takes Dae-su in after his release and joins his search, becoming emotionally close to him.', revealClassification: 'Character', timelineOrder: 4, timelineStage: 'An unexpected bond', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-hunt', label: 'Dae-su Searches for His Captor', graphLabel: 'The search', type: 'event', size: 4.5, revealText: 'The search narrows toward a personal enemy', revealSubtext: 'Dae-su follows clues through the city, trying to connect his confinement to a forgotten episode from his past.', revealClassification: 'Investigation', timelineOrder: 5, timelineStage: 'Following the clues', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-woojin', label: 'Lee Woo-jin', graphLabel: 'Woo-jin', type: 'character', size: 5.5, revealText: 'The man behind the confinement', revealSubtext: 'Woo-jin reveals that he arranged Dae-su’s imprisonment and release as part of a deliberate revenge plot.', revealClassification: 'Character', timelineOrder: 6, timelineStage: 'The captor is revealed', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-ultimatum', label: 'Woo-jin Reveals the Revenge Plan', graphLabel: 'The explanation', type: 'event', size: 4.5, revealText: 'The motive reaches back to school', revealSubtext: 'Woo-jin explains how a memory from Dae-su’s school years set the revenge in motion and how he manipulated Dae-su’s search.', revealClassification: 'Revelation', timelineOrder: 7, timelineStage: 'The past returns', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] },
    { id: 'ob-twist', label: 'The Final Revelation', graphLabel: 'Final reveal', type: 'twist', size: 8, revealText: 'The revenge plot changes the meaning of the reunion', revealSubtext: 'Woo-jin reveals that Mi-do is Dae-su’s daughter and that their meeting was engineered as part of his revenge.', revealClassification: 'Core twist', timelineOrder: 8, timelineStage: 'The final revelation', sources: [{ label: 'Korean Film Council', url: 'https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?category=ALL&mode=INDEX_FILMS_LIST&movieCd=20030350&pageIndex=1&pageRowSize=10&peopleCd=&s_genre=ALL&searchKeyword=Oldboy&searchType=ALL&strMenuId=010401&userId=' }] }
  ],
  links: [
    // Sixth Sense Connections
    { source: 'sixth-sense', target: 'ss-malcolm', film: 'sixth-sense', relationship: 'follows', explanation: 'Malcolm is the central character whose point of view shapes the mystery.' },
    { source: 'sixth-sense', target: 'ss-cole', film: 'sixth-sense', relationship: 'follows', explanation: 'Cole’s experiences form the second major story thread.' },
    { source: 'sixth-sense', target: 'ss-anna', film: 'sixth-sense', relationship: 'follows', explanation: 'Malcolm’s relationship with Anna is the emotional thread resolved in the ending.' },
    { source: 'sixth-sense', target: 'ss-vincent', film: 'sixth-sense', relationship: 'introduces', explanation: 'Vincent’s return at the opening creates the event Malcolm cannot remember.' },
    { source: 'ss-vincent', target: 'ss-shooting', film: 'sixth-sense', relationship: 'causes', explanation: 'Vincent shoots Malcolm during the opening confrontation.' },
    { source: 'ss-shooting', target: 'ss-malcolm', film: 'sixth-sense', relationship: 'changes', explanation: 'The shooting begins Malcolm’s posthumous story, though he does not recognize it.' },
    { source: 'ss-malcolm', target: 'ss-confession', film: 'sixth-sense', relationship: 'hears', explanation: 'Malcolm learns Cole’s explanation for the people he sees.' },
    { source: 'ss-cole', target: 'ss-confession', film: 'sixth-sense', relationship: 'reveals', explanation: 'Cole describes his ability and the spirits’ lack of awareness.' },
    { source: 'ss-confession', target: 'ss-kyra', film: 'sixth-sense', relationship: 'enables', explanation: 'Malcolm’s changed advice helps Cole respond to the spirits instead of only fearing them.' },
    { source: 'ss-cole', target: 'ss-kyra', film: 'sixth-sense', relationship: 'helps', explanation: 'Cole helps Kyra communicate information to her family.' },
    { source: 'ss-anna', target: 'ss-ring', film: 'sixth-sense', relationship: 'reveals clue', explanation: 'Anna drops Malcolm’s wedding ring while asleep.' },
    { source: 'ss-ring', target: 'ss-twist', film: 'sixth-sense', relationship: 'triggers', explanation: 'The ring prompts Malcolm to notice its absence and remember his death.' },
    { source: 'ss-confession', target: 'ss-twist', film: 'sixth-sense', relationship: 'foreshadows', explanation: 'Cole’s rule about ghosts applies to Malcolm as well.' },
    { source: 'ss-shooting', target: 'ss-twist', film: 'sixth-sense', relationship: 'is reinterpreted by', explanation: 'The ending reveals the opening shooting was Malcolm’s fatal event.' },

    // Donnie Darko Connections
    { source: 'donnie-darko', target: 'dd-donnie', film: 'donnie-darko', relationship: 'follows', explanation: 'Donnie is at the center of the chain of warnings, choices, and consequences.' },
    { source: 'donnie-darko', target: 'dd-frank', film: 'donnie-darko', relationship: 'introduces', explanation: 'Frank first appears to Donnie as a giant rabbit and predicts the end of the world.' },
    { source: 'dd-frank', target: 'dd-countdown', film: 'donnie-darko', relationship: 'announces', explanation: 'Frank gives Donnie the precise deadline that structures the story.' },
    { source: 'dd-countdown', target: 'dd-engine', film: 'donnie-darko', relationship: 'is followed by', explanation: 'The warning is followed by an unexplained jet engine crashing into Donnie’s bedroom.' },
    { source: 'dd-engine', target: 'dd-donnie', film: 'donnie-darko', relationship: 'spares', explanation: 'Donnie is outside his bedroom when the engine falls, leaving him to investigate why he survived.' },
    { source: 'dd-frank', target: 'dd-flooding', film: 'donnie-darko', relationship: 'manipulates', explanation: 'Frank’s influence pushes Donnie toward destructive actions, including flooding the school.' },
    { source: 'dd-donnie', target: 'dd-flooding', film: 'donnie-darko', relationship: 'carries out', explanation: 'Donnie floods the school, disrupting the routine around him and opening a path to Gretchen.' },
    { source: 'dd-flooding', target: 'dd-gretchen', film: 'donnie-darko', relationship: 'brings together', explanation: 'The school disruption helps Donnie and Gretchen meet and begin a relationship.' },
    { source: 'dd-donnie', target: 'dd-gretchen', film: 'donnie-darko', relationship: 'forms a bond with', explanation: 'Gretchen becomes Donnie’s closest connection as the countdown progresses.' },
    { source: 'dd-donnie', target: 'dd-book', film: 'donnie-darko', relationship: 'investigates', explanation: 'Donnie looks to Roberta Sparrow’s book for an explanation of the time anomalies.' },
    { source: 'dd-book', target: 'dd-twist', film: 'donnie-darko', relationship: 'explains the stakes', explanation: 'The book’s rules help Donnie understand what must happen to close the tangent timeline.' },
    { source: 'dd-gretchen', target: 'dd-gretchen-death', film: 'donnie-darko', relationship: 'is lost in', explanation: 'Gretchen’s death gives the time-loop mystery an immediate personal cost.' },
    { source: 'dd-frank', target: 'dd-gretchen-death', film: 'donnie-darko', relationship: 'causes', explanation: 'Frank’s car hits Gretchen, setting up Donnie’s final confrontation with him.' },
    { source: 'dd-gretchen-death', target: 'dd-frank-shot', film: 'donnie-darko', relationship: 'leads to', explanation: 'After Gretchen is killed, Donnie confronts and shoots Frank.' },
    { source: 'dd-donnie', target: 'dd-frank-shot', film: 'donnie-darko', relationship: 'shoots', explanation: 'Donnie shoots Frank in the eye, creating the injury seen on the rabbit figure.' },
    { source: 'dd-frank-shot', target: 'dd-frank', film: 'donnie-darko', relationship: 'reframes', explanation: 'The shooting explains why the Frank who later guides Donnie is a dead version of Frank.' },
    { source: 'dd-frank', target: 'dd-twist', film: 'donnie-darko', relationship: 'guides', explanation: 'Frank’s messages steer Donnie toward the actions that close the tangent timeline.' },
    { source: 'dd-engine', target: 'dd-twist', film: 'donnie-darko', relationship: 'returns through the loop', explanation: 'The engine is sent back to the primary timeline, where it falls into Donnie’s bedroom.' },
    { source: 'dd-donnie', target: 'dd-twist', film: 'donnie-darko', relationship: 'sacrifices himself', explanation: 'Donnie stays in his room when the timeline resets, preventing the later deaths and collapse.' },

    // Zodiac Connections
    { source: 'zodiac', target: 'z-attacks', film: 'zodiac', relationship: 'opens with', explanation: 'A series of attacks draws the Bay Area into the investigation.' },
    { source: 'z-attacks', target: 'z-robert', film: 'zodiac', relationship: 'draws in', explanation: 'The attacks and public attention pull cartoonist Robert Graysmith toward the case.' },
    { source: 'zodiac', target: 'z-robert', film: 'zodiac', relationship: 'follows', explanation: 'The story tracks how the case consumes cartoonist Robert Graysmith over many years.' },
    { source: 'zodiac', target: 'z-allen', film: 'zodiac', relationship: 'investigates', explanation: 'Arthur Leigh Allen becomes a major suspect, but the film does not establish definitive proof against him.' },
    { source: 'z-attacks', target: 'z-cipher', film: 'zodiac', relationship: 'followed by', explanation: 'The killer’s letters extend the attacks into a public exchange with newspapers and investigators.' },
    { source: 'z-cipher', target: 'z-avery', film: 'zodiac', relationship: 'becomes a story for', explanation: 'Reporter Paul Avery covers the letters and the investigation as public pressure grows.' },
    { source: 'z-cipher', target: 'z-cipher-solved', film: 'zodiac', relationship: 'leads to', explanation: 'One cipher is decoded, yielding a message without identifying the killer.' },
    { source: 'z-robert', target: 'z-cipher', film: 'zodiac', relationship: 'investigates', explanation: 'The ciphers draw Robert deeper into the case and become a focus of his independent investigation.' },
    { source: 'z-avery', target: 'z-allen', film: 'zodiac', relationship: 'reports on', explanation: 'The reporting tracks the growing attention given to suspects such as Arthur Leigh Allen.' },
    { source: 'z-cipher-solved', target: 'z-case-stalls', film: 'zodiac', relationship: 'does not resolve', explanation: 'Even a decoded message fails to provide a conclusive identity.' },
    { source: 'z-allen', target: 'z-case-stalls', film: 'zodiac', relationship: 'remains unproven as', explanation: 'Evidence and suspicion accumulate, but they do not establish Allen’s guilt.' },
    { source: 'z-case-stalls', target: 'z-twist', film: 'zodiac', relationship: 'leaves the case', explanation: 'The investigation reaches no definitive identification, so the mystery remains open.' },
    { source: 'z-cipher', target: 'z-twist', film: 'zodiac', relationship: 'remains unresolved', explanation: 'The clues generate leads but do not produce a conclusive identification of the killer.' },
    { source: 'z-allen', target: 'z-twist', film: 'zodiac', relationship: 'cannot be confirmed', explanation: 'Suspicion persists, while the available evidence never resolves the case beyond doubt.' },

    // Taxi Driver Connections
    { source: 'taxi-driver', target: 'td-travis', film: 'taxi-driver', relationship: 'follows', explanation: 'The film stays close to Travis’s isolated perspective as his thoughts become more volatile.' },
    { source: 'td-travis', target: 'td-night-shifts', film: 'taxi-driver', relationship: 'works', explanation: 'The night shift gives Travis a routine that keeps him moving through the city but deepens his isolation.' },
    { source: 'td-travis', target: 'td-betsy', film: 'taxi-driver', relationship: 'becomes interested in', explanation: 'Travis idealizes Betsy and tries to draw close to her.' },
    { source: 'td-betsy', target: 'td-diner', film: 'taxi-driver', relationship: 'is followed by rejection', explanation: 'After Travis misjudges their date, Betsy ends the relationship and he retreats further into isolation.' },
    { source: 'td-travis', target: 'td-diner', film: 'taxi-driver', relationship: 'seeks advice', explanation: 'Travis tries to talk with other drivers, but their conversation does not reach or redirect him.' },
    { source: 'td-travis', target: 'td-iris', film: 'taxi-driver', relationship: 'meets', explanation: 'Travis meets Iris and decides that he must rescue her from her situation.' },
    { source: 'td-iris', target: 'td-weapons', film: 'taxi-driver', relationship: 'becomes his stated cause', explanation: 'Travis frames his growing violent resolve as an attempt to save Iris.' },
    { source: 'td-travis', target: 'td-weapons', film: 'taxi-driver', relationship: 'prepares for violence', explanation: 'His isolation develops into a private weapons and training regimen.' },
    { source: 'td-weapons', target: 'td-palantine', film: 'taxi-driver', relationship: 'first targets', explanation: 'Travis takes his armed plan to a Palantine campaign appearance, then flees when noticed.' },
    { source: 'td-palantine', target: 'td-shootout', film: 'taxi-driver', relationship: 'is followed by a changed target', explanation: 'After abandoning the campaign attempt, Travis turns his violence toward the men controlling Iris.' },
    { source: 'td-iris', target: 'td-shootout', film: 'taxi-driver', relationship: 'is the focus of', explanation: 'Travis’s attack at the brothel is presented as an effort to free Iris.' },
    { source: 'td-travis', target: 'td-shootout', film: 'taxi-driver', relationship: 'carries out', explanation: 'Travis carries out the violent attack and is left badly wounded.' },
    { source: 'td-shootout', target: 'td-twist', film: 'taxi-driver', relationship: 'is reframed by', explanation: 'News coverage casts the bloody attack as a heroic rescue and Travis as a hero.' },
    { source: 'td-diner', target: 'td-twist', film: 'taxi-driver', relationship: 'contrasts with', explanation: 'The earlier ordinary camaraderie at the diner contrasts with the public praise Travis later receives.' },

    // Oldboy Connections
    { source: 'oldboy', target: 'ob-captivity', film: 'oldboy', relationship: 'opens with', explanation: 'Dae-su’s unexplained abduction begins the film’s central mystery.' },
    { source: 'ob-captivity', target: 'ob-daesu', film: 'oldboy', relationship: 'imprisons', explanation: 'Dae-su is held for years without being told who ordered it or why.' },
    { source: 'ob-daesu', target: 'ob-release', film: 'oldboy', relationship: 'is abruptly freed in', explanation: 'His release gives him freedom but no explanation for the years he lost.' },
    { source: 'ob-release', target: 'ob-miha', film: 'oldboy', relationship: 'leads to', explanation: 'After release, Dae-su meets Mi-do, who helps him and becomes part of his search.' },
    { source: 'ob-daesu', target: 'ob-hunt', film: 'oldboy', relationship: 'begins', explanation: 'Dae-su follows clues to discover who imprisoned him and what motivated the act.' },
    { source: 'ob-miha', target: 'ob-hunt', film: 'oldboy', relationship: 'joins', explanation: 'Mi-do helps Dae-su pursue the clues and investigate the past.' },
    { source: 'ob-hunt', target: 'ob-woojin', film: 'oldboy', relationship: 'leads to', explanation: 'The search eventually brings Dae-su face to face with Woo-jin, the person behind the confinement.' },
    { source: 'ob-woojin', target: 'ob-ultimatum', film: 'oldboy', relationship: 'explains', explanation: 'Woo-jin reveals how an old school memory became the motive for his revenge.' },
    { source: 'ob-ultimatum', target: 'ob-twist', film: 'oldboy', relationship: 'reveals', explanation: 'The explanation exposes the engineered reunion and the family connection at its center.' },
    { source: 'oldboy', target: 'ob-daesu', film: 'oldboy', relationship: 'follows', explanation: 'Dae-su’s search for the reason behind his imprisonment drives the investigation.' },
    { source: 'oldboy', target: 'ob-woojin', film: 'oldboy', relationship: 'reveals antagonist', explanation: 'Woo-jin is connected to the captivity and controls the conditions of Dae-su’s search.' },
    { source: 'ob-daesu', target: 'ob-miha', film: 'oldboy', relationship: 'forms a bond', explanation: 'Mi-do helps Dae-su after his release, and their relationship becomes central to the final reveal.' },
    { source: 'ob-miha', target: 'ob-twist', film: 'oldboy', relationship: 'is reinterpreted by', explanation: 'The reveal changes the meaning of Dae-su and Mi-do’s relationship and exposes the design of Woo-jin’s revenge.' },
    { source: 'ob-woojin', target: 'ob-twist', film: 'oldboy', relationship: 'reveals', explanation: 'Woo-jin explains how he engineered the reunion and used the hidden family connection as revenge.' },

    // Inter-Film Cinematic Hub Bridges
    { source: 'sixth-sense', target: 'donnie-darko', isBridge: true },
    { source: 'donnie-darko', target: 'zodiac', isBridge: true },
    { source: 'zodiac', target: 'taxi-driver', isBridge: true },
    { source: 'taxi-driver', target: 'oldboy', isBridge: true },
    { source: 'oldboy', target: 'sixth-sense', isBridge: true }
  ]
};

const nodeColor = node => NODE_COLOR[node.type] || '#ffffff'

const buildNodeObject = node => {
  const color = nodeColor(node)
  const radius = node.size || 4
  const group = new THREE.Group()

  const coreMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: node.type === 'twist' ? 1.6 : 1.1,
    shininess: 120,
    transparent: true,
    opacity: 0.92,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), coreMat))

  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: node.type === 'film' ? 0.12 : 0.07,
    side: THREE.BackSide,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 2.6, 12, 12), haloMat))

  if (node.type === 'film') {
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.28 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 2, 0.5, 8, 32), ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
  }

  const sprite = new SpriteText(node.graphLabel || node.label)
  sprite.color = '#ffffff'
  sprite.textHeight = node.type === 'film' ? 14 : 11
  sprite.fontFamily = 'Inter, system-ui, sans-serif'
  sprite.fontWeight = node.type === 'film' || node.type === 'twist' ? '600' : '500'
  sprite.backgroundColor = 'rgba(3,0,20,0.76)'
  sprite.borderColor = color + (node.type === 'film' || node.type === 'twist' ? '70' : '45')
  sprite.borderWidth = 0.8
  sprite.borderRadius = 5
  sprite.padding = [3, 7]
  sprite.position.y = radius * 2 + 9
  group.add(sprite)

  return group
}

const linkColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.07)'
  const c = {
    'sixth-sense': 'rgba(0,242,254,0.38)',
    'donnie-darko': 'rgba(139,92,246,0.38)',
    zodiac: 'rgba(236,72,153,0.38)',
    'taxi-driver': 'rgba(251,146,60,0.38)',
    oldboy: 'rgba(217,70,239,0.38)',
  }
  return c[link.film] || 'rgba(255,255,255,0.42)'
}

const particleColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.2)'
  const c = { 'sixth-sense': '#00f2fe', 'donnie-darko': '#8b5cf6', 'zodiac': '#ec4899' }
  return c[link.film] || '#ffffff'
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))

const linkLabel = link => {
  const source = typeof link.source === 'object' ? link.source.label : link.source;
  const target = typeof link.target === 'object' ? link.target.label : link.target;
  const relationship = escapeHtml(link.relationship || 'connects to');
  const explanation = escapeHtml(link.explanation || 'This connection has not been explained yet.');
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:280px;padding:10px 12px;background:rgba(3,0,20,.96);border:1px solid rgba(139,92,246,.55);border-radius:10px;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.7)">
    <div style="font-size:11px;font-weight:700;color:#c4b5fd;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">${relationship}</div>
    <div style="font-size:12px;font-weight:600;margin-bottom:5px">${escapeHtml(source)} → ${escapeHtml(target)}</div>
    <div style="font-size:11px;line-height:1.45;color:#cbd5e1">${explanation}</div>
    <div style="font-size:9px;color:#64748b;margin-top:7px">Click for story details</div>
  </div>`;
}

const nodeLabel = node => {
  const color = NODE_COLOR[node.type] || '#fff'
  const canClick = node.type !== 'film'
  return `<div style="font-family:Inter,sans-serif;font-size:12px;color:#fff;background:rgba(3,0,20,0.92);border:1px solid ${color}28;border-radius:10px;padding:8px 12px;max-width:210px;box-shadow:0 4px 24px rgba(0,0,0,0.65)">
    <div style="font-weight:600;margin-bottom:3px">${node.label}</div>
    <div style="color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:${canClick ? '6px' : '0'}">${node.type}${node.filmName ? ' · ' + node.filmName : ''}</div>
    ${canClick ? `<div style="color:${color};font-size:10px;font-family:monospace;opacity:0.7">Click to reveal ↗</div>` : ''}
  </div>`
}

const TwistGraph3D = forwardRef((props, ref) => {
  const { 
    graphData,
    onMount, 
    onNodeClick: onNodeClickProp, 
    initialNode 
  } = props;
  const wrapperRef = useRef(null)
  const graphRef = useRef(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [ready, setReady] = useState(false)
  const [internalGraphData, setInternalGraphData] = useState(graphData || INITIAL_GRAPH_DATA);
  const [isMaximized, setIsMaximized] = useState(false);

  useImperativeHandle(ref, () => ({
    cameraPosition: (pos, target, time) => graphRef.current?.cameraPosition(pos, target, time),
    zoomToFit: (time) => graphRef.current?.zoomToFit(time),
    scene: () => graphRef.current?.scene()
  }));

  const toggleFullscreen = () => {
    setIsMaximized(prev => !prev);
  };

  const handleZoomIn = () => {
    zoomBy(0.78);
  };

  const handleZoomOut = () => {
    zoomBy(1.28);
  };

  const zoomBy = factor => {
    const graph = graphRef.current;
    if (!graph) return;
    const current = graph.cameraPosition();
    if (!current) return;
    const target = graph.controls()?.target || { x: 0, y: 0, z: 0 };
    const offset = { x: current.x - target.x, y: current.y - target.y, z: current.z - target.z };
    const distance = Math.hypot(offset.x, offset.y, offset.z);
    if (!distance) return;
    const nextDistance = Math.max(35, Math.min(1400, distance * factor));
    const scale = nextDistance / distance;
    graph.cameraPosition({
      x: target.x + offset.x * scale,
      y: target.y + offset.y * scale,
      z: target.z + offset.z * scale,
    }, target, 250);
  };

  const frameGraph = (nodes = internalGraphData.nodes, duration = 500) => {
    const graph = graphRef.current;
    const positionedNodes = nodes?.filter(node =>
      Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z));
    if (!graph || !positionedNodes?.length) return;

    const bounds = positionedNodes.reduce((result, node) => ({
      minX: Math.min(result.minX, node.x), maxX: Math.max(result.maxX, node.x),
      minY: Math.min(result.minY, node.y), maxY: Math.max(result.maxY, node.y),
      minZ: Math.min(result.minZ, node.z), maxZ: Math.max(result.maxZ, node.z),
      labelWidth: Math.max(result.labelWidth, ((node.graphLabel || node.label)?.length || 0) * 5.5),
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity, labelWidth: 0 });
    const center = {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
      z: (bounds.minZ + bounds.maxZ) / 2,
    };
    const camera = graph.camera();
    const halfFov = THREE.MathUtils.degToRad((camera?.fov || 60) / 2);
    const tanHalfFov = Math.tan(halfFov);
    const aspect = Math.max(0.5, dims.w / Math.max(1, dims.h));
    const width = bounds.maxX - bounds.minX + bounds.labelWidth + 36;
    const height = bounds.maxY - bounds.minY + 90;
    const depth = bounds.maxZ - bounds.minZ + 40;
    const distance = Math.max(
      width / (2 * tanHalfFov * aspect * 0.82),
      height / (2 * tanHalfFov * 0.82),
      depth * 1.6,
      70,
    );

    graph.cameraPosition({ x: center.x, y: center.y, z: center.z + distance }, center, duration);
  };

  useEffect(() => {
    // Let DOM finalize structural adjustments before re-centering
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.resizeHandler();
        frameGraph(internalGraphData.nodes, 600);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isMaximized]);

  useEffect(() => {
    setInternalGraphData(graphData || INITIAL_GRAPH_DATA);
    const timer = setTimeout(() => {
      graphRef.current?.d3ReheatSimulation();
      frameGraph(graphData?.nodes || INITIAL_GRAPH_DATA.nodes, 500);
    }, 50);
    return () => clearTimeout(timer);
  }, [graphData]);

  useEffect(() => {
    const timer = setTimeout(() => frameGraph(internalGraphData.nodes, 350), 80);
    return () => clearTimeout(timer);
  }, [dims, isMaximized]);


  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setDims({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleEngineStop = useCallback(() => {
    if (!graphRef.current || ready) return
    const scene = graphRef.current.scene()
    scene.add(new THREE.AmbientLight(0x1a0033, 2.5))
    const cl = new THREE.PointLight(0x00f2fe, 2.5, 200); cl.position.set(60, 80, 60); scene.add(cl)
    const vl = new THREE.PointLight(0x7c3aed, 2.0, 200); vl.position.set(-80, -40, -60); scene.add(vl)
    const pl = new THREE.PointLight(0xec4899, 1.5, 160); pl.position.set(0, -80, 80); scene.add(pl)
    setReady(true)
    if (onMount) onMount()
  }, [ready, onMount])

  useEffect(() => {
    if (ready && initialNode && graphRef.current) {
      setTimeout(() => {
        const node = internalGraphData.nodes.find(n => n.id === initialNode)
        if (node) {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            1200
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }
      }, 500)
    }
  }, [ready, initialNode, onNodeClickProp])

  const pan = useCallback((direction) => {
    if (!graphRef.current) return
    const cam = graphRef.current.cameraPosition()
    const controls = graphRef.current.controls()
    const target = controls ? controls.target : { x: 0, y: 0, z: 0 }
    const step = 20
    const delta = direction === 'left' ? -step : step
    graphRef.current.cameraPosition(
      { x: cam.x + delta, y: cam.y, z: cam.z },
      { x: target.x + delta, y: target.y, z: target.z },
      200
    )
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        pan('left')
      } else if (e.key === 'ArrowRight') {
        pan('right')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pan])

  return (
    <div ref={wrapperRef} className={isMaximized ? "fixed inset-0 w-screen h-screen z-50 bg-[#030014]" : "relative w-full h-full"}>
      
      {/* Viewport Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button 
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Toggle Fullscreen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMaximized ? (
              <>
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </>
            ) : (
              <>
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </>
            )}
          </svg>
        </button>
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-cyan-400/30 border-t-cyan-400"
              style={{ animation: 'spin 1s linear infinite' }} />
            <span className="text-[11px] font-mono text-slate-600">Initializing graph engine…</span>
          </div>
        </div>
      )}



      <ForceGraph3D
        ref={graphRef}
        width={dims.w}
        height={dims.h}
        graphData={internalGraphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel={nodeLabel}
        nodeColor={nodeColor}
        nodeRelSize={1}
        nodeThreeObject={buildNodeObject}
        nodeThreeObjectExtend={false}
        linkLabel={linkLabel}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => link.isBridge ? 0.5 : 2.6}
        linkHoverPrecision={6}
        linkDirectionalParticles={link => link.isBridge ? 0 : 1}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={particleColor}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.25}
        warmupTicks={120}
        cooldownTicks={0}
        onEngineStop={handleEngineStop}
        onNodeHover={node => { if (wrapperRef.current) wrapperRef.current.style.cursor = node ? 'pointer' : 'grab' }}
        onNodeClick={node => {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current?.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            800,
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }}
        onLinkClick={link => props.onLinkClick?.(link)}
        rendererConfig={{ antialias: true, alpha: true }}
        showNavInfo={false}
      />
    </div>
  );
});

export default TwistGraph3D;
