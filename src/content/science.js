// src/content/science.js
export const pack = {
  id: 'science',
  type: 'science',
  title: 'Science Sprouts',
  modes: [
    { key: 'vocab', label: 'Vocab' },
    { key: 'labs', label: 'Mini Labs' },
    { key: 'facts', label: 'True Facts' }
  ],
  themes: ['garden', 'ocean', 'space'],
  difficulties: ['beginner', 'intermediate', 'advanced'],

  banks: {
    vocab: {
      garden: {
        beginner: [
          { term: 'seed', def: 'A tiny start of a plant.' },
          { term: 'root', def: 'The part of a plant that takes in water.' },
          { term: 'leaf', def: 'The green part that helps a plant make food.' },
          { term: 'soil', def: 'Dirt that plants grow in.' },
          { term: 'sun', def: 'A star that gives Earth light and heat.' }
        ],
        intermediate: [
          { term: 'habitat', def: 'A place where a living thing lives.' },
          { term: 'sprout', def: 'A baby plant just starting to grow.' },
          { term: 'nectar', def: 'Sweet liquid in flowers that insects drink.' },
          { term: 'pollen', def: 'Tiny dust from flowers used to make seeds.' },
          { term: 'camouflage', def: 'Colors or patterns that help hide an animal.' }
        ],
        advanced: [
          { term: 'photosynthesis', def: 'How plants make food using sunlight.' },
          { term: 'pollination', def: 'When pollen moves to help a plant make seeds.' },
          { term: 'ecosystem', def: 'Living things and their environment working together.' },
          { term: 'adaptation', def: 'A body feature that helps a living thing survive.' },
          { term: 'decomposer', def: 'A living thing that breaks down dead plants and animals.' }
        ]
      },
      ocean: {
        beginner: [
          { term: 'fish', def: 'An animal that lives in water and has gills.' },
          { term: 'reef', def: 'A home for sea animals made by tiny creatures.' },
          { term: 'wave', def: 'Moving water on the surface of the ocean.' },
          { term: 'shell', def: 'A hard covering some sea animals have.' },
          { term: 'salt', def: 'Something found in ocean water that makes it salty.' }
        ],
        intermediate: [
          { term: 'current', def: 'A river-like flow of ocean water.' },
          { term: 'predator', def: 'An animal that hunts other animals for food.' },
          { term: 'prey', def: 'An animal that gets hunted by another animal.' },
          { term: 'plankton', def: 'Tiny living things floating in water.' },
          { term: 'buoyancy', def: 'How well something floats in water.' }
        ],
        advanced: [
          { term: 'salinity', def: 'How much salt is in water.' },
          { term: 'bioluminescence', def: 'Light made by living things.' },
          { term: 'migration', def: 'When animals travel to a new place each season.' },
          { term: 'pressure', def: 'A pushing force; it increases deep in the ocean.' },
          { term: 'food web', def: 'How living things are connected by who eats who.' }
        ]
      },
      space: {
        beginner: [
          { term: 'star', def: 'A giant ball of hot gas that shines.' },
          { term: 'moon', def: 'A rocky object that orbits a planet.' },
          { term: 'planet', def: 'A large round object that orbits a star.' },
          { term: 'rocket', def: 'A vehicle that can travel into space.' },
          { term: 'orbit', def: 'A curved path around something in space.' }
        ],
        intermediate: [
          { term: 'gravity', def: 'The force that pulls things toward each other.' },
          { term: 'asteroid', def: 'A rocky object that orbits the Sun.' },
          { term: 'comet', def: 'An icy object that can grow a tail near the Sun.' },
          { term: 'galaxy', def: 'A huge group of stars, dust, and gas.' },
          { term: 'telescope', def: 'A tool that helps us see far-away space objects.' }
        ],
        advanced: [
          { term: 'atmosphere', def: 'The layer of gases around a planet.' },
          { term: 'constellation', def: 'A pattern of stars we name.' },
          { term: 'black hole', def: 'A place with gravity so strong light cannot escape.' },
          { term: 'solar system', def: 'The Sun and everything that orbits it.' },
          { term: 'astronaut', def: 'A person trained to travel and work in space.' }
        ]
      }
    },

    labs: {
      garden: [
        { q: 'Plants need {__} to make food.', a: 'sunlight', d: ['snow', 'rocks'] },
        { q: 'A seed needs {__} to start growing.', a: 'water', d: ['candy', 'glue'] },
        { q: 'Bees help flowers by moving {__}.', a: 'pollen', d: ['paper', 'sand'] },
        { q: 'Worms help soil by making it {__}.', a: 'loose', d: ['hard', 'invisible'] }
      ],
      ocean: [
        { q: 'A life jacket helps you {__}.', a: 'float', d: ['sink', 'explode'] },
        { q: 'Many fish breathe using {__}.', a: 'gills', d: ['wheels', 'leaves'] },
        { q: 'Ocean water tastes salty because it has {__}.', a: 'salt', d: ['sugar', 'pepper'] },
        { q: 'A reef is like a {__} for sea animals.', a: 'home', d: ['mirror', 'shoe'] }
      ],
      space: [
        { q: 'The force that keeps us on Earth is {__}.', a: 'gravity', d: ['music', 'magic'] },
        { q: 'The Sun is a {__}.', a: 'star', d: ['planet', 'rock'] },
        { q: 'A moon travels around a {__}.', a: 'planet', d: ['cloud', 'tree'] },
        { q: 'A rocket needs strong {__} to lift off.', a: 'push', d: ['whispers', 'shadows'] }
      ]
    },

    facts: {
      garden: {
        beginner: [
          { t: 'Plants need water to grow.', f1: 'Plants grow best in fire.', f2: 'Plants are made of glass.' },
          { t: 'Insects can help flowers.', f1: 'Insects are made of stone.', f2: 'Flowers can talk to phones.' }
        ],
        intermediate: [
          { t: 'Some animals use camouflage to hide.', f1: 'Camouflage makes animals louder.', f2: 'Camouflage turns animals into rocks instantly.' },
          { t: 'A habitat is where an animal lives.', f1: 'A habitat is a type of snack.', f2: 'A habitat is only found on the Moon.' }
        ],
        advanced: [
          { t: 'Decomposers break down dead plants and animals.', f1: 'Decomposers make things last forever.', f2: 'Decomposers only live in space.' },
          { t: 'Ecosystems include living things and their environment.', f1: 'Ecosystems are only inside computers.', f2: 'Ecosystems have no plants.' }
        ]
      },
      ocean: {
        beginner: [
          { t: 'Many sea animals live near reefs.', f1: 'Reefs are made of cotton candy.', f2: 'Reefs are only found in deserts.' },
          { t: 'Waves move on the surface of water.', f1: 'Waves only happen in sand.', f2: 'Waves are made of metal.' }
        ],
        intermediate: [
          { t: 'A current is moving ocean water.', f1: 'A current is a sea monster.', f2: 'A current is a type of shell.' },
          { t: 'Predators hunt prey for food.', f1: 'Predators only eat rocks.', f2: 'Prey always hunts predators.' }
        ],
        advanced: [
          { t: 'Pressure increases deep in the ocean.', f1: 'Pressure disappears underwater.', f2: 'Deep water has no forces.' },
          { t: 'Salinity means how much salt is in water.', f1: 'Salinity means how fast a fish swims.', f2: 'Salinity means the color of water.' }
        ]
      },
      space: {
        beginner: [
          { t: 'The Moon orbits Earth.', f1: 'Earth orbits the Moon every day.', f2: 'The Moon is made of cheese.' },
          { t: 'A planet orbits a star.', f1: 'A star orbits a planet like a yo-yo.', f2: 'Planets only live in oceans.' }
        ],
        intermediate: [
          { t: 'Gravity pulls objects together.', f1: 'Gravity pushes everything away forever.', f2: 'Gravity is a kind of food.' },
          { t: 'A telescope helps us see far-away space objects.', f1: 'A telescope is used to dig holes.', f2: 'A telescope is a type of shoe.' }
        ],
        advanced: [
          { t: 'An atmosphere is a layer of gases around a planet.', f1: 'An atmosphere is a kind of asteroid.', f2: 'An atmosphere is only inside a bottle.' },
          { t: 'A solar system includes a star and orbiting objects.', f1: 'A solar system is one single planet.', f2: 'A solar system is a type of cloud.' }
        ]
      }
    }
  }
};

// Extract named exports for App.js
export const SCIENCE_VOCAB = pack.banks.vocab;
export const SCIENCE_LABS = pack.banks.labs;
export const SCIENCE_FACTS = pack.banks.facts;
export const SCIENCE_MODES = pack.modes;
