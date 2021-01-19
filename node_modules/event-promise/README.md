event-promise
=============

promises for events

usage
-----

```javascript
once(emitter, event, options)
```

* `emitter` EventEmitter
* `event` string
* `options` object
* Returns: promise

example
-------

```javascript
var once = require('node-event-promise');
var http = require('http');

var request = http.get('http://duckduckgo.com/');

once(request, 'response').then(function(response) {
  // ...
}, function(error) {
  // ...
}).done();
```

options
-------

* `ignoreErrors` boolean

by default, the promise will reject if `emitter` emits an error first. Set this
to `true` if you want to handle errors yourself.

* `array` boolean

if `array` is true, the promise will resolve to an array of all arguments passed
to the event instead of just the first argument. This is only useful if the
event is fired with more than one argument, e.g.
[FSWatcher::change](http://nodejs.org/api/fs.html#fs_event_change)
