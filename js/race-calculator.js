const eligibleorder = document.getElementById('eligibleorder');
const allorder = document.getElementById('allorder');

const eventdesc = document.getElementById('event-desc');
const eventdetail = document.getElementById('event-detail');

const homehead = document.getElementById('hometeamheader');
const homeorder = document.getElementById('homeorder');
const homeresult = document.getElementById('homeresult');
const hometotal = document.getElementById('hometotal');

const visithead = document.getElementById('visitteamheader');
const visitororder = document.getElementById('visitororder');
const visitorresult = document.getElementById('visitorresult');
const visitortotal = document.getElementById('visitortotal');

const buttons = document.querySelectorAll('#keypad button');
const resetButton = document.getElementById('reset-button');
const undoButton = document.getElementById('undo-button'); 
const menuButton = document.getElementById('menu-button'); 
const dqButton = document.getElementById('dq-button'); 
const saveButton = document.getElementById('save-button'); 

const footnote1 = document.getElementById('footerText1'); 
const footnote2 = document.getElementById('footerText2');
const footnote3 = document.getElementById('footerText3');
const footnote4 = document.getElementById('footerText4');
const footnote5 = document.getElementById('footerText5');
const footnoteX = document.getElementById('footerTextX')

const caIndividualPoints = [ '6', '4', '3', '2', '1', '0', '0', '0' ];
const caRelayPoints = [ '8', '4', '2', '0', '0', '0', '0', '0' ];
const caExhibitionLanes = [ '1', '0', '0', '0', '0', '0', '0', '1' ];
const caAllOpenLanes = [ '0', '0', '0', '0', '0', '0', '0', '0' ];

const queryParams = new URLSearchParams(window.location.search);

var aOverallPlace = [];
var aNoPointLanes = [];
var aExhibitionLanes = [];
var bAllowDQ = false; 
var sLaneInstruction = '';
var sEventDescription = ''; 

// iEventNumber - (query Parameter)
// 0 based Event counter, 12 events to the meet
var iEventNumber = queryParams.get('iEventNumber');
iEventNumber = ( iEventNumber == null ) ? 0 : iEventNumber; 

// iGender - (query Parameter)
// 0 = Girls
// 1 = Boys
// -1 = Unknown 
var iGender = queryParams.get('iGender');
iGender = ( iGender == null ) ? -1 : iGender;

if ( iGender > -1 ) {
	sEventDescription = ( iGender == 0 ) ? 'Girls - ': 'Boys - '; 
}
// sEventName - (query Parameter)
// Event Description, 12 events to the meet
var sEventName = queryParams.get('sEventName');
sEventName = ( sEventName == null ) ? '' : sEventName;
sEventDescription += ( sEventDescription.length > 0 ) ? sEventName : ''; 

// Pool Configuration 
// 1 = 8 Lanes, 1 and 8 exhibition
// 2 = 8 Lanes 
// 3 = 6 Lanes
var iPoolMode = 1; 
var iTotalLanes = 8;

if (localStorage.getItem('PoolMode') !== null) {
	// Key exists, so lets load it into memory before display. 
	iPoolMode = localStorage.getItem('PoolMode');
} 
 
if ( iPoolMode == 1 ) {
	// 1 = 8 Lanes, 1 and 8 exhibition
	iTotalLanes = 8; 
	aNoPointLanes = caExhibitionLanes.slice();
	aExhibitionLanes = caExhibitionLanes.slice();
	sLaneInstruction = 'Lanes 1 and 8 are Exhibition.';
} else if ( iPoolMode == 2 ) {
	// 2 = 8 Lanes 
	iTotalLanes = 8; 
	aNoPointLanes = caAllOpenLanes.slice();
	aExhibitionLanes = caAllOpenLanes.slice();
	sLaneInstruction = '';
} else {
	// 3 = 6 Lanes
	iTotalLanes = 6; 
	aNoPointLanes = caAllOpenLanes.slice();
	aExhibitionLanes = caAllOpenLanes.slice();
	sLaneInstruction = '';
	// hide lanes 7 and 8 from the user
	document.getElementById( '7-button' ).remove(); 
	document.getElementById( '8-button' ).remove(); 
}

