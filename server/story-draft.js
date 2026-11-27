export const STORY_MAP_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    twistType: { type: 'string' },
    nodes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          label: { type: 'string' },
          graphLabel: { type: 'string' },
          type: { type: 'string', enum: ['character', 'event', 'twist'] },
          spoilerLevel: { type: 'integer', enum: [0, 1, 2] },
          timelineOrder: { type: 'integer' },
          timelineStage: { type: 'string' },
          revealText: { type: 'string' },
          revealSubtext: { type: 'string' },
          revealClassification: { type: 'string' },
          sourceIndexes: { type: 'array', items: { type: 'integer' } },
        },
        required: ['label', 'graphLabel', 'type', 'spoilerLevel', 'timelineOrder', 'timelineStage', 'revealText', 'revealSubtext', 'revealClassification', 'sourceIndexes'],
      },
    },
    links: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          sourceIndex: { type: 'integer' },
          targetIndex: { type: 'integer' },
          relationship: { type: 'string' },
          explanation: { type: 'string' },
          spoilerLevel: { type: 'integer', enum: [0, 1, 2] },
        },
        required: ['sourceIndex', 'targetIndex', 'relationship', 'explanation', 'spoilerLevel'],
      },
    },
  },
  required: ['summary', 'twistType', 'nodes', 'links'],
};

export function validateStoryDraft(draft, sourceCount) {
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) return 'The model did not return a JSON object.';
  if (typeof draft.summary !== 'string' || !draft.summary.trim() || typeof draft.twistType !== 'string' || !draft.twistType.trim()) {
    return 'The draft is missing its summary or reveal type.';
  }
  if (!Array.isArray(draft.nodes) || draft.nodes.length < 10 || draft.nodes.length > 14) {
    return `The draft returned ${Array.isArray(draft.nodes) ? draft.nodes.length : 0} story beats; it needs 10 to 14.`;
  }
  if (!Array.isArray(draft.links) || draft.links.length < draft.nodes.length - 1 || draft.links.length > 28) {
    return `The draft needs at least ${draft.nodes.length - 1} valid story connections.`;
  }

  const counts = { character: 0, event: 0, twist: 0 };
  for (const node of draft.nodes) {
    if (!node || typeof node !== 'object') return 'A story beat is malformed.';
    if (!['character', 'event', 'twist'].includes(node.type)) return 'A story beat has an invalid type.';
    counts[node.type] += 1;
    if (typeof node.label !== 'string' || !node.label.trim() || node.label.length > 90
      || typeof node.graphLabel !== 'string' || !node.graphLabel.trim() || node.graphLabel.length > 22
      || ![0, 1, 2].includes(node.spoilerLevel)
      || !Number.isSafeInteger(node.timelineOrder) || node.timelineOrder < 1
      || typeof node.timelineStage !== 'string' || !node.timelineStage.trim()
      || typeof node.revealText !== 'string' || !node.revealText.trim()
      || typeof node.revealSubtext !== 'string' || !node.revealSubtext.trim()
      || typeof node.revealClassification !== 'string' || !node.revealClassification.trim()
      || !Array.isArray(node.sourceIndexes) || node.sourceIndexes.length < 1
      || node.sourceIndexes.some(index => !Number.isSafeInteger(index) || index < 0 || index >= sourceCount)) {
      return 'A story beat is missing required details or valid source citations.';
    }
  }
  if (counts.character < 2 || counts.event < 6 || counts.twist < 1) {
    return `The draft needs at least 2 characters, 6 events, and 1 reveal; it returned ${counts.character}, ${counts.event}, and ${counts.twist}.`;
  }

  const neighbors = draft.nodes.map(() => new Set());
  for (const link of draft.links) {
    if (!link || !Number.isSafeInteger(link.sourceIndex) || !Number.isSafeInteger(link.targetIndex)
      || link.sourceIndex < 0 || link.targetIndex < 0
      || link.sourceIndex >= draft.nodes.length || link.targetIndex >= draft.nodes.length
      || link.sourceIndex === link.targetIndex
      || typeof link.relationship !== 'string' || !link.relationship.trim()
      || typeof link.explanation !== 'string' || !link.explanation.trim()
      || ![0, 1, 2].includes(link.spoilerLevel)) {
      return 'A story connection is malformed or points to a missing beat.';
    }
    neighbors[link.sourceIndex].add(link.targetIndex);
    neighbors[link.targetIndex].add(link.sourceIndex);
  }

  const visited = new Set();
  const queue = [draft.nodes.findIndex(node => node.type === 'character')];
  while (queue.length) {
    const index = queue.shift();
    if (visited.has(index)) continue;
    visited.add(index);
    for (const neighbor of neighbors[index]) queue.push(neighbor);
  }
  if (visited.size !== draft.nodes.length) return 'Some story beats are disconnected from the main story.';
  return null;
}

export async function requestValidatedStoryDraft({ request, messages, sourceCount, maxAttempts = 3, onSchemaFallback = () => {} }) {
  let responseFormat = {
    type: 'json_schema',
    json_schema: { name: 'helix_movie_story_map', strict: true, schema: STORY_MAP_SCHEMA },
  };
  let draft;
  let error = '';

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let response;
    let transientRetry = 0;
    while (true) {
      try {
        response = await request(responseFormat, messages);
        break;
      } catch (requestError) {
        if (requestError.response?.status === 400 && responseFormat.type === 'json_schema') {
          onSchemaFallback(requestError);
          responseFormat = { type: 'json_object' };
          continue;
        }
        const status = requestError.response?.status;
        const retryableStatus = [408, 500, 502, 503, 504].includes(status);
        const retryableNetworkError = ['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET'].includes(requestError.code);
        if (transientRetry >= 2 || (!retryableStatus && !retryableNetworkError)) throw requestError;
        await new Promise(resolve => setTimeout(resolve, 500 * (2 ** transientRetry)));
        transientRetry += 1;
      }
    }

    const output = response.data?.choices?.[0]?.message?.content;
    if (!output) {
      error = 'The model returned an empty response.';
    } else {
      try {
        draft = JSON.parse(output);
        error = validateStoryDraft(draft, sourceCount) || '';
      } catch {
        error = 'The model response was not valid JSON.';
      }
    }
    if (!error) return { draft, error: '' };

    if (attempt < maxAttempts - 1) {
      if (output) messages.push({ role: 'assistant', content: output });
      messages.push({
        role: 'user',
        content: `The previous response failed Helix's story-map checks: ${error} Return a complete corrected JSON object now. Keep all source indexes within 0 and ${sourceCount - 1}.`,
      });
    }
  }

  return { draft: null, error };
}
