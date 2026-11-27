/* global process */
import { STORY_GRAPHS, validateStoryGraphs } from '../src/data/storyGraphs.js';

const errors = validateStoryGraphs(STORY_GRAPHS);
if (errors.length) {
  console.error(`Story-map validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${Object.keys(STORY_GRAPHS).length} story maps.`);
}