// iCompetitionMode - (query Parameter)
// Sould we save the Event as part of a Meet? 
// 1 = Event only
// 2 = Save for Meet
var iCompetitionMode = queryParams.get('iCompetitionMode');
iCompetitionMode = ( iCompetitionMode == null ) ? 1 : iCompetitionMode;
if ( iCompetitionMode == 1 ) {
	// We don't need to save the scores if we ae only scoreing an individual race.
	// remove the save button 
	document.getElementById( 'save-button' ).remove(); 
}

// Event Type (query Parameter)
// 1 = Individual Only 
// 2 = Relay Only
// 3 = Diving 
var iEventMode = queryParams.get('iEventMode');
iEventMode = ( iEventMode == null ) ? 1 : iEventMode;

if ( iEventMode == 1 ) {
	eventdesc.textContent = 'Individual Event';
	
	footnote2.textContent = 'Click on swim lane buttons in the order the competitors finish.';
	
} else if ( iEventMode == 2 ) {
	eventdesc.textContent = 'Relay Event';
	footnote1.textContent = 'Points are awarded as 8-4-2. No team can take all three relay places.'
	footnoteX.textContent = sLaneInstruction;
	footnote2.textContent = 'Click on swim lane buttons in the order the competitors finish.';
	
} else if ( iEventMode == 3 ) {
	
	eventdesc.textContent = 'Diving Event';	
	footnote1.textContent = 'Points are awarded as 6-4-3-2-1-0.'
	footnoteX.textContent = 'Click on H for Home and V for Visitor in the order the competitors placed.';
	footnote2.textContent = 'For example, H-H-V indicates Home placed 1st, 2nd but Visitors placed 3rd. ';
	
	// Make sure we have no Exhibition lanes
	aNoPointLanes = caAllOpenLanes.slice();
	aExhibitionLanes = caAllOpenLanes.slice();
		
	// Change the lane titles to home and away
	for (var iLane = 1; iLane <= iTotalLanes; iLane++) {
		oButton = document.getElementById( iLane + '-button' ); 
		if ( iLane % 2 == 0) {
			// even / Home 
			oButton.textContent = 'H';
		} else {
			oButton.textContent = 'V';
		}
	}	
}

// get the stored descriptions of the home and visiting teams
var sHomeTeamName = "Home";
if (localStorage.getItem('HomeTeamName') !== null) {
	// Key exists, so lets load it into memory before display. 
	sHomeTeamName = localStorage.getItem('HomeTeamName');
}

var sVisitTeamName = "Visitor";
if (localStorage.getItem('VisitTeamName') !== null) {
	// Key exists, so lets load it into memory before display. 
	sVisitTeamName = localStorage.getItem('VisitTeamName');
}

// Odds and evens don't really have meaning here
homehead.textContent = sHomeTeamName + ' Team (even lanes)';
visithead.textContent = sVisitTeamName + ' Team (odd lanes)';

footnote3.textContent = 'Undo rolls back the previous click.';
footnote4.textContent = 'DQ toggles to allow a second click on a lane to disqualify the competitor.';
if ( iCompetitionMode == 1 ) {
	footnote5.textContent = 'Reset clears all information. Back returns to main menu.';
} else {
	footnote5.textContent = 'Reset clears all information. Back returns to meet progression without saving.';
}

// this is typically only defined if coming from the meet progression page
eventdetail.textContent = sEventDescription; 

