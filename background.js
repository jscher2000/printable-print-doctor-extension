/* 
  Copyright 2019. Jefferson "jscher2000" Scher. License: MPL-2.0.
  version 0.1 - initial design
  version 0.2 - override fonts
  version 0.5 - move UI to toolbar popup panel
*/

/**** Set up toolbar button listener ****/

// Listen for button click and show popup
browser.browserAction.onClicked.addListener((currTab) => {
	// Open popup
	browser.browserAction.openPopup();
});

// Set up the button
browser.browserAction.setPopup({popup: browser.extension.getURL('popup.html')});
