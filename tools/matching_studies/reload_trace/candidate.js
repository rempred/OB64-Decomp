'use strict';
const { path } = require('./common');
const { focused } = require('./run');
function candidate(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!['--manifest', '--source', '--function'].includes(argv[i]) || !argv[i + 1] || options[argv[i]]) throw Error('required: --manifest FILE --source FILE --function SYMBOL');
    options[argv[i]] = argv[i + 1];
  }
  if (Object.keys(options).length !== 3) throw Error('required: --manifest FILE --source FILE --function SYMBOL');
  return focused(path.resolve(options['--manifest']), [{ id: 'candidate', source: path.resolve(options['--source']), symbol: options['--function'] }]);
}
if (require.main === module) { const report = candidate(process.argv.slice(2)); console.log(JSON.stringify({ status: report.status, root: report.root })); }
module.exports = { candidate };