buttons.forEach(button => {
  button.addEventListener('click', () => {
	var sCurrentLane = button.id[0];
	
    if ( button === resetButton ) {
	  // RESET: Clear all event information
	  aOverallPlace = resetPlace( aOverallPlace );
	  aNoPointLanes = resetDQ( aNoPointLanes );
	  bAllowDQ = false;
	  
	} else if ( button === undoButton ) {
      // UNDO: Clear the last lane definition here 
	  aOverallPlace = popPlace( aOverallPlace , true );
	  
	} else if ( button === menuButton ) {
      // MENU: Back Button  
	  history.back();
	  return;
	  
	} else if ( button === saveButton ) {
	  // SAVE!
	  persistEvent ( iEventMode, iEventNumber, iGender  );
	  window.location = 'meet.html';
	  return;
	
    } else if ( button === dqButton ) {
      // DQ ON\OFF: Place the form in DQ mode 
	  if ( bAllowDQ ) {
		  bAllowDQ = false;
		  aNoPointLanes = resetDQ( aNoPointLanes );
	  } else {
		  bAllowDQ = true;
	  }
		
    } else if ( containsPlace( aOverallPlace, sCurrentLane ) ) {
	
		if ( bAllowDQ ) {
			// if the lane has aleady been defined in the finish order, 
			// the next time you click on it, we want to DQ it if it has not
			// been DQed before. If it is not an exhibition lane, we 
			// want to make sure that we unDQ it if it is in a DQ state
			// when we click on it yet again.
			var iCurrentLane = Number(sCurrentLane); 
			if ( !isExhibitionLane ( iCurrentLane ) ) 
			{
				if ( !isDQ( aNoPointLanes, iCurrentLane ) ) {
					aNoPointLanes = pushDQ( aNoPointLanes, iCurrentLane );
					console.log('DQ = ' + sCurrentLane);
		
				} else {
					aNoPointLanes = popDQ( aNoPointLanes, iCurrentLane );
					console.log('unDQ = ' + sCurrentLane);
				}
			}
		}
		
    } else {  
		// update the finish order, by parsing the button ID for lane order
		// this code assuems the remaining buttyons use the the #-button naming convention
		console.log('Button ID is ' + sCurrentLane);
		aOverallPlace = pushPlace( aOverallPlace, sCurrentLane, true );
    }
	
	updateDescriptions();
	updateButtons();
	
  });
});

function diverReplace ( spPlaces ) {
	spPlaces = spPlaces.replace('1', 'V');
    spPlaces = spPlaces.replace('3', 'V'); 
	spPlaces = spPlaces.replace('5', 'V'); 	
	spPlaces = spPlaces.replace('7', 'V'); 	
	spPlaces = spPlaces.replace('2', 'H');
	spPlaces = spPlaces.replace('4', 'H');
	spPlaces = spPlaces.replace('6', 'H');
	spPlaces = spPlaces.replace('8', 'H');
	return spPlaces;
} 

// ------------- Place handling functions 

function pushPlace( apPlaces, spStr, bpDisableButton ) {
  apPlaces.push( spStr );
  return apPlaces;
}

function popPlace( apPlaces, bpRenableButton ) {
  apPlaces.pop();
  return apPlaces;
}

function resetPlace( apPlaces ) {
  return [];
}

function containsPlace( apPlaces, spStr ) {
  return ( apPlaces.indexOf( spStr ) >= 0 );
}

// ------------- DQ handling functions 

function pushDQ( apLane, iLane ) {
  apLane[iLane-1] = '1';
  return apLane; 
}

function popDQ( apLane, iLane ) {
  apLane[iLane-1] = '0';
  return apLane;
}

function resetDQ( apLane ) {
  return aExhibitionLanes.slice();
}

function isDQ( apLane, iLane ) {
  // does the value in the DQ array already have the lane marked as DQed? 
  return ( Number(apLane[iLane-1]) == 1 );
}

function isExhibitionLane( ipLane ) {
	var iDQLane = Number( aExhibitionLanes[ipLane-1] );
	return ( iDQLane == 1 ); 	
}

function completedEvent( apPlaces, ipMax ) {
  return ( apPlaces.length == ipMax );
}

