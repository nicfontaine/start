# Start Page

> Select colour tone, change your search pages, drop in your favourite sites & icons, share geolocation for local weather data

![img preview](https://github.com/ngpfontaine/startp/blob/master/extra/start_screen_01.png)


### Usage

1. Cursor hides with delay, everything can be done w/ a keyboard
2. Use L & R Arrow keys to change search sites.
3. Up Arrow to pull previous searches
4. Down Arrow (to leave search focus), then any Arrow keys to navigate tiles.


---

### About
- Tile nav isn't grid based, so you can add or remove any and change their size, or container width and arrow navigation will stay intact. (NOTE) may get a little weird with odd numbers that leave like 1 tile on a row or something.

- I just threw in [Font Awesome Icons](http://fontawesome.io/get-started/). Use whatever icons you prefer (you'll have to style them), or flip through there and grab whatever works.

- Add or remove an search sites; just match up placeholder and url slug at the same index in the two array vars below. The little 'slide number dots' below will read the length of the array & increase or decrease accordingly.

- Weather data (weather type and temp) is polled every 20000ms, background images fade accordingly. Swap w/ semi-transparent, desaturated, compressed pngs however you please.

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

### Sources
***Weather***   
    
- [simpleWeather.js](http://simpleweatherjs.com/)

***Scripts***

- [l2.io](https://l2.io/) for IP Addr

***Vis***

- [FA Icons](http://fontawesome.io/get-started/)

### To-Do
- use other icons

- refactor tile grid on window resize

- `var` for cursor hide/show preferences

- `var` for light/dark mode

- onclick swap for list of search icon dots

- source/cite images, scripts

- more specific images

### More
Check out my website at [nicfontaine.com](https://nicfontaine.com)  
Twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Use it, break it, complain, wtvr.
