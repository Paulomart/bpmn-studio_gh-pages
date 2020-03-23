dom-event-dispatch
===

Install
---

`npm install dom-event-dispatch`

Usage
---

```javascript
import { dispatchEvent } from 'dom-event-dispatch';
document.body.addEventListener('bla', e=>{
    console.log('totally blad');
});

dispatchEvent(document.body, 'bla');

```

About
---

This module supports ie9+, and all other browsers. Use it to fire the `Event()` constructor.