function persistEvent ( ipEventMode, ipEventNumber, ipGender  ) {
	// 1. Persist Information from the race
	// load the persisted information into memory
	// load the event into the data
	// persist it back to disk
	// 2. Call the Meet progression page back as if you were loading it from the menu
	var iHTeamPoints = 0;
	var iVTeamPoints = 0;
	var adata = null;
	
	if ( ipEventMode == 1 ) {
		// Individual (home)
		iHTeamPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 0, 1 );
		console.log('Individual ' + sHomeTeamName + ' = ' + iHTeamPoints);  
		
		// visitor 
		iVTeamPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 1, 1 );
		console.log('Individual ' + sVisitTeamName + ' = ' + iVTeamPoints); 

	} else if ( ipEventMode == 2 ) {
		// Relay (home)
		iHTeamPoints = scoreTeamRelay( aOverallPlace, caRelayPoints, aNoPointLanes, 0, 1 );
		console.log('Relay ' + sHomeTeamName + ' = ' + iHTeamPoints);  
		
		// visitor
		iVTeamPoints = scoreTeamRelay( aOverallPlace, caRelayPoints, aNoPointLanes, 1, 1 );
		console.log('Relay ' + sVisitTeamName + ' = ' + iVTeamPoints); 
	
	} else if ( ipEventMode == 3 ) {
		// Diving  (home)
		iHTeamPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 0, 1 );
		console.log('Diving ' + sHomeTeamName + ' = ' + iHTeamPoints);  
		
		// visitor
		iVTeamPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 1, 1 );
		console.log('Diving ' + sVisitTeamName + ' = ' + iVTeamPoints);  
	} 
	
	
	// if we are here then we can assume we came via the meet page
    // and we have meet infomration in the local storage. Load it. 	
	if (localStorage.getItem('myCurrentMeet') !== null) {
		
		var iVTotal = 0;
		var iMTotal = 0;
		var oRow  = null; 
		
		// Key exists, so lets load it into memory before display. 
		var sJSON = localStorage.getItem('myCurrentMeet');
		adata = JSON.parse(sJSON);

		// now lets load the data struicture backup with the data from scoring
		// ipEventNumber is the row for the data structure. 
		oRow = adata[ipEventNumber];
		if ( ipGender == 0 ) {
			// girls
			oRow.Girls_Visitor = iVTeamPoints;
			oRow.Girls_Home = iHTeamPoints;
			
			// clear out the totals for later recalculation  
			oRow = adata[adata.length -1];
			oRow.Girls_Visitor = 0;
			oRow.Girls_Home = 0; 
		
		} else {
			// boys
			oRow.Boys_Visitor = iVTeamPoints;
			oRow.Boys_Home = iHTeamPoints;
			
			// clear out the totals for later recalculation  
			oRow = adata[adata.length -1];
			oRow.Boys_Visitor = 0;
			oRow.Boys_Home = 0; 
		}
		
		iVTeamPoints = 0;
		iHTeamPoints = 0;
		
		adata.forEach(oRow => {
		
			// If row is an object, iterate over its properties
			if (typeof oRow === 'object') {
				if ( ipGender == 0 ) {
					// girls
					iVTeamPoints += oRow.Girls_Visitor;
					iHTeamPoints += oRow.Girls_Home;
				} else {
					// boys
					iVTeamPoints += oRow.Boys_Visitor;
					iHTeamPoints += oRow.Boys_Home;
				}
			}
			
		})
		

		// write the new total as needed
		oRow = adata[adata.length -1];
		if ( ipGender == 0 ) {
			// girls 
			oRow.Girls_Visitor = iVTeamPoints;
			oRow.Girls_Home = iHTeamPoints; 
		
		} else {
			// boys  
			oRow.Boys_Visitor = iVTeamPoints;
			oRow.Boys_Home = iHTeamPoints; 
		}
		 	
		// presist so the meet page can see the data 
		sJSON = JSON.stringify(adata); 
		localStorage.setItem('myCurrentMeet', sJSON);
	} 
	return; 
}

