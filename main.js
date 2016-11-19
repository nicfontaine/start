// TEST

/*********************************************/
/****     EDIT SETTINGS VIA VARIABLES     ****/
/*********************************************/

//
// BASE COLOUR SETTINGS
//

// HUE, 0-360
var cpbh = 200;

// (NOTE TO-DO) LIGHT/DARK MODE
// var cMode = 'dark';
var cMode = 'light';

// SATURATION, 0-100 (%)
// var cpbs = 28;
var cpbs = 18;

// LIGHTNESS, 0-100 (%)
// (NOTE) PROB LEAVE AS-IS
// var cpbl = 64;
var cpbl = 50;

//
// SEARCH OPTIONS
//

// PLACEHOLDER TITLES HERE
// (NOTE) USE WHATEVER FORMAT YOU WANT HERE, DOESN'T MATTER
// (NOTE) YOU CAN MOVE 'url' TO WHATEVER INDEX OR REMOVE, JUST LEAVE IT'S NAME...
// (NOTE) ...IT HAS A SPECIFIC CASE THAT SEARCHES FOR IT BY NAME
var searchPl = [
	'url',
	'duckduckgo',
	'google',
	'google maps',
	'youtube',
	'soundcloud',
	'/r/',
	'stackoverflow',
	'aur',
	'wikipedia'
];

// URL SLUGS HERE (THEY CORRESPOND TO TITLES ABOVE)
// (NOTE) RUN A SEARCH SOMEWHERE, GRAB IT'S URL, & CUT THE QUERY STRING (IF IT USES ONE..)
var searchUrlArray = [
	'',
	'https://duckduckgo.com/?q=',
	'https://www.google.com/#q=',
	'https://www.google.com/maps/search/',
	'https://www.youtube.com/results?search_query=',
	'https://soundcloud.com/search?q=',
	'https://www.reddit.com/r/',
	'https://stackoverflow.com/search?q=',
	'https://aur.archlinux.org/packages/?O=0&K=',
	'https://en.wikipedia.org/wiki/'
];

// SOME EXTRA URL SLUGS
// https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=
// https://thepiratebay.org/search/
// https://www.bing.com/search?q=
// https://www.reddit.com/search?q=
// https://www.etsy.com/search?q=


// SET TO FALSE IF YOU'D RATHER JUST HAVE THE MAGNIFYING GLASS ICON
var searchIconSwap = true;

var searchIconArray = [
	'<i class="fa fa-globe" aria-hidden="true"></i>',
	'<i class="fa fa-search search-icon" aria-hidden="true"></i>',
	'<i class="fa fa-google" aria-hidden="true"></i>',
	'<i class="fa fa-map-marker" aria-hidden="true"></i>',
	'<i class="fa fa-youtube" aria-hidden="true"></i>',
	'<i class="fa fa-soundcloud" aria-hidden="true"></i>',
	'<i class="fa fa-reddit" aria-hidden="true"></i>',
	'<i class="fa fa-stack-overflow" aria-hidden="true"></i>',
	'<i class="fa fa-linux" aria-hidden="true"></i>',
	'<i class="fa fa-wikipedia-w" aria-hidden="true"></i>'
];

// (NOTE TO-DO) CURSOR DISPLAY PREF
// var cursorHide = false;
var cursorHide = true;

// WOEID FOR WEATHER
// (NOTE) USING GEOLOCATION NOW TO AUTO-SET, JUST ACCEPT LOCATION DATA
// var myWoeid = '12797161';

/*************************************************/
/****     END EDIT SETTINGS VIA VARIABLES     ****/
/*************************************************/

// HIDE CURSOR AFTER DELAY
var cursorToggleShow = true;
var cursorTimer;
document.addEventListener('mousemove', function() {
	if (!cursorToggleShow) {
		cursorToggleShow = true;
  	document.getElementsByTagName('html')[0].style.cursor = 'auto';
		// console.log('showing cursor');
	}
	else {
		// DISABLE IF MOUSE IS STILL MOVING
		clearTimeout(cursorTimer);
		cursorToggleShow = true;
		// HIDE AFTER DELAY, & ALLOW SHOW BY SETTING TOGGLE TO FALSE
		cursorTimer = setTimeout(function() {
			document.getElementsByTagName('html')[0].style.cursor = 'none';
			// console.log('hiding cursor');
			cursorToggleShow = false;
		}, 300);
	}
});

