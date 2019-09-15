// Button functions
function printable_override_display(){
	browser.tabs.insertCSS(
		{
			file: "/printable.css",
			allFrames: true,
			cssOrigin: "user"
		}
	).then(() => {
		browser.tabs.executeScript(
			{
				file: "/printable-display.js",
				allFrames: true
			}
		)
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnPrintableDisplay').addEventListener('click', printable_override_display, false);

function printable_override_fonts(){
	browser.tabs.insertCSS(
		{
			file: "/printable.css",
			allFrames: true,
			cssOrigin: "user"
		}
	).then(() => {
		browser.tabs.executeScript(
			{
				file: "/printable-fonts.js",
				allFrames: true
			}
		)
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnPrintableFonts').addEventListener('click', printable_override_fonts, false);

function printable_unfix_position(){
	browser.tabs.insertCSS(
		{
			file: "/printable.css",
			allFrames: true,
			cssOrigin: "user"
		}
	).then(() => {
		browser.tabs.executeScript(
			{
				file: "/printable-unfix.js",
				allFrames: true
			}
		)
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnFixedToAbsolute').addEventListener('click', printable_unfix_position, false);

document.getElementById('btnPrintPreview').addEventListener('click', function(){browser.tabs.printPreview();}, false);

// Future buttons?
//document.getElementById('btnSansSerifFonts').addEventListener('click', printable_override_fontsSS, false);
//document.getElementById('btnPrintableLinkURLs').addEventListener('click', printable_suppress_URLs, false);

// TODO: something for fieldset's