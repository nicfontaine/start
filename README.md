# Start Page

> Select a base colour palette, change your search pages, drop in your favourite sites & icons

### Usage
- Cursor is hidden, everything can be done w/ a keyboard (can be changed at top of ``` main.css ```)

- Auto focus is on search input.

1. Use L & R Arrow keys to change search sites.
2. Up Arrow to pull previous searches
3. Down Arrow, then any Arrow keys to navigate tiles.
4. That's it.

---

### About
- Tile nav isn't grid based, so you can add or remove any and change their size, or container width and arrow navigation will stay intact. (NOTE) may get a little weird with odd numbers that leave like 1 tile on a row or something.

- I just threw in [Font Awesome Icons](http://fontawesome.io/get-started/). Use whatever you prefer, or flip through there and grab whatever works.

### Customize Options
- A few vars in ``` main.js ```:
```
// BASE HUE VALUE (0-360)
var cpbh = 264;

// SEARCH PLACEHOLDERS (use whatever string you want to display)
var searchPl = ['> duckduckgo', '> google'];

// SEARCH SITE URLS (run a search & grab the url minus query string [if it uses one..])
var searchUrlArray = ['https://duckduckgo.com/?q=', 'https://google.com/#q='];
```

### More
Check out my website at [nicfontaine.com](https://nicfontaine.com)  
Twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Use it, break it, complain, wtvr.
