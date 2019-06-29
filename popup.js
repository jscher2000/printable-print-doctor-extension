// Button functions
function printable_override_display(){
	browser.tabs.insertCSS(
		{file: "/printable.css"}
	).then(() => {
		browser.tabs.executeScript(
			{file: "/printable-display.js"}
		)
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnPrintableDisplay').addEventListener('click', printable_override_display, false);

function printable_override_fonts(){
	browser.tabs.insertCSS(
		{file: "/printable.css"}
	).then(() => {
		browser.tabs.executeScript(
			{file: "/printable-fonts.js"}
		)
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnPrintableFonts').addEventListener('click', printable_override_fonts, false);

// Future buttons?
//document.getElementById('btnSansSerifFonts').addEventListener('click', printable_override_fontsSS, false);
//document.getElementById('btnPrintableLinkURLs').addEventListener('click', printable_suppress_URLs, false);
