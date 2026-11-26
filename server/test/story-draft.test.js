import test from 'node:test';
import assert from 'node:assert/strict';
import { requestValidatedStoryDraft, validateStoryDraft } from '../story-draft.js';

const makeDraft = () => {
  const types = ['character', 'character', 'event', 'event', 'event', 'event', 'event', 'event', 'twist', 'twist'];
  return {
    summary: 'A sourced story summary.',
    twistType: 'Identity reveal',
    nodes: types.map((type, index) => ({
      label: `Story beat ${index + 1}`,
      graphLabel: `Beat ${index + 1}`,
      type,
      spoilerLevel: type === 'twist' ? 2 : 1,
      timelineOrder: index + 1,
      timelineStage: 'Turning point',
      revealText: `Specific reveal ${index + 1}.`,
      revealSubtext: `Supported context for beat ${index + 1}.`,
      revealClassification: type,
      sourceIndexes: [0],
    })),
    links: types.slice(1).map((_, index) => ({
      sourceIndex: index,
      targetIndex: index + 1,
      relationship: 'causes',
      explanation: 'One event leads to the next.',
      spoilerLevel: 1,
    })),
  };
};

test('accepts a complete connected story draft with valid citations', () => {
  assert.equal(validateStoryDraft(makeDraft(), 4), null);
});

test('rejects short drafts and invalid citations', () => {
  const tooShort = makeDraft();
  tooShort.nodes.pop();
  assert.match(validateStoryDraft(tooShort, 4), /10 to 14/);

  const invalidSource = makeDraft();
  invalidSource.nodes[0].sourceIndexes = [4];
  assert.match(validateStoryDraft(invalidSource, 4), /valid source citations/);
});

test('rejects disconnected story beats and malformed connections', () => {
  const disconnected = makeDraft();
  disconnected.links[4] = { ...disconnected.links[0] };
  assert.match(validateStoryDraft(disconnected, 4), /disconnected/);

  const malformed = makeDraft();
  malformed.links[0].targetIndex = 100;
  assert.match(validateStoryDraft(malformed, 4), /connection is malformed/);
});

test('falls back to JSON mode after Groq rejects strict schema mode', async () => {
  const formats = [];
  const result = await requestValidatedStoryDraft({
    messages: [],
    sourceCount: 4,
    request: async responseFormat => {
      formats.push(responseFormat.type);
      if (responseFormat.type === 'json_schema') {
        const error = new Error('Schema request rejected');
        error.response = { status: 400 };
        throw error;
      }
      return { data: { choices: [{ message: { content: JSON.stringify(makeDraft()) } }] } };
    },
  });
  assert.deepEqual(formats, ['json_schema', 'json_object']);
  assert.equal(result.error, '');
  assert.equal(result.draft.nodes.length, 10);
});

test('automatically asks the model to correct drafts that fail validation', async () => {
  const messages = [];
  let requests = 0;
  const result = await requestValidatedStoryDraft({
    messages,
    sourceCount: 4,
    request: async () => {
      requests += 1;
      const draft = makeDraft();
      if (requests === 1) draft.nodes.pop();
      return { data: { choices: [{ message: { content: JSON.stringify(draft) } }] } };
    },
  });
  assert.equal(requests, 2);
  assert.equal(result.error, '');
  assert.match(messages.at(-1).content, /failed Helix's story-map checks/);
});
