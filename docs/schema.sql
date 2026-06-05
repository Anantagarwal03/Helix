-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  HELIX — Narrative Twist Visualizer                                  ║
-- ║  Database Schema  v1.0                                               ║
-- ║                                                                      ║
-- ║  Design principles:                                                  ║
-- ║  · Lean — only essential attributes per entity                       ║
-- ║  · Characters carry NO address fields (omitted by spec)             ║
-- ║  · character_events uses a composite PK — no surrogate ID           ║
-- ║  · Supports a growing library of films without schema changes        ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ──────────────────────────────────────────────────────────────────────────
-- Extension: ensure pgcrypto is available for gen_random_uuid() if needed
-- ──────────────────────────────────────────────────────────────────────────
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ══════════════════════════════════════════════════════════════════════════
-- 1. MOVIES
--    Core reference table — one row per indexed film.
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE movies (
    id           SERIAL          PRIMARY KEY,
    title        VARCHAR(255)    NOT NULL,
    slug         VARCHAR(255)    NOT NULL UNIQUE,   -- URL-safe identifier
    release_year SMALLINT        NOT NULL,
    director     VARCHAR(255),
    runtime_min  SMALLINT,                          -- running time in minutes
    synopsis     TEXT,
    twist_score  NUMERIC(3,1)    CHECK (twist_score BETWEEN 0.0 AND 10.0),
    twist_type   VARCHAR(100),                      -- primary narrative twist category
    created_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Seed: the three initial films
INSERT INTO movies (title, slug, release_year, director, runtime_min, synopsis, twist_score, twist_type) VALUES
    ('The Sixth Sense', 'sixth-sense', 1999, 'M. Night Shyamalan', 107,
     'A child psychologist discovers that his patient can see and communicate with the dead.',
     9.8, 'Identity Reveal'),
    ('Donnie Darko', 'donnie-darko', 2001, 'Richard Kelly', 113,
     'A troubled teenager navigates visions of a giant rabbit that manipulate him through a fractured timeline.',
     9.4, 'Temporal Loop'),
    ('Zodiac', 'zodiac', 2007, 'David Fincher', 157,
     'A San Francisco cartoonist becomes obsessed with identifying the Zodiac Killer.',
     8.7, 'Unreliable Reality');


-- ══════════════════════════════════════════════════════════════════════════
-- 2. CHARACTERS
--    Story actors — protagonists, antagonists, and supporting roles.
--    NOTE: No address fields per spec.
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE characters (
    id           SERIAL          PRIMARY KEY,
    movie_id     INT             NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    name         VARCHAR(255)    NOT NULL,
    role         VARCHAR(50)     NOT NULL                        -- 'protagonist' | 'antagonist' | 'supporting' | 'unknown'
                 CHECK (role IN ('protagonist','antagonist','supporting','unknown')),
    is_twist_key BOOLEAN         NOT NULL DEFAULT FALSE,         -- TRUE if this character IS part of the twist reveal
    notes        TEXT                                            -- brief character description / motivation
);

CREATE INDEX idx_characters_movie ON characters(movie_id);

-- Seed
INSERT INTO characters (movie_id, name, role, is_twist_key, notes) VALUES
    (1, 'Malcolm Crowe',    'protagonist', TRUE,  'Child psychologist — his true status is the central twist.'),
    (1, 'Cole Sear',        'protagonist', FALSE, 'Eight-year-old boy who sees dead people.'),
    (1, 'Anna Crowe',       'supporting',  FALSE, 'Malcolm''s wife, increasingly distant.'),
    (2, 'Donnie Darko',     'protagonist', FALSE, 'Troubled teenager navigating a dying tangent universe.'),
    (2, 'Frank',            'antagonist',  TRUE,  'Demonic rabbit figure who guides Donnie through time.'),
    (2, 'Roberta Sparrow',  'supporting',  FALSE, 'Author of "The Philosophy of Time Travel".'),
    (3, 'Robert Graysmith', 'protagonist', FALSE, 'Cartoonist turned amateur Zodiac detective.'),
    (3, 'Det. David Toschi','supporting',  FALSE, 'SFPD inspector leading the official investigation.'),
    (3, 'Arthur Leigh Allen','unknown',    TRUE,  'Prime suspect — identity never definitively confirmed.');


-- ══════════════════════════════════════════════════════════════════════════
-- 3. EVENTS
--    Discrete story beats — scenes, reveals, and catalysts.
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE events (
    id           SERIAL          PRIMARY KEY,
    movie_id     INT             NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    title        VARCHAR(255)    NOT NULL,
    description  TEXT,
    act          SMALLINT        CHECK (act IN (1,2,3)),        -- narrative act (1, 2, or 3)
    is_twist     BOOLEAN         NOT NULL DEFAULT FALSE,        -- TRUE if this IS the twist beat
    story_offset INTERVAL,                                      -- approximate runtime position (e.g. '01:47:00')
    sequence_no  SMALLINT                                       -- ordering within the act
);

CREATE INDEX idx_events_movie ON events(movie_id);
CREATE INDEX idx_events_twist ON events(movie_id, is_twist);

-- Seed
INSERT INTO events (movie_id, title, description, act, is_twist, story_offset, sequence_no) VALUES
    -- The Sixth Sense
    (1, 'Malcolm''s Shooting',    'Vincent Grey shoots Malcolm in his home.', 1, FALSE, '00:07:00', 1),
    (1, 'First Patient Session',  'Malcolm meets Cole and hears "I see dead people".', 1, FALSE, '00:22:00', 2),
    (1, 'Basement Confrontation', 'Cole faces the ghost in the kitchen.', 2, FALSE, '00:47:00', 3),
    (1, 'Identity Reveal',        'Malcolm realizes he has been dead the entire film.', 3, TRUE,  '01:38:00', 4),

    -- Donnie Darko
    (2, 'Frank Appears',          'Frank tells Donnie the world will end in 28 days.', 1, FALSE, '00:08:00', 1),
    (2, 'Engine Falls on House',  'A jet engine crashes through Donnie''s bedroom.', 1, FALSE, '00:10:00', 2),
    (2, 'Time Portal Discovery',  'Donnie witnesses a liquid time-jet from his chest.', 2, FALSE, '01:01:00', 3),
    (2, 'Tangent Universe Closes','Donnie sends the engine back, erasing the timeline.', 3, TRUE,  '01:46:00', 4),

    -- Zodiac
    (3, 'Lake Berryessa Attack',  'The Zodiac attacks two victims at the lake.', 1, FALSE, '00:28:00', 1),
    (3, 'Cipher Published',       'The San Francisco Chronicle publishes the cipher.', 1, FALSE, '00:18:00', 2),
    (3, 'Graysmith''s Obsession', 'Graysmith works the case long after police give up.', 2, FALSE, '01:30:00', 3),
    (3, 'Final Confrontation',    'Graysmith believes he has identified the Zodiac — but proof remains elusive.', 3, TRUE, '02:31:00', 4);


-- ══════════════════════════════════════════════════════════════════════════
-- 4. CHARACTER_EVENTS  (junction table)
--    Maps which characters are involved in which events, and how.
--
--    Design note: composite PK only — no surrogate/tracking ID per spec.
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE character_events (
    character_id INT          NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    event_id     INT          NOT NULL REFERENCES events(id)     ON DELETE CASCADE,
    involvement  VARCHAR(50)  NOT NULL DEFAULT 'witness'
                 CHECK (involvement IN ('witness','perpetrator','victim','catalyst','observer')),
    PRIMARY KEY (character_id, event_id)     -- composite key — no surrogate ID
);

-- Seed
INSERT INTO character_events (character_id, event_id, involvement) VALUES
    -- Sixth Sense
    (1, 1, 'victim'),       -- Malcolm shot
    (1, 2, 'witness'),      -- Malcolm meets Cole
    (2, 2, 'catalyst'),     -- Cole reveals his ability
    (2, 3, 'victim'),       -- Cole in basement
    (1, 4, 'catalyst'),     -- Malcolm realizes truth
    (2, 4, 'witness'),      -- Cole witnesses Malcolm's realization

    -- Donnie Darko
    (4, 5, 'witness'),      -- Donnie sees Frank
    (5, 5, 'catalyst'),     -- Frank delivers the message
    (4, 6, 'victim'),       -- Donnie avoids engine
    (4, 7, 'witness'),      -- Donnie sees time portal
    (4, 8, 'catalyst'),     -- Donnie closes the loop
    (5, 8, 'perpetrator'),  -- Frank is revealed

    -- Zodiac
    (7, 9,  'witness'),     -- Graysmith hears of attack
    (8, 10, 'witness'),     -- Toschi reads cipher
    (7, 11, 'catalyst'),    -- Graysmith obsesses
    (7, 12, 'catalyst'),    -- Graysmith confronts belief
    (9, 12, 'perpetrator'); -- Allen as prime suspect


-- ══════════════════════════════════════════════════════════════════════════
-- 5. HELPFUL VIEWS
-- ══════════════════════════════════════════════════════════════════════════

-- Full narrative graph: all character-event relationships with movie context
CREATE VIEW v_narrative_graph AS
SELECT
    m.title                                     AS movie,
    m.twist_type,
    c.name                                      AS character,
    c.role                                      AS character_role,
    e.title                                     AS event,
    e.act,
    e.is_twist,
    e.story_offset,
    ce.involvement
FROM character_events ce
JOIN characters c ON c.id = ce.character_id
JOIN events     e ON e.id = ce.event_id
JOIN movies     m ON m.id = e.movie_id
ORDER BY m.id, e.act, e.sequence_no;

-- Twist nodes only — for the graph engine to highlight
CREATE VIEW v_twist_nodes AS
SELECT
    m.title     AS movie,
    e.title     AS twist_event,
    e.act,
    e.story_offset,
    c.name      AS key_character,
    ce.involvement
FROM events e
JOIN movies         m  ON m.id  = e.movie_id
JOIN character_events ce ON ce.event_id = e.id
JOIN characters      c  ON c.id = ce.character_id
WHERE e.is_twist = TRUE
ORDER BY m.id;