var searchInputDom = document.getElementById('search-input');
var searchInputCall;
var searchInputHolder;
var searchNoRepeat = 0;
// var searchPreDom = document.getElementById('search-pre');

// INIT INPUT PLACEHOLDER W/ FIRST SEARCH OF ARRAY
searchInputDom.placeholder = searchPl[0];
var searchPlInc = 0;
var searchLogged = [];
var searchNoTimes = 0;

searchInputDom.focus();

// SETTING SEARCH ICON
var inputSearchIconDom = document.getElementById('input-search-icon');
inputSearchIconDom.innerHTML = searchIconArray[0];

// TOGGLE VAR TO TELL WHERE FOCUS IS
// SEARCH, OR LINKS
var toggleTab = 'search';

var links = document.getElementById('ul-links').getElementsByTagName('a');
var linksNo = links.length;
var linkFocus = 0;
var linkFocusOffTop;

//
// COLOUR ASSIGNMENT, DONE HERE INSTEAD OF CSS SO WE CAN HAVE SOME SLIGHT HUE SHIFT
//

var cpMods = {
	linkBgHue: cpbh*1.01,
	linkBgSat: cpbs*1.14,
	linkBgLight: cpbl*1.18,
}

// ASSIGN BODY BG COLOUR
document.getElementsByTagName('body')[0].style.background = colourConstructor(cpbh,cpbs,cpbl);

// CACHE IT SO WE DON'T CALC IT EVERY TIME IN THE LOOP
var linksColCalc = colourConstructor(cpMods.linkBgHue,cpMods.linkBgSat,cpMods.linkBgLight);
for (i=0; i<linksNo; i++) {
	links[i].style.background = linksColCalc;
}

// BUILD THE HSL VALUES & RETURN
function colourConstructor (h,s,l) {
	var hslCombo = 'hsl(' + h + ',' + s + '%,' + l + '%)';
	return hslCombo;
}

// DATE
var navDateDom = document.getElementById('date-d');
var navTimeDom = document.getElementById('date-t');
var timeLargeDom = document.getElementById('time-large');

var dateD = new Date();
navDateDom.innerHTML = dateD.toDateString();
// TIME

function clock() {

	var dateT = new Date();
	dateH = dateT.getHours();
	if (dateH > 12) {
		dateH-=12;
	}
	dateM = dateT.getMinutes();
	if (dateM.toString().length < 2) {
		dateM = '0' + dateM.toString();
	}
	dateS = dateT.getSeconds();
	if (dateS.toString().length < 2) {
		dateS = '0' + dateS.toString();
	}
	navTimeDom.innerHTML = dateH + ':' + dateM + ':' + dateS;
	timeLargeDom.innerHTML = dateH + ':' + dateM;

	setTimeout(clock,1000);

}
clock();

//
// LET'S FUCK WIT DIS LINK GRID THING
//

// ROW NUMBER WE'RE ON
var rNum = 0;
// TOTAL ROW COUNT, NOT STATIC
var rNumTotal = 1;

// VERTICAL OFFSET OF ROWS
var rOffset = [];
// NUMBER OF LINKS IN EACH ROW, END COUNTING INDEX WHEN OFFSET CHANGES
var rLength = [];
// USED TO COUNT THROUGH ROWS, & ASSIGN TO ARRAYS. NOT STATIC
var rLinkCount = 0;

// INIT ROW 1 YVal FROM FIRST CELL
// START US OFF W/ THE FIRST ONE, TO COMPARE TO
// YES, WE NEED THIS
rOffset[rNum] = links[0].offsetTop;

var dotSectionDomArray = document.getElementsByClassName('section-no-dots');

// SHOW LINKS ON LOAD, IN SERIES
var showInc = 0;
function timeoutShow() {
	setTimeout(function() {
		links[showInc].classList.add('show');
		showInc++;
		if (showInc<linksNo) {
			timeoutShow();
		}
	},45);
}
timeoutShow();

