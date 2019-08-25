/* 
  Copyright 2019. Jefferson "jscher2000" Scher. License: MPL-2.0.
  version 0.1 - initial design
  version 0.2 - override fonts
  version 0.5 - move UI to toolbar popup panel
  version 0.6 - force block display of certain elements (because print style sheet may be inconsistent)
  version 0.7 - force block display of html and body elements in printable-display.js
  version 0.8 - right-click context menu integration (needed for popups that hide the toolbar)
*/

/**** Set up toolbar button listener ****/

// Listen for button click and show popup
browser.browserAction.onClicked.addListener((currTab) => {
	// Open popup
	browser.browserAction.openPopup();
});

// Set up the button
browser.browserAction.setPopup({popup: browser.extension.getURL('popup.html')});

// Right-click context menu integration
browser.menus.create({
  id: "context_printable",
  title: "Printable - The Print Doctor",
  contexts: ["page", "selection"],
  icons: {
	"16": "icons/printer-syringe-16.png",
	"32": "icons/printer-syringe-32.png"
  }
})
browser.menus.create({
	id: "context_PrintableDisplay",
	parentId: "context_printable",
	title: "Override unbreakable display types",
	contexts: ["page", "selection"]
})
browser.menus.create({
	id: "context_PrintableFonts",
	parentId: "context_printable",
	title: "Override unusual/downloadable fonts",
	contexts: ["page", "selection"]
})
browser.menus.onClicked.addListener((menuInfo, currTab) => {
	// TODO: avoid duplicating code between this and popup.js
	switch (menuInfo.menuItemId) {
		case 'context_PrintableDisplay':
			browser.tabs.insertCSS(
				{file: "/printable.css"}
			).then(() => {
				browser.tabs.executeScript(
					{file: "/printable-display.js"}
				)
			}).catch((err) => {
				console.log(err);
			});
			break;
		case 'context_PrintableFonts':
			browser.tabs.insertCSS(
				{file: "/printable.css"}
			).then(() => {
				browser.tabs.executeScript(
					{file: "/printable-fonts.js"}
				)
			}).catch((err) => {
				console.log(err);
			});
			break;
	}
});