// Get a filtered list of lanes. You can get just a single team by filtering on odd or even lanes
// you can get a list of those lanes that are availbale for points by looking for those lanes that are
// not disqualified. You can get a list of plcaes or a list of lanes. 
// apPlaces list of finish order for all swimmers
// apNoPointLanes, which lanes should give points, i the array element has 1 then no points should be given 
// ipOddOrEven = 0 = Even Team, 1 = Odd Team, -1 = All  
// ipView = 0 = Lane 1 = Place
// ipDQ = 0 = Return full List, 1 = Filter DQ
// -1, 0, 1 = Points Eligible (no Exhibition + No DQ) lanes in finish order
// -1, 0, 0 = All lanes in finish order 
// 0, 1, 1 = Home Team Place Order (no Exhibition + No DQ)
// 1, 1, 1 = Visitor Team Place Order (no Exhibition + No DQ)  
function filterList( apPlaces, apNoPointLanes, ipOddOrEvenOrAll, ipView, ipDQ ) {
	var iLane = 0; 
	var iPlace = 0;
	var iDQLane = 0;  
	var aWorkingArray = apPlaces.slice(); 
	var iIndex = 0; 
	
	if ( ipDQ == 1 ) { 
		// first cycle through the existing finisher array remove 
		// any lane that has been disqualified
		for (var i = 0; i < apPlaces.length; i++) {
			// build the team finish order
			iPlace = i; 
			iLane = apPlaces[iPlace];
			iDQLane = Number( apNoPointLanes[iLane-1] );
			// if this lane was DQed remove it from the finish order
			if ( iDQLane + ipDQ == 2 ) {
				// find the index of iLane
				iIndex = aWorkingArray.indexOf(iLane);
				// now delete that lane from the working array 
				aWorkingArray.splice(iIndex, 1);
			}	
		} 
	}
	return aWorkingArray; 
}


// apPlaces list of finish order for all swimmers
// apNoPointLanes, which lanes should give points, i the array element has 1 then no points should be given 
// ipOddOrEven = 0 = Even Team, 1 = Odd Team, -1 = All  
// ipView = 0 = Lane 1 = Place
// ipDQ = 0 = Return full List, 1 = Filter DQ
function listOrder( apPlaces, apNoPointLanes, ipOddOrEvenOrAll, ipView, ipDQ ) {
	var sList = '';	
	var iLane = 0; 
	var iPlace = 0;
	var sInfo = ""; 	
	var aWorkingArray = filterList( apPlaces, apNoPointLanes, ipOddOrEvenOrAll, ipView, ipDQ );
	
    for (var i = 0; i < aWorkingArray.length; i++) {
		// build the team finish order
		iPlace = i; 
		iLane = aWorkingArray[iPlace];
		if ( ipView == 0 ) {
			// present the lane
			sInfo = String(iLane); 
		} else {
			// present the place, awards are 1 based, but arrays are 0 based, so adjust
			sInfo = String(iPlace + 1); 
		}
		// determine if we are building a complete list or a tema only list 	
		if ( ipOddOrEvenOrAll == -1 ) {
			sList += ( sList.length > 0 ) ? " - " : '';
			sList += sInfo; 
		} else if ( iLane % 2 == ipOddOrEvenOrAll ) {
			sList += ( sList.length > 0 ) ? " - " : '';
			sList += sInfo;
		}
    }
    return sList;
}