//
// COUNT ROW OFFSETS, AND NO IN ROWS TO SET UP/DOWN MOVE LOGIC
//

for (i=0; i<linksNo; i++) {

	// IF LINK OFFSET MATCHES rOffset VALUE AT rNUM INDEX
	// WILL CHANGE WHEN WE HIT NEW ROW, & rNUM ADDS ONE
	if (links[i].offsetTop === rOffset[rNum]) {
		rLinkCount++;

		// OVERRITE W/ INCREMENTING VAL
		rLength[rNum] = rLinkCount;

		// JUST KEEP RE-ASSIGNING THE VERTICAL OFFSET
		rOffset[rNum] = links[i].offsetTop;

	}

	// RESET LINK COUNT WHEN GET TO NEXT LINE
	else {

		// LOG EACH ROW
		console.log('row: ' + rNum + ', ' + rLength[rNum] + ' total cells ');

		// MOVE TO NEW ROW
		rNum++;
		// ADD TO TOTAL ROWS
		rNumTotal++;

		rOffset[rNum] = links[i].offsetTop;

		// RESET COUNTER
		// rLinkCount+=1;
		rLinkCount++;

		// GOTTEN TO NEW OFFSET LINE, SO WE ADD 1 TO NEW ROW ARRAY INDEX
		// rLength[rNum] = 1;

		// INDEXES ARE TOTALS, KEEP ADDING TOTAL LINK COUNT
		rLength[rNum] = rLinkCount;

	}

}

// LOG IT AGAIN WHEN LOOPING HAS FINISHED, FOR LAST ROW
console.log('row: ' + rNum + ', ' + rLength[rNum] + ' total cells ');

//
// WINDOW RESIZING
//

var hasResized = false;
var resizeTimer;
window.onresize = function() {

	if (!hasResized) {
		hasResized = true;
	}

  windowIW = window.innerWidth;

	// DISABLE IF USER IS STILL RESIZING, SO NOT CONSTANTLY FIRING
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {

		console.log('resizing');

	}, 250);

}

// RE-FOCUS SEARCH ON TAB
document.addEventListener('keydown', function(e) {
	if (e.keyCode == '9') {
		e.preventDefault();
		focusSearch();
	}
});

//
// MOVE THROUGH LINKS
//

document.getElementById('ul-links').addEventListener('keydown', function (e) {

	console.log(linkFocus);

  // KEY LEFT
  if (e.keyCode == '37') {
    e.preventDefault();

    // INC ONLY IF 1 OR GREATER
    if (linkFocus >= 1) {
    	linkFocus--;
    }

    // OTHERWISE, RESET TO -1
    else {
    	linkFocus = linksNo-1;
    }

		focusLink();

  }

  // KEY RIGHT
  if (e.keyCode == '39') {
    e.preventDefault();

    if (linkFocus < linksNo-1) {
    	linkFocus++;
    }

    else {
    	linkFocus = 0;
    }

		focusLink();

  }

  // KEY UP
  if (e.keyCode == '38') {
    e.preventDefault();

		if (linkFocus-rLength[0] > -1) {
			linkFocus -= rLength[0];
			focusLink();
		}

		else {
			// linkFocus = linkFocus + rNum*rLength[0];
			toggleTab = 'search';
			// searchInputDom.focus();
			focusSearch();
			// ONLY SHOW IF BLANK
			if (searchInputCall.length === 0) {
				searchInputDom.classList.remove('search-hide');				
			}
		}

  }

  // KEY DOWN
  if (e.keyCode == '40') {
    e.preventDefault();

		// IF THE NEXT linkFocus WILL BE LESS THAN THE LAST INDEX OF rLength
		if (linkFocus+rLength[0] < rLength[rLength.length-1]) {
			// GO DOWN A ROW LENGTH
			linkFocus += rLength[0];
			focusLink();
		}

		// (NOTE) NEED TO CHECK FOR ORPHAN ROWS W/ FEWER INDICES
		// SO YOU CAN STILL GO DOWN, EVEN W/ ONE WIDE TILE

		else {
			// linkFocus = linkFocus - rNum*rLength[0];
			toggleTab = 'search';
			searchInputDom.focus();
		}

  }

	// KEY TAB, ANNOYING. LETS DISABLE IT
	// INTERESTING THAT IT DOESN'T DISABLE CTRL+TAB BROWSER NAVIGATION
	if (e.keyCode == '9') {
		e.preventDefault();
	}

});


