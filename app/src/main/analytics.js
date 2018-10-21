const firstRun = require('first-run')
const Insight = require('insight')

const pkg = require('../../package')

const trackingCode = 'UA-127827681-1'

const insight = new Insight({
  trackingCode,
  pkg
})

exports.init = function () {
  if (firstRun()) {
    insight.track('install')
  }

  if (firstRun({name: `${pkg.name}-${pkg.version}`})) {
  }
}

exports.track = function (...paths) {
  insight.track(...paths)
}
