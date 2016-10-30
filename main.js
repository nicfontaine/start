// TEST

/*********************************************/
/****     EDIT SETTINGS VIA VARIABLES     ****/
/*********************************************/

//
// BASE COLOUR SETTINGS
//

// HUE, 0-360
var cpbh = 264;

// SATURATION, 0-100 (%)
var cpbs = 28;

// LIGHTNESS, 0-100 (%)
// (NOTE) LOOKS KINDA SHITTY IF YOU CHANGE
var cpbl = 64;

//
// SEARCH OPTIONS
//

// PLACEHOLDER TITLES HERE
// (NOTE) USE WHATEVER FORMAT YOU WANT HERE, DOESN'T MATTER
var searchPl = [
	' > duckduckgo',
	' > google',
	' > google maps',
	' > youtube',
	' > soundcloud',
	' > reddit',
	' > /r/',
	' > stackoverflow',
	' > aur',
	' > wikipedia'
];

// URL SLUGS HERE (THEY CORRESPOND TO TITLES ABOVE)
// (NOTE) RUN A SEARCH SOMEWHERE, GRAB IT'S URL, & CUT THE QUERY STRING (IF IT USES ONE..)
var searchUrlArray = [
	'https://duckduckgo.com/?q=',
	'https://www.google.com/#q=',
	'https://www.google.com/maps/search/',
	'https://www.youtube.com/results?search_query=',
	'https://soundcloud.com/search?q=ryan%20hemsworth',
	'https://www.reddit.com/search?q=',
	'https://www.reddit.com/r/',
	'https://stackoverflow.com/search?q=',
	'https://aur.archlinux.org/packages/?O=0&K=',
	'https://en.wikipedia.org/wiki/'
];

/*************************************************/
/****     END EDIT SETTINGS VIA VARIABLES     ****/
/*************************************************/

var searchInputDom = document.getElementById('search-input');
var searchInputCall;
var searchInputHolder;
var searchNoRepeat = 0;

// INIT INPUT PLACEHOLDER W/ FIRST SEARCH OF ARRAY
searchInputDom.placeholder = searchPl[0];
var searchPlInc = 0;
var searchLogged = [];
var searchNoTimes = 0;

searchInputDom.focus();

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
	linkBgSat: cpbs*1.12,
	linkBgLight: cpbl*1.14,
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
		console.log('row: ' + rNum + ', ' + rLength[rNum] + ' cells ');

		// MOVE TO NEW ROW
		rNum++;
		// ADD TO TOTAL ROWS
		rNumTotal++;

		rOffset[rNum] = links[i].offsetTop;

		// RESET COUNTER
		rLinkCount+=1;

		// GOTTEN TO NEW OFFSET LINE, SO WE ADD 1 TO NEW ROW ARRAY INDEX
		rLength[rNum] = 1;

	}

}

// LOG IT AGAIN WHEN LOOPING HAS FINISHED, FOR LAST ROW
console.log('row: ' + rNum + ', ' + rLength[rNum] + ' cells ');

//
// MOVE THROUGH LINKS
//

document.getElementById('ul-links').addEventListener('keydown', function (e) {

  // KEY LEFT
  if (e.which == 37) {
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
  if (e.which == 39) {
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
  if (e.which == 38) {
    e.preventDefault();

		if (linkFocus-rLength[0] > -1) {
			linkFocus -= rLength[0];
			focusLink();
		}

		else {
			// linkFocus = linkFocus + rNum*rLength[0];
			toggleTab = 'search';
			searchInputDom.focus();
		}

  }

  // KEY DOWN
  if (e.which == 40) {
    e.preventDefault();

		// IF THE NEXT linkFocus WILL BE LESS THAN THE LAST INDEX OF rLength
		if (linkFocus+rLength[0] < rLength[rLength.length-1]) {
			linkFocus += rLength[0];
			focusLink();
		}

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

	// KEY TAB
	// (NOTE) NOW THAT WE HAVE UP/DOWN BTW LINKS & SEARCH, DO WE NEED TAB?
	// if (e.keyCode == 9) {
	//
	// 	// TOGGLE IN ACTION, CHECK IF WE WERE AT LINKS
	// 	if(toggleTab === 'links') {
	// 		e.preventDefault();
	// 		toggleTab = 'search';
	// 		searchInputDom.focus();
	// 	}
	// 	// NOT, WE'RE AT SEARCH. FOCUS FIRST LINK
	// 	else {
	// 		links[0].focus();
	// 		toggleTab = 'links';
	// 	}
	//
	// }

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
}

searchInputDom.addEventListener('keydown', function(e) {

	searchInputCall = searchInputDom.value.toLowerCase();

	// KEY ENTER
	if (e.keyCode == '13' && searchInputCall !== '') {
		console.log('var searchInputCall = ' + searchInputCall);
		window.open(searchUrlArray[searchPlInc] + searchInputCall);

		searchInputDom.value = '';

		// LOG SEARCHES, & ITER NUMBER OF TIMES, FOR LOOKUP
		searchLogged.push(searchInputCall);
		searchNoTimes++;

		searchNoRepeat = 0;
		// searchPlInc++;

	}

	// KEY TAB
	// (NOTE) NEED THIS STILL?
	// if (e.keyCode == '9') {
	// 	e.preventDefault();
	// 	searchInputDom.blur();
	// 	linkFocus = 0;
	// 	toggleTab = 'links';
	// 	focusLink();
	// }

	// KEY TAB, ANNOYING. LETS DISABLE IT
	if (e.keyCode == '9') {
		e.preventDefault();
	}

	// KEY DOWN
	if (e.which == 40) {
		e.preventDefault();
		searchInputDom.blur();
		linkFocus = 0;
		toggleTab = 'links';
		focusLink();
	}

	// KEY LEFT
	if (e.which == 37) {
		e.preventDefault();

		searchSwitch('l');

	}

	//KEY RIGHT
	if (e.which == 39) {
		e.preventDefault();

		searchSwitch('r');

	}

	// KEY BACKSPACE
	if (e.keyCode == '8') {
		e.preventDefault();
		// JUST CLEAR IT ALL TO KEEP SIMPLE & QUICK
		clearSearch();
	}

	// KEY UP
	if (e.keyCode == '38') {
		searchNoRepeat++;
		// UNTIL WE'VE GONE THROUGH ALL LOGGED SEARCHES
		if (typeof searchLogged[searchNoTimes-searchNoRepeat] !== 'undefined') {
			searchInputDom.value = searchLogged[searchNoTimes-searchNoRepeat];
		}
		// CLEAR INPUT, & RESET LOG CALL INC - ALLOWS LOOPING THROUGH CALLS
		else {
			clearSearch();
		}
	}

});

function clearSearch() {
	// RESET SEARCH INPUT
	searchInputDom.value = '';
	// RESET NO OF CONSECUTIVE SEARCH LOG CALLS
	searchNoRepeat = 0;
}

// (NOTE) PROB SHOULD MOVE L/R LOGIC INTO FUNCTION CAUSE WE'RE JUST REPEATING OURSELVES THERE
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

	// SWAP PLACEHOLDER
	searchInputDom.placeholder = searchPl[searchPlInc];

	// REC PREV SEARCH INPUT
	searchInputHolder = searchInputCall;
	dotChange();

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
			}

		}
	},500);

	clearSearch();

}

//
// DOTS
//

for (i=0; i<searchPl.length; i++) {
	var itmDot = document.getElementById('dot-container').lastChild;
	var clnDot = itmDot.cloneNode(true);
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