//
// FOCUS LINK FOR CALLING
//

function focusLink() {

	// searchPreDom.className = '';

	// FOCUS
  if (linkFocus >= 0 && linkFocus < linksNo) {
  	links[linkFocus].focus();
    linkFocusOffTop = links[linkFocus].offsetTop;
  }

	// (NOTE) DON'T THINK WE NEED THIS NOW THAT WE GO FROM [0] TO .length I.E. BEG TO END
  // IT'S NEG, BLUR ALL
  // else {
  // 	for (i=0; i<linksNo; i++) {
  //   	links[i].blur();
  //   }
  // }

}

//
// SEARCH
//

function focusSearch() {
	searchInputDom.focus();
	// searchPreDom.className = 'search-pre-blinking';
}

var cursorMoveEnable = false;
var searchPreMoveDst = 103;
var searchPreMoveInc = 0;

var inputFake = document.getElementById('input-fake');
// var rejectArray = ['16', '18', '8', '17', '37', '38', '40', '39'];
var rejectArray = ['16', '18', '8', '17'];
var keyCtrlDown = false;

searchInputDom.addEventListener('keyup', function(e) {
	// CTRL
  if (e.keyCode === 17) {
    keyCtrlDown = false;
  }
});

// CTRL + BACKSPACE
searchInputDom.addEventListener('keydown', function(e) {

	searchInputCall = searchInputDom.value.toLowerCase();
	keyCtrlDown;
	// CTRL
	if (e.which === 17) {
		keyCtrlDown = true;
	}

	// SPACE
	if (e.keyCode === 32) {
		// p = p + '&nbsp;';
		e.preventDefault();
		p = inputFake.innerHTML;
		// p = p + '\xa0';
		// p+= '\x20';
		p += String.fromCharCode(160);
		// p = p + ' ';
		inputFake.innerHTML = p;
	}

	// CTRL KEY IS DOWN, WAIT FOR COMBO TO TRIGGER
	if (keyCtrlDown) {

		// BACKSPACE
		if (e.which === 8) {
			console.log('ctrl + backspace');
			// IF NOT DISABLED, TAKES AN ADDITIONAL LETTER OFF THE END xD
			e.preventDefault();
			// MERGE ANY CONTINUOUS SPACES TO 1 SPACE
			p = p.replace(/&nbsp;/g, ' ');
			// p = p.replace(/\s\s+/g, ' ');
			l = p.lastIndexOf(' ');

			// IF STRING ENDS IN ' ' REMOVE IT BEFORE REMOVING LAST WORD
			if (l === p.length-1) {
				p = p.substring(0,p.length-2);
				// RE LOG
				l = p.lastIndexOf(' ');
			}
			// SET p W/O LAST WORD
			p = p.substring(0,l);				
			// SPACE IS BEING REMOVED FOR SOME REASON, ADD IT BACK
			if (p.length > 0) {
				p+=' ';
			}
			inputFake.innerHTML = p;

			// SHOW PLACEHOLDER WHEN DOWN TO NO CHARS
			if (p.length < 1) {
				clearSearch();
				searchInputDom.classList.remove('search-hide');
			}

		}

		// KEY A
		if (e.which === 65) {
			// DISABLE ANNOYING CTRL+A HIGHLIGHT
			e.preventDefault();
			console.log('key a');
		}

	}

});

