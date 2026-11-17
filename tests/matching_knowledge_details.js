'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { loadLessons, selectKnowledge } = require('../tools/lib/matching/knowledge');

async function run() {
  const original = loadLessons();
  assert.equal(original.status, 'available');
  const temporary = fs.mkdtempSync(path.join(ROOT, 'build/knowledge-details-'));
  const indexPath = path.join(temporary, 'lessons.json');
  try {
    const lessons = Array.from({ length: 5 }, (_, index) => ({
      ...original.lessons[0], id: `detail-fixture-${index}`,
      symptoms: ['register-allocation'], references: [], observations: [],
    }));
    fs.writeFileSync(indexPath, JSON.stringify({ schemaVersion: 1, lessons }));
    const workbench = { targets: [] };
    const target = { symbol: 'detail_fixture' };
    const options = { indexPath, symptom: 'register-allocation' };
    const assess = () => { throw new Error('fixture has no donor observations'); };
    const compact = selectKnowledge(workbench, target, options, assess);
    assert.deepEqual(compact.lessons.map(lesson => lesson.id), lessons.slice(0, 3).map(lesson => lesson.id));
    assert.equal(compact.lessonsOmitted, 2);
    const detailed = selectKnowledge(workbench, target, { ...options, includeDetails: true }, assess);
    assert.deepEqual(detailed.lessons.map(lesson => lesson.id), lessons.map(lesson => lesson.id));
    assert.equal(detailed.lessonsOmitted, 0);
    assert.deepEqual(detailed.lessons.slice(0, 3), compact.lessons);
    const disabled = selectKnowledge(workbench, target, { indexPath, includeDetails: true }, assess);
    assert.equal(disabled.status, 'disabled');
    assert.equal(disabled.lessons.length, 0);

    const intake = require('../tools/lib/matching/intake');
    const originalPresentation = intake.presentation;
    const originalLoad = intake.loadIntakeModel;
    const commandPath = require.resolve('../tools/match');
    const commandWorkbench = { targets: [target], bySymbol: new Map([[target.symbol, target]]) };
    intake.loadIntakeModel = () => commandWorkbench;
    intake.presentation = (symbol, options) => ({
      symbol, knowledge: selectKnowledge(commandWorkbench, target, { ...options, indexPath }, assess),
    });
    delete require.cache[commandPath];
    try {
      const { executeCommand } = require(commandPath);
      for (const includeDetails of [false, true]) {
        let report;
        await executeCommand('intake', {
          positional: [target.symbol],
          options: { symptom: 'register-allocation', 'include-details': includeDetails, json: true },
        }, null, value => { report = value; });
        assert.equal(report.knowledge.lessons.length, includeDetails ? 5 : 3);
        assert.equal(report.knowledge.lessonsOmitted, includeDetails ? 0 : 2);
      }
    } finally {
      intake.presentation = originalPresentation;
      intake.loadIntakeModel = originalLoad;
      delete require.cache[commandPath];
    }
  } finally {
    fs.unlinkSync(indexPath);
    fs.rmdirSync(temporary);
  }
  console.log('Matching knowledge detail tests: PASS');
}

if (require.main === module) run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
module.exports = { run };
