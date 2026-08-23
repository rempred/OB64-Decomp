'use strict';

const { digest } = require('./target_model');
const {
  registerNormalizedRepresentation,
  relocationNormalizedRepresentation,
  structuralRepresentation,
} = require('./mips_analysis');
const { requestStore } = require('./store');
const { syncTargets } = require('./compiler');

function collisionSafeGroups(items, tier, representationFor, indexDigest = digest) {
  const indexes = new Map();
  for (const item of items) {
    const representation = representationFor(item);
    const index = indexDigest(representation);
    const buckets = indexes.get(index) || [];
    let bucket = buckets.find((candidate) => candidate.representation === representation);
    if (!bucket) {
      bucket = { representation, members: [] };
      buckets.push(bucket);
      indexes.set(index, buckets);
    }
    bucket.members.push(item);
  }
  const groups = [];
  for (const buckets of indexes.values()) {
    for (const bucket of buckets) {
      if (bucket.members.length < 2) continue;
      bucket.members.sort((left, right) => left.romStart - right.romStart || left.symbol.localeCompare(right.symbol));
      const groupId = digest({
        schemaVersion: 1,
        tier,
        representation: bucket.representation,
        members: bucket.members.map((target) => target.targetId),
      });
      groups.push({
        groupId,
        tier,
        representation: bucket.representation,
        members: bucket.members.map((target) => target.targetId),
        metadata: {
          representationSha256: digest(bucket.representation),
          symbols: bucket.members.map((target) => target.symbol),
          minimumBytes: Math.min(...bucket.members.map((target) => target.bytes)),
          maximumBytes: Math.max(...bucket.members.map((target) => target.bytes)),
          normalization: tier === 'exact'
            ? 'none; every byte is equal'
            : tier === 'relocation-normalized'
              ? 'external J/JAL target fields only; HI/LO relocation intent is not inferred from raw bytes'
              : tier === 'register-normalized'
                ? 'consistent first-use GPR renaming with external control targets ignored'
                : 'delay-slot-aware CFG shape and opcode sequence',
          evidenceBoundary: tier === 'exact'
            ? 'Exact bytes still represent distinct physical placements and require separate promotion.'
            : 'Structural family membership is a research lead, not source or semantic equivalence.',
        },
      });
    }
  }
  groups.sort((left, right) => left.tier.localeCompare(right.tier)
    || right.members.length - left.members.length || left.groupId.localeCompare(right.groupId));
  return groups;
}

function buildFamilyAtlas(workbench, options = {}) {
  const storeOptions = options.storeOptions || {};
  syncTargets(workbench, storeOptions);
  const tiers = [
    ['exact', (target) => target.expectedBytes.toString('hex')],
    ['relocation-normalized', (target) => relocationNormalizedRepresentation(target.expectedBytes, target.vramStart)],
    ['register-normalized', (target) => registerNormalizedRepresentation(target.expectedBytes, target.vramStart, { ignoreExternalTargets: true })],
    ['structural', (target) => structuralRepresentation(target.expectedBytes, target.vramStart)],
  ];
  const groups = tiers.flatMap(([tier, representation]) => collisionSafeGroups(workbench.targets, tier, representation, options.indexDigest));
  const stored = requestStore({ action: 'replace_families', modelId: workbench.modelId, groups }, storeOptions);
  const counts = {};
  for (const [tier] of tiers) {
    const selected = groups.filter((group) => group.tier === tier);
    counts[tier] = {
      groups: selected.length,
      members: selected.reduce((sum, group) => sum + group.members.length, 0),
      additionalMembers: selected.reduce((sum, group) => sum + group.members.length - 1, 0),
    };
  }
  return { schemaVersion: 1, modelId: workbench.modelId, counts, stored, groups };
}

module.exports = { buildFamilyAtlas, collisionSafeGroups };