searchInputDom.addEventListener('keypress', function(e) {

	// HIDE PLACEHOLDER WHEN TYPING
	searchInputDom.classList.add('search-hide');

	// CACHE VALUE OF SPAN
	p = inputFake.innerHTML;

	// IF NOT IN ARRAY
	if (rejectArray.indexOf(e.keyCode.toString()) < 0) {

		// SPACE
		// if (e.keyCode === 32) {
		// 	// p = p + '&nbsp;';
		// 	p = p + '\xa0';
		// 	inputFake.innerHTML = p;
		// }
		// else {
			k = e.which;
			// ADD LETTER FROM KEYCODE TO END OF FAKE INPUT
			inputFake.innerHTML = p + String.fromCharCode(k).toLowerCase();
			// UPDATE W/ LAST ADDED LETTER
			p = inputFake.innerHTML;
			// console.log(p);
			// inputFake.innerHTML = p + keyboardMap[e.keyCode].toLowerCase();
		// }

	}

	// BACKSPACE
	else if (e.keyCode === 8) {
		// CONVERT ALL BREAKING SPACE ENTITIES BACK TO SPACE CHARS
		// OTHERWISE, WE DELETE THE SEMICOLON & IT ALL FUCKS UP
		p = p.replace(/&nbsp;/g, '\xa0');
		p = p.substring(0,p.length-1);
		inputFake.innerHTML = p;
		// SHOW PLACEHOLDER WHEN DOWN TO NO CHARS
		if (p.length < 1) {
			searchInputDom.classList.remove('search-hide');
		}
	}


	// KEY ENTER
	if (e.keyCode == '13' && searchInputCall !== '') {
		// SEARCH AS URL
		if (searchPl[searchPlInc] === 'url') {
			// NO HTTP OR HTTPS, NEED TO MAKE IT A REAL URL
			if (searchInputCall.indexOf('https://') === -1 && searchInputCall.indexOf('http://') === -1) {
				window.open('http://' + searchInputCall);
			}
			// VALID, FULL URL
			else {
				window.open(searchInputCall);
			}
			// LOG SEARCHES
			searchLogged.push(searchInputCall);
		}
		// COMBINE W/ URL SLUG
		else {
			// REMOVE SPACE ENTITIES, REPLACE W/ SPACE
			q = inputFake.innerHTML.replace(/&nbsp;/g, '\xa0');
			// q = searchInputCall.replace(/\s\s+/g, ' ');
			console.log(q);
			window.open(searchUrlArray[searchPlInc] + q);
			// LOG SEARCHES
			searchLogged.push(q);
		}

		inputFake.innerHTML = '';

		searchInputDom.value = '';

		// ITER NUMBER OF TIMES, FOR ARRAY LOOKUP
		searchNoTimes++;

		searchNoRepeat = 0;
		// searchPlInc++;

	}

	// KEY TAB, ANNOYING. LETS DISABLE IT
	if (e.keyCode == '9') {
		e.preventDefault();
	}

});

// JUST FOR ARROW KEYS, TY CHROME AND IE!
searchInputDom.addEventListener('keydown', function(e) {

	// KEY DOWN
	if (e.keyCode == '40') {
		e.preventDefault();
		searchInputDom.blur();
		linkFocus = 0;
		toggleTab = 'links';
		focusLink();
	}

	// KEY LEFT
	if (e.keyCode == '37') {
		e.preventDefault();
		searchSwitch('l');
	}

	// KEY RIGHT
	if (e.keyCode == '39') {
		e.preventDefault();
		searchSwitch('r');
	}

	// KEY UP
	if (e.keyCode == '38') {
		searchNoRepeat++;
		// UNTIL WE'VE GONE THROUGH ALL LOGGED SEARCHES
		if (typeof searchLogged[searchNoTimes-searchNoRepeat] !== 'undefined') {
			searchInputDom.value = searchLogged[searchNoTimes-searchNoRepeat];
			inputFake.innerHTML = searchLogged[searchNoTimes-searchNoRepeat];
		}
		// CLEAR INPUT, & RESET LOG CALL INC - ALLOWS LOOPING THROUGH CALLS
		else {
			clearSearch();
		}
	}
	
})

function clearSearch() {
	// RESET SEARCH INPUT
	searchInputDom.value = '';
	inputFake.innerHTML = '';
	// RESET NO OF CONSECUTIVE SEARCH LOG CALLS
	searchNoRepeat = 0;
}

