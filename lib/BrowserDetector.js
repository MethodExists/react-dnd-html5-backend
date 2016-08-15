import memoize from 'lodash/memoize';

export var isFirefox = memoize(function () {
  return (/firefox/i.test(navigator.userAgent)
  );
});

export var isSafari = memoize(function () {
  return Boolean(window.safari);
});