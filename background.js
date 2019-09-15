/* 
  Copyright 2019. Jefferson "jscher2000" Scher. License: MPL-2.0.
  version 0.1 - initial design
  version 0.2 - override fonts
  version 0.5 - move UI to toolbar popup panel
  version 0.6 - force block display of certain elements (because print style sheet may be inconsistent)
  version 0.7 - force block display of html and body elements in printable-display.js
  version 0.8 - right-click context menu integration (needed for popups that hide the toolbar)
  version 0.9 - add Print Preview to right-click context menu integration
  version 1.0 - tools to unfix fixed position items, right-click > hide on printout
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
  contexts: ["page", "frame", "audio", "image", "link", "selection", "video"],
  icons: {
	"16": "icons/printer-syringe-16.png",
	"32": "icons/printer-syringe-32.png"
  }
})
browser.menus.create({
	id: "context_PrintableDisplay",
	parentId: "context_printable",
	title: "Allow Page Breaks - Override unbreakable display types",
	contexts: ["page", "frame", "audio", "image", "link", "selection", "video"]
})
browser.menus.create({
	id: "context_PrintableFonts",
	parentId: "context_printable",
	title: "Use Basic Fonts - Override unusual/downloadable fonts",
	contexts: ["page", "frame", "audio", "image", "link", "selection", "video"]
})
browser.menus.create({
	id: "context_FixedToAbsolute",
	parentId: "context_printable",
	title: "Prevent Repeated Elements (Change fixed position to absolute)",
	contexts: ["page", "frame", "audio", "image", "link", "selection", "video"]
})
if (browser.menus.hasOwnProperty('getTargetElement')) { //Fx63+
	browser.menus.create({
		id: "context_HideOnPrintout",
		parentId: "context_printable",
		title: "Hide Element on Printout",
		contexts: ["page", "frame", "audio", "image", "link", "selection", "video"]
	})
}
browser.menus.create({
	id: "context_PrintPreview",
	parentId: "context_printable",
	title: "Call up Print Preview",
	contexts: ["page", "frame", "audio", "image", "link", "selection", "video"]
})
browser.menus.onClicked.addListener((menuInfo, currTab) => {
	// TODO: avoid duplicating code between this and popup.js
	switch (menuInfo.menuItemId) {
		case 'context_PrintableDisplay':
			browser.tabs.insertCSS(
				{
					file: "/printable.css",
					frameId: menuInfo.frameId,
					cssOrigin: "user"
				}
			).then(() => {
				browser.tabs.executeScript(
					{
						file: "/printable-display.js",
						frameId: menuInfo.frameId
					}
				)
			}).catch((err) => {
				//console.log(err);
				browser.tabs.executeScript(
					{
						code: `alert("Apologies, but it didn't work. Firefox says: '${err}'");`
					}
				)
			});
			break;
		case 'context_PrintableFonts':
			browser.tabs.insertCSS(
				{
					file: "/printable.css",
					frameId: menuInfo.frameId,
					cssOrigin: "user"
				}
			).then(() => {
				browser.tabs.executeScript(
					{
						file: "/printable-fonts.js",
						frameId: menuInfo.frameId
					}
				)
			}).catch((err) => {
				//console.log(err);
				browser.tabs.executeScript(
					{
						code: `alert("Apologies, but it didn't work. Firefox says: '${err}'");`
					}
				)
			});
			break;
		case 'context_FixedToAbsolute':
			browser.tabs.insertCSS(
				{
					file: "/printable.css",
					frameId: menuInfo.frameId,
					cssOrigin: "user"
				}
			).then(() => {
				browser.tabs.executeScript(
					{
						file: "/printable-unfix.js",
						frameId: menuInfo.frameId
					}
				)
			}).catch((err) => {
				//console.log(err);
				browser.tabs.executeScript(
					{
						code: `alert("Apologies, but it didn't work. Firefox says: '${err}'");`
					}
				)
			});
			break;
		case 'context_HideOnPrintout':
			browser.tabs.insertCSS(
				{
					file: "/printable.css",
					frameId: menuInfo.frameId,
					cssOrigin: "user"
				}
			).then(() => {
				browser.tabs.executeScript(
					{
						code: `browser.menus.getTargetElement(${menuInfo.targetElementId}).setAttribute('hidefromprint', 'true');`
					}
				)
			}).catch((err) => {
				//console.log(err);
				browser.tabs.executeScript(
					{
						code: `alert("Apologies, but it didn't work. Firefox says: '${err}'");`
					}
				)
			});
			break;
		case 'context_PrintPreview':
			browser.tabs.printPreview();
			break;
	}
});

// Execute commands received from content
function handleMessage(request, sender, sendResponse){
	if ('command' in request){
		if (request.command == 'preview') {
			/* As a shortcut, we are assuming the command was sent
			   from the currently active tab and not checking 
			   and if necessary activating sender.tab.id */
			browser.tabs.printPreview();
		}		
	}
}
browser.runtime.onMessage.addListener(handleMessage);