// SWITCH SEARCH L & R W/ INPUT PARAMS
function searchSwitch(dir) {

	if (dir === 'l') {

		// DEC SEARCH NO IF GREATER THAN 0
		if (searchPlInc > 0) {
			searchPlInc--;
		}
		// GO TO END
		else {
			searchPlInc = searchPl.length-1;
		}

	}

	else if (dir === 'r') {

		// INC SEARCH NO IF LESS THAN ARRAY LENGTH
		if (searchPlInc < searchPl.length-1) {
			searchPlInc++;
		}
		// BACK TO START
		else {
			searchPlInc = 0;
		}

	}

	inputSearchIconDom.innerHTML = searchIconArray[searchPlInc];

	// SWAP PLACEHOLDER
	searchInputDom.placeholder = searchPl[searchPlInc];
	// SHOW PLACEHOLDER
	searchInputDom.classList.remove('search-hide');

	// REC PREV SEARCH INPUT
	// searchInputHolder = searchInputCall;
	searchInputHolder = inputFake.innerHTML;
	dotChange();

	// (NOTE) DOESN'T TRIGGER IF MOVE MULTIPLE L/R QUICKLY
	// RE-ASSIGN VALUE, W/ DELAY
	setTimeout(function() {
		// DON'T RESET W/ DELAY IF INPUT VALUE IS BLANK
		if (typeof searchInputDom.value !== 'undefined' && searchInputDom.value.length === 0) {

			// SEARCH VALUE IS ONLY WHITE SPACE, RESET
			if (!searchInputCall.replace(/\s/g, '').length) {
				console.log('just white space, reset');
				clearSearch();
				searchInputHolder = '';
			}
			// THERE WAS A VALUE, REASSIGN IT
			else {
				searchInputDom.value = searchInputHolder;
				inputFake.innerHTML = searchInputHolder;
				// HIDE PLACEHOLDER
				searchInputDom.classList.add('search-hide');
			}

		}
	},200);

	clearSearch();

}

//
// DOTS
//

for (i=0; i<searchPl.length; i++) {
	var itmDot = document.getElementById('dot-container').lastChild;
	var clnDot = itmDot.cloneNode(true);

	clnDot.innerHTML = searchIconArray[i];
	// ASSIGN ONCLICK, SWAP FUNCTION
	// (NOTE) DON'T NEED W/ NEW CALLBACK
	// clnDot.onclick = searchIconClickSwap;
	dotSectionDomArray[0].appendChild(clnDot);
}

// GET DOT FROM CONTAINER
// ADD SEL CLASS TO FIRST
var noDotEachDom = dotSectionDomArray[0].getElementsByClassName('no-dot');
noDotEachDom[0].classList.add('no-dot-sel');

// SWAP SEL DOT BY searchPlInc
function dotChange() {
	// REMOVE SEL CLASS FROM ALL
	for (i=0; i<noDotEachDom.length; i++) {
		noDotEachDom[i].className = 'no-dot';
	}
	// ADD TO CURRENT IN ROTATION
	noDotEachDom[searchPlInc].classList.add('no-dot-sel');
}

var dotChildren = document.getElementsByClassName('section-no-dots')[0].children;
var lDotChildren = dotChildren.length;

// CALLBACK FOR DOT CLICKING
for (var i=0; i<lDotChildren; i++) {
	(function(index){
		dotChildren[i].onclick = function() {
			console.log(index + ' index was clicked');
			// DISABLE THE UN-FOCUS FLASH ON CLICK PRESS
			focusSearch();
			// RE-ASSIGN INCREMENTAL PLACEHOLDER VAR
			searchPlInc = index;

			inputSearchIconDom.innerHTML = searchIconArray[searchPlInc];
			// SWAP PLACEHOLDER
			searchInputDom.placeholder = searchPl[searchPlInc];
			// SHOW PLACEHOLDER
			searchInputDom.classList.remove('search-hide');
			// REMOVE SEL CLASS FROM ALL
			for (i=0; i<noDotEachDom.length; i++) {
				noDotEachDom[i].className = 'no-dot';
			}
			noDotEachDom[searchPlInc].classList.add('no-dot-sel');
		}
	})(i);
}

// function searchIconClickSwap() {
// 	console.log('searchIconClickSwap();');
// }

//
// WEATHER
//

var weatherBgDom = document.getElementById('weather-bg');
var weatherImgArray = weatherBgDom.getElementsByTagName('div');
var weatherImgNo = weatherImgArray.length;
var weatherCurrent;
var weatherTemp;
var navTop = document.getElementById('nav-weather');
var navTempDom = document.getElementById('temp');
var navCityDom = document.getElementById('city');
var weatherCity;

