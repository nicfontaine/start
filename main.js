/*********************************************/
/****     EDIT SETTINGS VIA VARIABLES     ****/
/*********************************************/
'use strict';
//
// BASE COLOUR SETTINGS
//

function randomInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

// HUE, 0-360
// var cpbh = randomInt(0,360);
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
// (NOTE) YOU CAN MOVE 'url' TO ANY INDEX OR REMOVE, JUST LEAVE IT'S NAME...
// (NOTE) ...IT HAS A SPECIFIC CASE THAT SEARCHES FOR IT BY NAME
var searchPlaceholders = [
	'url',
	'duckduckgo',
	// 'google',
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
var searchUrls = [
	'',
	'https://duckduckgo.com/?q=',
	// 'https://www.google.com/#q=',
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


// SET TO FALSE IF YOU'D RATHER HAVE THE MAGNIFYING GLASS ICON FOR EVERY SEARCH
var searchIconSwap = true;

var searchIcons = [
	'<i class="fa fa-globe" aria-hidden="true"></i>',
	'<i class="fa fa-search search-icon" aria-hidden="true"></i>',
	// '<i class="fa fa-google" aria-hidden="true"></i>',
	'<i class="fa fa-map-marker" aria-hidden="true"></i>',
	'<i class="fa fa-youtube" aria-hidden="true"></i>',
	'<i class="fa fa-soundcloud" aria-hidden="true"></i>',
	'<i class="fa fa-reddit" aria-hidden="true"></i>',
	'<i class="fa fa-stack-overflow" aria-hidden="true"></i>',
	'<i class="fa fa-linux" aria-hidden="true"></i>',
	'<i class="fa fa-wikipedia-w" aria-hidden="true"></i>'
];

/*************************************************/
/****     END EDIT SETTINGS VIA VARIABLES     ****/
/*************************************************/

var keyCtrlRelease;

document.addEventListener('keydown', function() {

	// DEFAULT keyCtrlDown BACK TO false AFTER TYPING DELAY
	clearTimeout(keyCtrlRelease);

	keyCtrlRelease = setTimeout(function() {
		console.log('------ 3 seconds for clearing keyCtrlDown');
		keyCtrlDown = false;
	},3000);

});

// HIDE CURSOR AFTER DELAY
var cursorToggleShow = true;
var cursorTimer;
document.addEventListener('mousemove', function() {

	!cursorToggleShow ? function() {
		cursorToggleShow = true;
  	document.getElementsByTagName('html')[0].style.cursor = 'auto';
  }()
  :
	function() {
		// DISABLE IF MOUSE IS STILL MOVING
		clearTimeout(cursorTimer);
		cursorToggleShow = true;
		// HIDE AFTER DELAY, & ALLOW SHOW BY SETTING TOGGLE TO FALSE
		cursorTimer = setTimeout(function() {
			document.getElementsByTagName('html')[0].style.cursor = 'none';
			cursorToggleShow = false;
		}, 400);
	}();
	
});

var inputSearch = document.getElementById('search-input');
var inputFake = document.getElementById('input-fake');
var focusToggle = true;

// SEARCH OBJ
var si = {
	link: searchUrls,
	pl: searchPlaceholders,
	plInc: 0,
	numSearched: 0,
	lookupRepeat: 0,
	icon: searchIcons,
	inputD: document.getElementById('search-input'),
	inputFake: document.getElementById('input-fake'),
	log: [],
	iconD: document.getElementById('input-search-icon'),
	swapIcons: searchIconSwap,
	val: '',
	valHolder: '',
	// &nbsp; TO ' ' ENCODER/DECODER
	codec: function(input,encode) {
		var out = encode ?
		input.replace(/\s/g, '&nbsp;') // ENCODE TO SPACE PLACEHOLDERS
		:
		input.replace(/&nbsp;/g, ' '); // DECODE TO SPACES
		return out;
	},
	deletion: '',
	deletionActive: false,
	inputFocusToggle: function(tf) {
		tf ? ( // FOCUS
			inputFake.classList.remove('input-cursor-inactive'),
			inputSearch.classList.add('focus')
		) : ( // UNFOCUS
			inputFake.classList.add('input-cursor-inactive'),
			inputSearch.classList.remove('focus')
		);
	}
}

// -------------------------------

// ONLOAD
window.onload = function() {
	si.inputD.value = '';
}

// INIT INPUT PLACEHOLDER TEXT W/ FIRST SEARCH OF ARRAY
si.inputD.placeholder = si.pl[0];

si.inputD.focus();
inputSearch.classList.add('focus');
// ONLY ALLOW IF USER CHOOSES THIS FUNCTIONALITY
if (si.swapIcons) { si.iconD.innerHTML = si.icon[0]; }
else {
	si.iconD.innerHTML = '<i class="fa fa-search search-icon" aria-hidden="true"></i>';	
}

var links = document.getElementById('ul-links').getElementsByTagName('a');
var linksNo = links.length;
var linkFocus = 0;
var linkFocusOffTop;

//
// COLOUR ASSIGNMENT, DONE HERE INSTEAD OF CSS SO WE CAN HAVE SOME SLIGHT HUE SHIFT
//


var colorfy = function colorfy() {
	cpbh = randomInt(0,360);
	// cpbl = randomInt(44,54);
	cpbl = randomInt(30,58);
	cpbs = randomInt(17,19);

	var cpMods = {
		linkBgHue: cpbh*1.01,
		linkBgSat: cpbs*1.16,
		linkBgLight: cpbl*1.27
	}

	// ASSIGN BODY BG COLOUR
	document.getElementsByTagName('body')[0].style.backgroundColor = colourConstructor(cpbh,cpbs,cpbl);

	// CACHE IT SO WE DON'T CALC IT EVERY TIME IN THE LOOP
	var linksColCalc = colourConstructor(cpMods.linkBgHue,cpMods.linkBgSat,cpMods.linkBgLight);
	for (var i=0; i<linksNo; i++) {
		links[i].style.background = linksColCalc;
	}

	// BUILD THE HSL VALUES & RETURN
	function colourConstructor (h,s,l) {
		var hslCombo = 'hsl(' + h + ',' + s + '%,' + l + '%)';
		return hslCombo;
	}

};
colorfy();


// DATE
var navDateDom = document.getElementById('date-d');
var navTimeDom = document.getElementById('date-t');
var timeLargeR = document.getElementById('time-large-r');
var timeLargeL = document.getElementById('time-large-l');

var dateD = new Date();
navDateDom.innerHTML = dateD.toDateString();
// TIME

function clock() {

	var dateT = new Date();
	var dateH = dateT.getHours();
	if (dateH > 12) {
		dateH-=12;
	}
	var dateM = dateT.getMinutes();
	if (dateM.toString().length < 2) {
		dateM = '0' + dateM.toString();
	}
	var dateS = dateT.getSeconds();
	if (dateS.toString().length < 2) {
		dateS = '0' + dateS.toString();
	}
	navTimeDom.innerHTML = dateH + ':' + dateM + ':' + dateS;
	if (dateH.toString().length < 2) {
		dateH = '0' + dateH.toString();
	}
	timeLargeL.innerHTML = dateH;
	timeLargeR.innerHTML = dateM;

	setTimeout(clock,1000);

}
clock();

var dotSectionDomArray = document.getElementsByClassName('section-no-dots');

// SHOW LINKS ON LOAD, IN SERIES
var showInc = 0;
function timeoutShow() {
	setTimeout(function() {
		// links[showInc].classList.add('show');
		fadeIn(links[showInc]);
		showInc++;
		if (showInc<linksNo) {
			timeoutShow();
		}
		// CAN'T COUNT TILL AFTER ALL TILES ARE DISPLAYED
		else {
			countEm(); 
		}
	},45);
}
setTimeout(function() { timeoutShow(); }, 400);

//
// LET'S FUCK WIT DIS LINK GRID THING
//

// ROW NUMBER WE'RE ON
var rNum;
// TOTAL ROW COUNT, NOT STATIC
var rNumTotal;
// VERTICAL OFFSET OF ROWS
var rOffset = [];
// NUMBER OF LINKS IN EACH ROW, END COUNTING INDEX WHEN OFFSET CHANGES
var rLength = [];
// USED TO COUNT THROUGH ROWS, & ASSIGN TO ARRAYS. NOT STATIC
var rLinkCount;

// TRIGGERED AFTER END OF LINK SHOW LOOP
var countEm = function countEm() {
	// RESET THESE WHENEVER CALLED
	rNum = 0;
	rNumTotal = 1;
	rOffset = [];
	rLength = [];
	rLinkCount = 0;
	// INIT ROW 1 YVal FROM FIRST CELL
	// START US OFF W/ THE FIRST ONE, TO COMPARE TO
	// YES, WE NEED THIS
	rOffset[rNum] = links[0].offsetTop;

	for (var i=0; i<linksNo; i++) {
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
			// MOVE TO NEW ROW, & ADD TO TOTAL ROW COUNT
			rNum++;
			rNumTotal++;
			rOffset[rNum] = links[i].offsetTop;
			// RESET COUNTER
			rLinkCount++;
			// INDEXES ARE TOTALS, KEEP ADDING TOTAL LINK COUNT
			rLength[rNum] = rLinkCount;
		}
	}
	// LOG IT AGAIN WHEN LOOPING HAS FINISHED, FOR LAST ROW
	console.log('row: ' + rNum + ', ' + rLength[rNum] + ' total cells ');
};

//
// WINDOW RESIZING
//

var hasResized = false;
var resizeTimer;
window.onresize = function() {

	if (!hasResized) {
		hasResized = true;
	}

  // windowIW = window.innerWidth;

	// DISABLE IF USER IS STILL RESIZING, SO NOT CONSTANTLY FIRING
	clearTimeout(resizeTimer);

	resizeTimer = setTimeout(function() {
		console.log('resizing');
		// REFACTOR GRID
		countEm();
	}, 250);

}

//
// MOVE THROUGH LINKS
//

document.getElementById('ul-links').addEventListener('keydown', function (e) {

  // KEY LEFT
  if (e.keyCode == '37') {
    e.preventDefault();

    // // INC ONLY IF >=1, IF NOT, RESET TO -1
    linkFocus>=1 ? linkFocus-- : linkFocus = linksNo-1;

		focusLink();

  }

  // KEY RIGHT
  if (e.keyCode == '39') {
    e.preventDefault();

    linkFocus<linksNo-1 ? linkFocus++ : linkFocus=0;

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
			focusSearch();
			// ONLY SHOW IF BLANK
			if (si.val.length === 0) {
				si.inputD.classList.remove('search-hide');				
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
			// toggleTab = 'search';
			si.inputD.focus();
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
	// FOCUS
  if (linkFocus >= 0 && linkFocus < linksNo) {
  	links[linkFocus].focus();
    linkFocusOffTop = links[linkFocus].offsetTop;
  }
}

//
// SEARCH
//

function focusSearch() {
	si.inputD.focus();
	si.inputFocusToggle(true);
}

var cursorMoveEnable = false;
var searchPreMoveDst = 103;
var searchPreMoveInc = 0;

// var inputFake = document.getElementById('input-fake');
var rejectArray = ['16', '18', '8', '17'];
var keyCtrlDown = false;

si.inputD.addEventListener('keyup', function(e) {
	// TOGGLE WHENEVER KEY IS RELEASED
	keyUpEnable = true;
	// CTRL
  if (e.keyCode === 17) {
    keyCtrlDown = false;
  }
});

si.inputD.addEventListener('keydown', function(e) {

	// BACKSPACE
	if (e.keyCode === 8) {
		if (!keyCtrlDown) {
			si.val = si.val.replace(/&nbsp;/g, '\xa0');
			si.val = si.codec(si.val,false);
			// MERGE ANY CONTINUOUS SPACES TO 1 SPACE
			si.val = si.val.replace(/\s\s+/g, ' ');
			// REMOVE LAST SPACE OR CHAR
			inputFake.innerHTML = si.val.substring(0,si.val.length-1);
		}
		// SHOW PLACEHOLDER WHEN DOWN TO NO CHARS
		if (si.val.length <= 1) {
			si.inputD.classList.remove('search-hide');
			console.log('removing');
			si.inputD.value = '';
		}
	}

	// DON'T OVERWRITE IF IS UP KEY
	if (e.keyCode !== 38) {
  	si.val = inputFake.innerHTML;
	}

	// CTRL
	if (e.which === 17) {
		keyCtrlDown = true;
	}

	// SPACE
	if (e.keyCode === 32) {
		// p = p + '&nbsp;';
		e.preventDefault();
		si.val = inputFake.innerHTML;
		si.val = si.val + '\xa0';
		inputFake.innerHTML = si.val;
	}

	// CTRL KEY IS DOWN, WAIT FOR COMBO TO TRIGGER
	if (keyCtrlDown) {

		// KEY 'C'
		if (e.which === 67) {
			colorfy();
			// (NOTE) IT"S BEING ADDED BACK FURTHER DOWN SOMEWHERE, PROB 'keypress'
			if (si.val.length < 1) {
				si.inputD.classList.remove('search-hide');	
			}
		}

		// si.val = si.val.replace(/&nbsp;/g, ' ');
		var l = si.val.lastIndexOf('&nbsp;');
		// var l = inputFake.innerHTML.lastIndexOf(String.fromCharCode(160));

		// CTRL + BACKSPACE
		if (e.which === 8) {
			// console.log('ctrl + backspace');
			e.preventDefault();

			// IF STRING ENDS IN '&nbsp;' REMOVE IT BEFORE REMOVING LAST WORD
			if (l === (si.val.length)-6) {
				si.val = si.val.substring(0,si.val.length-6);

				// CONVERT TO ' ', MERGE SPACES, REMOVE ANY OFF END
				si.val = si.codec(si.val.replace(/&nbsp;/g, '\xa0').replace(/\s\s+/g, ' '),true);

				// RE LOG, NEW BREAKING SPACE INDEX
				l = si.val.lastIndexOf('&nbsp;');
			}
			// CACHE DELETED VALUE
			si.deletion = si.val.substring(l,si.val.length);
			si.deletion = si.deletion.replace(/&nbsp;/g, '');

			// SET si.val W/O LAST WORD
			si.val = si.val.substring(0,l);
			// ADD BACK SPACE CHAR TO END, OR SHOW PLACEHOLDER
			// (NOTE) PLACEHOLDER SHOW INSTANTLY WHEN ctrl + backspace. NEED DELAY
			si.val.length > 0 ? si.val += '\xa0': si.inputD.classList.remove('search-hide');

			// ADD DELETION SPAN FOR STYLE, THEN DELETE
			inputFake.innerHTML = si.val + '<span id="deletion">' + si.deletion + '</span>';
			si.deletionActive = true;
			console.log('deletionActive true');
			si.delD = document.getElementById('deletion');
			si.delD.style.width = si.delD.clientWidth.toString() + 'px';

			si.inputFocusToggle(false);
			setTimeout(function(){ si.delD.style.width = '0px'; },200);
			setTimeout(function(){ 
				inputFake.innerHTML = si.val;
				si.inputFocusToggle(true);
				si.deletionActive = false;
				console.log('deletionActive false');
			},300);

			si.inputD.value = si.val;
		}

		if (e.which === 9) {
			keyCtrlDown = false;
		}

		// KEY A
		if (e.which === 65) {
			// DISABLE ANNOYING CTRL+A HIGHLIGHT
			e.preventDefault();
			console.log('key a');
		}

		// KEY V - ENABLE PASTING)
		if (e.which === 86) {

		}

	}

});

si.inputD.addEventListener('keypress',function(e) {

	// HIDE PLACEHOLDER WHEN TYPING, BUT DISABLED IF UP
	// NOT ON backspace, up, OR IF keyCtrlDown
	if (e.keyCode !== 38 && e.keyCode !== 8 && !keyCtrlDown) {
		si.inputD.classList.add('search-hide');
	}

	// IF NOT IN ARRAY
	if (rejectArray.indexOf(e.keyCode.toString()) < 0) {

		var k = e.which;

		// ONLY ALLOW IF UP KEY IS NOT DISALLOWING
		if (keyUpEnable) {
			// ADD CHAR IF 'CTRL' ISN'T DOWN
			if (!keyCtrlDown && !si.deletionActive) {
				inputFake.innerHTML = si.val + String.fromCharCode(k).toLowerCase();						
			}
			// 'CTRL' + KEY COMBOS
			else {
				// 'CTRL + V'
				if (String.fromCharCode(k).toLowerCase() === 'v') {
					console.log('ctrl + v, paste');
				}
			}

			// ADD LETTER FROM KEYCODE TO END OF FAKE INPUT
			// (NOTE) THIS IS WHERE ALL LETTER ADDING FROM TYPING TAKES PLACE
		}
		// UPDATE W/ LAST ADDED LETTER
		// MAKE SURE TO REMOVE .deletion SPAN IF STILL THERE
		si.val = inputFake.textContent || inputFake.innerText;

	}

	// KEY ENTER
	if (e.keyCode == '13' && si.val !== '') {
		console.log('var si.val = ' + si.val);
		si.inputD.classList.remove('search-hide');
		console.log('removing search hide');
		// IF NOT FIRST INDEX - URL SEARCH
		if (si.plInc > 0) {
			// window.open(si.link[si.plInc] + si.val);
			// REMOVE SPACE ENTITIES, REPLACE W/ SPACE
			// q = si.val.replace(/&nbsp;/g, ' ');
			// q = si.val.replace(/\s\s+/g, ' ');

			// var q = si.val.replace(/&nbsp;/g, ' ');
			var q = si.codec(si.val,false);
			// q = si.val.replace(/\s\s+/g, ' ');
			window.open(si.link[si.plInc] + q);
		}
		// JUST SEARCH INPUT AS FULL URL
		else {
			// NO HTTP OR HTTPS, NEED TO MAKE IT A REAL URL
			if (si.val.indexOf('https://') === -1 && si.val.indexOf('http://') === -1) {
				window.open('http://' + si.val);
			}
			// VALID, FULL URL
			else {
				window.open(si.val);
			}
		}

		inputFake.innerHTML = '';

		si.inputD.value = '';

		// LOG SEARCHES, & ITER NUMBER OF TIMES, FOR LOOKUP
		si.log.push(si.codec(si.val,false));
		si.numSearched++;

		si.lookupRepeat = 0;
		// si.plInc++;

	}

	// KEY TAB, ANNOYING. LETS DISABLE IT
	if (e.keyCode == '9') {
		e.preventDefault();
	}

});

// JUST FOR ARROW KEYS, TY CHROME AND IE!
var keyUpEnable = true;

//
// SEARCH INPUT KEYDOWN
//

si.inputD.addEventListener('keydown', function(e) {

	// KEY DOWN
	if (e.keyCode == '40') {
		e.preventDefault();
		si.inputD.blur();
		linkFocus = 0;
		// toggleTab = 'links';
		focusLink();

		si.inputFocusToggle(false);
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
		if (keyUpEnable) {
			keyUpEnable = false;
			si.lookupRepeat++;
			// UNTIL WE'VE GONE THROUGH ALL LOGGED SEARCHES
			console.log(si.numSearched - si.lookupRepeat);
			if (typeof si.log[si.numSearched-si.lookupRepeat] !== 'undefined') {
				si.inputD.value = si.log[si.numSearched-si.lookupRepeat];
				inputFake.innerHTML = si.log[si.numSearched-si.lookupRepeat];
				si.inputD.classList.add('search-hide');
			}
			// CLEAR INPUT, & RESET LOG CALL INC - ALLOWS LOOPING THROUGH CALLS
			else {
				clearSearch();
				if (si.inputD.classList.contains('search-hide')) {
					si.inputD.classList.remove('search-hide');
				}
				si.lookupRepeat = 0;
			}
		}
	}
	
});

function clearSearch() {
	// console.log('clearSearch();');
	// RESET SEARCH INPUT
	si.inputD.value = '';
	si.val = '';
	inputFake.innerHTML = '';
	// RESET NO OF CONSECUTIVE SEARCH LOG CALLS
	si.lookupRepeat = 0;
}

// SWITCH SEARCH L & R W/ INPUT PARAMS
function searchSwitch(dir) {

	if (dir === 'l') {

		// DEC SEARCH NO IF GREATER THAN 0
		if (si.plInc > 0) {
			si.plInc--;
		}
		// GO TO END
		else {
			si.plInc = si.pl.length-1;
		}

	}

	else if (dir === 'r') {

		// INC SEARCH NO IF LESS THAN ARRAY LENGTH
		if (si.plInc < si.pl.length-1) {
			si.plInc++;
		}
		// BACK TO START
		else {
			si.plInc = 0;
		}

	}

	si.iconD.innerHTML = si.icon[si.plInc];

	// SWAP PLACEHOLDER
	si.inputD.placeholder = si.pl[si.plInc];
	// SHOW PLACEHOLDER
	si.inputD.classList.remove('search-hide');

	dotChange();

	// CACHE & CHECK FOR VAL, REASSIGN IF EXISTS
	searchReassign();
}

function searchReassign() {

	// REC PREV SEARCH INPUT
	si.valHolder = si.val;

	// RE-ASSIGN VALUE, W/ DELAY
	setTimeout(function() {
		// console.log(si.valHolder.replace(/&nbsp;/g, ' '));
		// THERE WAS A VALUE, REASSIGN IT
		// if (si.valHolder.replace(/&nbsp;/g, ' ').length > 0) {
		if (si.codec(si.valHolder,false).length > 0) {
			
			si.val = si.valHolder;
			inputFake.innerHTML = si.valHolder;
			// HIDE PLACEHOLDER
			si.inputD.classList.add('search-hide');
		}
		// SEARCH VALUE IS ONLY WHITE SPACE, RESET
		else {
			clearSearch();
			si.valHolder = '';
		}
	},200);

	// ALWAYS CLEAR IT, setTimeout WILL RE-ASSIGN
	clearSearch();

}

//
// DOTS
//

// KEEP i & len LOCAL IN IIFE
(function dotMaker() {
	// DECLARE OUTSIDE LOOP
	var dotFrag = document.createDocumentFragment(),
	itmDot = document.getElementById('dot-container').lastChild,
	clnDot,
	len = si.pl.length,
	i;
	for (i=0; i<len; i++) {
		clnDot = itmDot.cloneNode(true);

		clnDot.innerHTML = si.icon[i];
		// dotSectionDomArray[0].appendChild(clnDot);
		dotFrag.appendChild(clnDot);
	}
	// APPEND AS ONE
	dotSectionDomArray[0].appendChild(dotFrag);
})();

// GET DOT FROM CONTAINER
// ADD SEL CLASS TO FIRST
var noDotEachDom = dotSectionDomArray[0].getElementsByClassName('no-dot');
noDotEachDom[0].classList.add('no-dot-sel');

// CHANGE DOTS, LOCK VARS LOCALLY
var dotChange = (function() {
	// REMOVE SEL CLASS FROM ALL
	var i,
		len = noDotEachDom.length;
	for (i=0; i<len; i++) {
		noDotEachDom[i].className = 'no-dot';
	}
	// ADD TO CURRENT IN ROTATION VIA si.plInc
	noDotEachDom[si.plInc].classList.add('no-dot-sel');
});


// IIFE FOR DOT CLICKING
(function dotClicker() {
	var dotChildren = document.getElementsByClassName('section-no-dots')[0].children,
		len = dotChildren.length,
		i;
	for (i=0; i<len; i++) {
		(function(index){
			dotChildren[i].addEventListener('click', function() {
				// DISABLE THE UN-FOCUS FLASH ON CLICK PRESS
				// focusSearch();
				// RE-ASSIGN INCREMENTAL PLACEHOLDER VAR
				si.plInc = index;
				// SWAP ICON, PLACEHOLDER, SHOW PLACEHOLDER
				si.iconD.innerHTML = si.icon[si.plInc];
				si.inputD.placeholder = si.pl[si.plInc];
				si.inputD.classList.remove('search-hide');
				// REMOVE SEL CLASS FROM ALL
				for (var i=0; i<noDotEachDom.length; i++) {
					noDotEachDom[i].className = 'no-dot';
				}
				noDotEachDom[si.plInc].classList.add('no-dot-sel');
				searchReassign();
			});
		})(i);
	}
})();

//
// WEATHER
//

var weatherBgDom = document.getElementById('weather-bg');
var weatherImgArray = weatherBgDom.getElementsByTagName('div');
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
				},
				error: function(error) {
      		// SOME ERROR NOTIFICATION HERE
					console.log('weather error');
    		}
	  });

		// REFRESH EVERY 20 SEC
		setTimeout(function() {
			getWeather();
			$.getJSON("https://jsonip.com/?callback=?", function (data) {
			  //console.log(data);
			  //alert(data.ip);
			  document.getElementById("ip").innerHTML = 'IP: ' + data.ip;
			});
		},20000);

		}
	// INIT, ONCE
	if (initWeatherLoad) {
		getWeather();
		initWeatherLoad = false;
	}

}

