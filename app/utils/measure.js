import { schedule } from '@ember/runloop';

let redirect = false;
if (typeof location !== 'undefined') {
  const url = new URL(location.href);
  redirect = url.searchParams.has('perf.tracing');
}

/*
  Invoke this from the afterModel hook of leafmost routes.
*/
export default function measure() {
  performance.mark('dataLoaded');
  schedule('afterRender', renderEnd);
}

/*
  This provides two additional benchmarking modes `?perf.profile` and
  `?perf.tracing`. The former wraps the initial render in a CPU profile. The
  latter is intended to be used with `chrome-tracing` where it redirects to
  `about:blank` after the initial render as the termination signal.
*/
export function renderEnd() {
  requestAnimationFrame(() => {
    performance.mark('beforePaint');
    requestAnimationFrame(() => {
      if (redirect) {
        document.location.href = 'about:blank';
      } else {
        performance.mark('afterPaint');
        // performance.measure('assets', 'navigationStart', 'beforeVendor');
        performance.measure('boot', 'navigationStart', 'willTransition');
        performance.measure('transition', 'willTransition', 'didTransition');
        performance.measure('render', 'didTransition', 'beforePaint');
        performance.measure('paint', 'beforePaint', 'afterPaint');

        // performance.measure('evalVendor', 'beforeVendor', 'beforeApp');
        // performance.measure('evalApp', 'beforeApp', 'afterApp');
        // performance.measure('data', 'willTransition', 'dataLoaded');
        // performance.measure('afterData', 'dataLoaded', 'beforePaint');
      }
    });
  });
}