// LAZY LOAD WEATHER IMGS
var weatherImgNameArray = ['sunny','rain','showers','cloudy','windy','snow'];
var weatherImgNameArrayLength = weatherImgNameArray.length;

// window.onload = function() {
function weatherImgLazy() {
	for (var i=0; i<weatherImgNameArrayLength; i++) {
		weatherImgArray[i].id = 'weather-' + weatherImgNameArray[i];
	}	
}
// };

/* Where in the world are you? */
$(document).ready(function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
		console.log('load geolocation coords: ' + position.coords.latitude+','+position.coords.longitude);
  });
});

var initWeatherLoad = true;

function loadWeather(location, woeid) {
	function getWeather() {
	  $.simpleWeather({
	    location: location,
	    woeid: woeid,
	    unit: 'f',
				success: function(weather) {
					weatherCurrent = weather.currently;
					weatherTemp = weather.temp;
					weatherCity = weather.city + ', ' + weather.region;
					console.clear();
					console.log('geo coords: ' + location);
					console.log('weather: "' + weatherCurrent + '", temp: "' + weatherTemp + '"');

					// LAZY LOAD WEATHER IMGS WHEN DATA IS PULLED
					weatherImgLazy();

					weatherSwap(weatherCurrent,weatherTemp);						
					// Sunny
					// Partly Cloudy
					// Mostly Cloudy
					// Breezy
					// Cloudy
					// Windy
					// Thunderstorms
					// Rain and Snow
					// Snow
					// Scattered Thunderstorms
					// Rain
					// Scattered Showers
					// Mostly Sunny
				},
				error: function(error) {
      		// SOME ERROR NOTIFICATION HERE
					console.log('weather error');
    		}
	  });

		// REFRESH EVERY 20 SEC
		setTimeout(getWeather,20000);

		}
	// INIT, ONCE
	if (initWeatherLoad) {
		getWeather();
		initWeatherLoad = false;
	}

}

function weatherSwap(e,t) {
	img = '';

	if (e === 'Sunny' || e === 'Mostly Sunny' || e === 'Clear' || e === 'Mostly Clear' || e === 'Partly Cloudy') {
		img = 'weather-sunny';
	}
	else if (e === 'Rain') {
		img = 'weather-rain';
	}
	else if (e === 'Scattered Thunderstorms' || e === 'Scattered Showers') {
		img = 'weather-showers';
	}
	else if (e === 'Mostly Cloudy' || e === 'Cloudy') {
		img = 'weather-cloudy';
	}
	else if (e === 'Snow' || e === 'Rain and Snow') {
		img = 'weather-snow';
	}
	else if (e === 'Windy' || e === 'Breezy') {
		img = 'weather-windy';
	}

	else {
		alert(e + ' - I havent coded for this, need to add it');
	}

	// ASSIGN HERE TO TEST AN IMG
	// img = 'weather-windy';

	// HIDE OTHERS
	for (i=0; i<weatherImgNo; i++) {
		weatherImgArray[i].className = '';
	}

	// ASSIGN
	navTop.className = 'show';
	document.getElementById(img).className = 'show';
	navTempDom.innerHTML = t + '&deg; F';

	// (NOTE) NEED TO PUT THIS OUT OF LOOP, SHOULDN'T UPDATE W/ WEATHER
	navCityDom.innerHTML = weatherCity;

}

// TOUCH SWIPES
searchInputDom.addEventListener('touchstart', handleTouchStart, false);        
searchInputDom.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
  xDown = evt.touches[0].clientX;                                      
  yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
		return;
  }

  var xUp = evt.touches[0].clientX;                                    
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    if ( xDiff > 0 ) {
    	console.log(xDiff);
    	/* left swipe */ 
    	searchSwitch('r');
    } else {
    	/* right swipe */
    	searchSwitch('l');
    }                       
  }
  else {
    if ( yDiff > 0 ) {
        /* up swipe */ 
    } else { 
        /* down swipe */
    }                                                                 
  }
  /* reset values */
  xDown = null;
  yDown = null;                                             
};