function weatherSwap(e,t) {
	var img = '',
		imgArray = weatherImgArray,
		imgLen = imgArray.length,
		i = 0;

		// Sunny, Partly Cloudy, Mostly Cloudy, Breezy, Cloudy, Windy, Thunderstorms, Rain and Snow, Snow, Scattered Thunderstorms, Rain, Scattered Showers, Mostly Sunny

	if (e === 'Sunny' || e === 'Mostly Sunny' || e === 'Clear' || e === 'Mostly Clear' || e === 'Partly Cloudy') {
		img = 'weather-sunny';
	}
	else if (e === 'Rain' || e === 'Showers' || e === 'Heavy Rain') {
		img = 'weather-rain';
	}
	else if (e === 'Scattered Thunderstorms' || e === 'Scattered Showers') {
		img = 'weather-showers';
	}
	else if (e === 'Mostly Cloudy' || e === 'Cloudy') {
		img = 'weather-cloudy';
	}
	else if (e === 'Snow' || e === 'Rain And Snow') {
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
	for (i=0; i<imgLen; i++) {
		imgArray[i].className = '';
	}

	// ASSIGN, & SHOW TOP NAV & TIME
	navTop.classList.add('show');
	timeLargeL.classList.add('show');
	timeLargeR.classList.add('show');

	document.getElementById(img).className = 'show';
	navTempDom.innerHTML = t + '&deg; F';

	// (NOTE) NEED TO PUT THIS OUT OF LOOP, SHOULDN'T UPDATE W/ WEATHER
	navCityDom.innerHTML = weatherCity;

}

// TOUCH SWIPES
si.inputD.addEventListener('touchstart', handleTouchStart, false);        
si.inputD.addEventListener('touchmove', handleTouchMove, false);

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

// fade out

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

// fade in

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}