// apPlaces list of finish order for all swimmers
// apPossiblePoints = contains an array of point scoring for the event type
// apNoPointLanes, which lanes should give points, i the array element has 1 then no points should be given 
// ipOddOrEven = 0 = Even Team, 1 = Odd Team  
// ipDQ = 0 = Return full List, 1 = Filter DQ
function scoreTeam( apPlaces, apPossiblePoints, apNoPointLanes, ipOddOrEvenOrAll, ipDQ ) {
	var iLane = 0; 
	var iPlace = 0;
	var iScore = 0; 
	var iDQLane = 0; 
    var iTotalScore = 0;
	var aWorkingArray = filterList( apPlaces, apNoPointLanes, ipOddOrEvenOrAll, 1, ipDQ );
	
    for (var i = 0; i < aWorkingArray.length; i++) {
		// build the team finish order
		iPlace = i; 
		iLane = aWorkingArray[iPlace];
		iScore = Number( apPossiblePoints[iPlace] );
		iDQLane = Number( apNoPointLanes[iLane-1] );

		// detremine if we are building a complete list or a tema only list 	
		if ( iLane % 2 == ipOddOrEvenOrAll ) {
			iTotalScore += iScore;
		}
    } 
    return iTotalScore;
}

 
function scoreTeamRelay( apPlaces, apPossiblePoints, apNoPointLanes, ipOddOrEvenOrAll, ipDQ  ) {
	
	// 8-4-2
	// no team can sweap all 3 races. If they do, then 4th place gets 2 points. 
	var iRequestedTeamTotal = 0;
	var iOtherTeamTotal = 0;
	
	// Detremine the relay points for the requested team 
	iRequestedTeamTotal = Number(scoreTeam( apPlaces, apPossiblePoints, apNoPointLanes, ipOddOrEvenOrAll, ipDQ ));
	iOtherTeamTotal = Number(scoreTeam( apPlaces, apPossiblePoints, apNoPointLanes, (ipOddOrEvenOrAll == 1 ? 0 : 1), ipDQ ));
	
	if ( iRequestedTeamTotal > 12 ) {
		// relays can never sweep all 3 races, so you can never exceed 12 points
		iRequestedTeamTotal = 12;
	} else if ( iOtherTeamTotal >= 12 ) {
		// if the requested team scored 12 points, as long as this team had a lane that finshed
		// and didn't DQ then this team should get 2 points
		var aWorkingArray = listOrder( aOverallPlace, aNoPointLanes, 1, 1, 1 );
		iRequestedTeamTotal = ( aWorkingArray.length > 0 ) ? 2 : 0 ; 
	} 
	
	return iRequestedTeamTotal;  
}

function updateDescriptions() {
	var sDesc = '';
	var sTeamPlace = '';
	var iTeamIPoints = '';
	var iTeamRPoints = '';
	var sVTotal = "0";
	var sHTotal = "0"; 
 	
	// race finish order
	sDesc = listOrder( aOverallPlace, aNoPointLanes, -1, 0, 1 );
	 
	if ( iEventMode != 3 ) {
		eligibleorder.textContent =  sDesc.length > 0 ? 'For Points: ' + sDesc : '';
		sDesc = listOrder( aOverallPlace, aNoPointLanes, -1, 0, 0 );
		allorder.textContent =  sDesc.length > 0 ? 'All: ' + sDesc : ''; 
	} else  {
		// conver the lanes to divers
		sDesc = diverReplace( sDesc ); 
		eligibleorder.textContent =  sDesc.length > 0 ? sDesc : '';
		// too much info on screen for divers
		allorder.textContent = ''; 
		
	}
	
	// get the current totals for the meet 
	if (localStorage.getItem('myCurrentMeet') !== null) {
		var oRow  = null; 
		
		// Key exists, so lets load it into memory before display. 
		var sJSON = localStorage.getItem('myCurrentMeet');
		adata = JSON.parse(sJSON);

		// write the new total as needed (found in the last row)
		oRow = adata[adata.length -1];
		if ( iGender == 0 ) {
			// girls 
			sVTotal = oRow.Girls_Visitor;
			sHTotal = oRow.Girls_Home; 
		
		} else {
			// boys  
			sVTotal = oRow.Boys_Visitor;
			sHTotal = oRow.Boys_Home; 
		}
	}
	
	
	// Home Team
	sTeamPlace = listOrder( aOverallPlace, aNoPointLanes, 0, 1, 1 );
	homeorder.textContent = sTeamPlace.length > 0 ? 'Place: ' + sTeamPlace : '' ; 
	
	// Visit Team
	sTeamPlace = listOrder( aOverallPlace, aNoPointLanes, 1, 1, 1 );
	visitororder.textContent = sTeamPlace.length > 0 ? 'Place: ' + sTeamPlace : '' ;
	
	if ( iEventMode == 1 ) {
		// Individual 
		iTeamIPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 0, 1 );
		homeresult.textContent = iTeamIPoints > 0 ? 'New Individual Points: ' + iTeamIPoints : '' ;
		hometotal.textContent = ( (iTeamIPoints > 0) & (iCompetitionMode != 1) ) ? 'Total Points: ' + sHTotal + '+' + iTeamIPoints + '=' + ( Number(sHTotal) + iTeamIPoints ) : '';
		
		iTeamIPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 1, 1 );
		visitorresult.textContent = iTeamIPoints > 0 ? 'New Individual Points: ' + iTeamIPoints : '' ;
		visitortotal.textContent = ( (iTeamIPoints > 0) & (iCompetitionMode != 1) ) ? 'Total Points: ' + sVTotal + '+' + iTeamIPoints + '=' + ( Number(sVTotal) + iTeamIPoints ) : '';
	} else if ( iEventMode == 2 ) {
		// Relay
		iTeamRPoints = scoreTeamRelay( aOverallPlace, caRelayPoints, aNoPointLanes, 0, 1 );
		homeresult.textContent = iTeamRPoints > 0 ? 'New Relay Points: ' + iTeamRPoints : '' ;
		hometotal.textContent = ( (iTeamRPoints > 0) & (iCompetitionMode != 1) ) > 0 ? 'Total Points: ' + sHTotal + '+' + iTeamRPoints + '=' + ( Number(sHTotal) + iTeamRPoints ) : '';
		
		iTeamRPoints = scoreTeamRelay( aOverallPlace, caRelayPoints, aNoPointLanes, 1, 1 );
		visitorresult.textContent = iTeamRPoints > 0 ? 'New Relay Points: ' + iTeamRPoints : '' ;
		visitortotal.textContent = ( (iTeamRPoints > 0) & (iCompetitionMode != 1) ) > 0 ? 'Total Points: ' + sVTotal + '+' + iTeamRPoints + '=' + ( Number(sVTotal) + iTeamRPoints ) : '';
	} else if ( iEventMode == 3 ) {
		// Diving
		iTeamIPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 0, 1 );
		homeresult.textContent = iTeamIPoints > 0 ? 'New Event Points: ' + iTeamIPoints : '' ;
		hometotal.textContent = ( (iTeamIPoints > 0) & (iCompetitionMode != 1) ) > 0 ? 'Total Points: ' + sHTotal + '+' + iTeamIPoints + '=' + ( Number(sHTotal) + iTeamIPoints ) : '';
		
		iTeamIPoints = scoreTeam( aOverallPlace, caIndividualPoints, aNoPointLanes, 1, 1 );
		visitorresult.textContent = iTeamIPoints > 0 ? 'New Event Points: ' + iTeamIPoints : '' ;
		visitortotal.textContent = ( (iTeamIPoints > 0) & (iCompetitionMode != 1) ) > 0 ? 'Total Points: ' + sVTotal + '+' + iTeamIPoints + '=' + ( Number(sVTotal) + iTeamIPoints ) : '';
	} 
	
	
	return; 
}

