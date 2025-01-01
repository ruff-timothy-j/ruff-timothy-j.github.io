const buttons = document.querySelectorAll('#meet button');
const tablelocation = document.getElementById('table-location');
const menuButton = document.getElementById('menu-button');
const meetButton = document.getElementById('meet-button');
const resetButton = document.getElementById('reset-button');

const header = [
  { Girls_Header: 'Girls', Event_Header: '', Boys_Header: 'Boys' }
 ]

const cdata = [
  { Girls_Visitor: 0, Girls_Home: 0, Event: '200 Medley Relay', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '200 Free', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '200 IM', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '50 Free', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: 'Diving', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '100 Fly', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '100 Free', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '500 Free', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '200 Free Relay', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '100 Back', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '100 Breast', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: '400 Free Relay', Boys_Home: 0, Boys_Visitor: 0 },
  { Girls_Visitor: 0, Girls_Home: 0, Event: 'Total', Boys_Home: 0, Boys_Visitor: 0 }
];


const tableheader = createTableFromArray(header, 1);
tablelocation.appendChild(tableheader, 0);

var adata = getMeetRecord(); 
const table = createTableFromArray(adata, 0);
tablelocation.appendChild(table);

// Add an event listener for clicks on the table
table.addEventListener("click", (event) => {
  // Check if the clicked element is a table cell
  if (event.target.tagName === "TD") {
    // Get the clicked cell
    const cell = event.target;
	var sQueryString =  cell.querystring; 
	
	if ( sQueryString.length > 0 ) {
		 
		 window.location = 'race-calculator.html?' + sQueryString;
	} 
	
    // Do something with the cell
    console.log("Clicked cell:", cell);
    console.log("Cell value:", cell.textContent);
	console.log("Cell sQueryString:", cell.querystring);
  }
});

buttons.forEach(button => {
  button.addEventListener('click', () => {
	
	if ( button === menuButton ) {
      // MENU: Back Button  
	  window.location = 'index.html';
	  return;
	} else if ( button === resetButton ) {
	  localStorage.removeItem('myCurrentMeet');
	  location.reload();
	  return; 
	  
	} else if ( button === meetButton ) {
	  
	  return; 
	  
	}
	
  });
});

function getMeetRecord() {
	var adata = null; 
	var sJSON = ''; 
	// if we have persisted data localally use that. The scoring calculator writes to this data stricture
	// we want to reload it for display here. 
	if (localStorage.getItem('myCurrentMeet') !== null) {
		// Key exists, so lets load it into memory before display. 
		sJSON = localStorage.getItem('myCurrentMeet');
		adata = JSON.parse(sJSON); 
	} else {
		adata = cdata.slice();
		sJSON = JSON.stringify(cdata);
		// make sure we have at least one copy of the meet in local storage. 
		localStorage.setItem('myCurrentMeet', sJSON);
	}
	return adata; 
}

function createTableFromArray(data , iHeaderOnly) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  // Create table header if the data is an array of objects
  if (data.length > 0 && typeof data[0] === 'object') {
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement('th');
	  
	  if (key.includes( 'Home' )) {
		  // sub header home 
		  key = 'Home';
		  th.style = 'width: 15%'
	  } else if (key.includes( 'Visitor' )) {
		  // sub header visitor  
		  key = 'Visitor';
		  th.style = 'width: 15%'
	  } else if (key.includes( 'Event_Header' )) {
		  // header gender
		  key = key.replace( 'Event_Header', '' );
		  th.style = 'width: 40%'
	  } else if (key.includes( 'Header' )) {
		  // header gender
		  key = key.replace( '_Header', '' );
		  th.style = 'width: 30%'
	  } else {
		  //Header Events
		  th.style = 'width: 40%'
	  }
      th.textContent = key;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  }

  if ( iHeaderOnly == 0 ) {
	  var iRowCounter = 0;
	  var iCellCounter = 0;
	  var sQueryString = ''; 
	  var sEventName = ''; 
	  var iRowTotal = data.length; 
	  
	  // Create table rows
	  data.forEach(row => {
		const tr = document.createElement('tr');
		iCellCounter = 0;
		// If row is an object, iterate over its properties
		if (typeof row === 'object') {
		  
		  Object.values(row).forEach(value => {
			const td = document.createElement('td');
			td.textContent = value;
			td.style = 'width: 15%';
			
			sQueryString = 'iEventNumber=' + iRowCounter;
			if ( iCellCounter <= 1 ) {
				// first 2 cells are girls
				// 0 = girls
				sQueryString += '&iGender=0'; 
			} else if ( iCellCounter >= 3 ) {
				// last 2 cells are boys
				// 1 = boys
				sQueryString += '&iGender=1'; 
			}
			sEventName = row.Event; 
			// detremine what type of event 
			if ( sEventName.includes('Relay') ) {
				sQueryString += '&iEventMode=2'; 
			} else if ( sEventName.includes('Diving') ) {
				sQueryString += '&iEventMode=3'; 
			} else {
				sQueryString += '&iEventMode=1'; 
			}
				
			// make sure we know this is coming from the meet page 
			sQueryString += '&iCompetitionMode=2&sEventName=' + sEventName;
			
			console.log( iRowCounter );
			if ( iRowCounter == ( iRowTotal - 1 ) ) {
				// no query strings for the total row
				td.querystring = ''; 
		    } else if ( iCellCounter != 2 ) {
				// only define a query string for the geneder cells
				td.querystring = sQueryString;
			} else {
				td.querystring = '';
			}
			
			tr.appendChild(td);
			iCellCounter++;
		  });
		}

		tbody.appendChild(tr);
		iRowCounter++;
	  });
  }
  
  table.appendChild(thead);
  table.appendChild(tbody);
  
  return table;
}