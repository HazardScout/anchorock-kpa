const procoreIntegration = require('./dist/procore-integration/function/procore-execution-worker-kpa-wrapper');
const procoreModelDb = require('./dist/procore-integration/function/mongodb/index');
const procoreModel = require('./dist/procore-integration/function/model/index');

// const rivetIntegration = require('./dist/rivet-integration/function/rivet-execution-worker-kpa-wrapper');
const rivetModelDb = require('./dist/rivet-integration/function/mongodb/index');
const rivetModel = require('./dist/rivet-integration/function/model/index');

const spectrumIntegration = require('./dist/spectrum-integration/function/spectrum-execution-worker-kpa-wrapper');
const spectrumModelDb = require('./dist/spectrum-integration/function/mongodb/index');
const spectrumModel = require('./dist/spectrum-integration/function/model/index');

module.exports = {
  procore: {
    worker: procoreIntegration,
    db: procoreModelDb,
    model: procoreModel,
  },
  rivet: {
    // worker: rivetIntegration,
    db: rivetModelDb,
    model: rivetModel,
  },
  spectrum: {
    worker: spectrumIntegration,
    db: spectrumModelDb,
    model: spectrumModel,
  },
}
