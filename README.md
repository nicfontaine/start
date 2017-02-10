# Start Page

> Select colour tone, change your search pages, drop in your favourite sites & icons, share geolocation for local weather data

![img preview](https://github.com/ngpfontaine/startp/blob/master/extra/start_screen_02.png)


### Usage

1. Cursor hides with delay, everything can be done w/ a keyboard
2. Use L & R Arrow keys to change search sites.
3. Up Arrow to pull previous searches
4. Down Arrow (to leave search focus), then any Arrow keys to navigate tiles.


---

### About

- Use 'Ctrl + C' to randomly generate a new base colour

- Tile nav isn't grid based, so you can add or remove any and change their size, or container width and arrow navigation will stay intact. (NOTE) may get a little weird with odd numbers that leave like 1 tile on a row or something.

- I just threw in [Font Awesome Icons](http://fontawesome.io/get-started/). Use whatever icons you prefer (you'll have to style them), or flip through there and grab whatever works.

- Add or remove any search sites; just match up placeholder, url slug, and mini icon at the same index in the three array vars below. The little 'mini search icons' below will read the length of the array & increase or decrease accordingly.

- Mini search icons are clickable, and touch swipe within the search box is enabled to change search sites.

- Weather imgs are lazy loaded after weather data comes back from the server, so it may take a few seconds to display. New data is polled every 20000ms, background images fade accordingly. Swap w/ semi-transparent, desaturated, compressed pngs however you please. All of the possible weather descriptions I have seen thus far are listed in comments    


### Customize Options
- A few vars in ``` main.js ```:
```
// BASE HUE VALUE (0-360)
var cpbh = 264;

// SEARCH PLACEHOLDERS (use whatever string you want to display)
var searchPl = [' duckduckgo', ' google'];

// SEARCH SITE URLS (run a search & grab the url minus query string [if it uses one..])
var searchUrlArray = ['https://duckduckgo.com/?q=', 'https://google.com/#q='];

// SEARCH SITE ICONS (place in some corresponding icons)
var searchIconArray = ['<i class="fa fa-globe"></i>', ...];
```

### Sources
***Weather***   

- [simpleWeather.js](http://simpleweatherjs.com/)

***Scripts***

- [l2.io](https://l2.io/) for IP Addr

***Vis***

- [FA Icons](http://fontawesome.io/get-started/)

----

### Bugs

- clicking on placeholder icon brings back previous search  

- can enter blank input for search, then search array logs blank search for ^ functionality


### To-Do
- use OpenWeatherMap instead of simpleWeather yahoo api (kinda unreliable)

- paste from clipboard

- update ip address when it changes
    
- web app manifest & service worker

- (bug) ctrl-disable gets stuck down? disabling *a* key, or fuxxing w/ backspace

- use other icons

- `var` for light/dark mode

- source/cite images, scripts

- more specific weather images

### More
Check out my website at [nicfontaine.com](https://nicfontaine.com)  
Twitter: [@ngpfontaine](https://twitter.com/ngpfontaine)

### License
Use it, break it, complain, wtvr.