function updateButtons() {
	var iCurrentLaneState = 0; 
	var iCurrentExhibition = 0;
	var oButton = null; 
	
	for (var iLane = 1; iLane <= iTotalLanes; iLane++) {
		iCurrentLaneState = aOverallPlace.indexOf( String( iLane ) );
		oButton = document.getElementById( iLane + '-button' ); 
		if ( iCurrentLaneState >= 0 ) {
			// The lane has been defined as swam
			// if can still be in 3 other states
			if ( isExhibitionLane( iLane ) ) {
				disableButton ( oButton ); 
			} else if ( isDQ( aNoPointLanes, iLane ) ) {
				DQButton ( oButton ); 
			} else {
				disableButton ( oButton ); 
			}
		} else {
			// The lane has NOT been defined as swam
			enableButton ( oButton ); 
		}
	}
	
	oButton = document.getElementById( 'dq-button' ); 
	if ( bAllowDQ ) {
	  DQButton( oButton );
	} else {
	  enableButton( oButton );
	}
	
} 

function disableButton( opButtonobject ) {
	//opButtonobject.disabled = true;
	opButtonobject.style.background = "#94d3a2";
	return;
}

function enableButton( opButtonobject ) {
	//opButtonobject.disabled = false;
	opButtonobject.style.background = "#2ea44f";
	return;
}

function DQButton( opButtonobject ) {
	//opButtonobject.disabled = false;
	opButtonobject.style.background = "#8B0000";
	return;
}


