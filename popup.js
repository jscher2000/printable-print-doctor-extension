// Button functions
function printable_override_display_light(){
	browser.tabs.insertCSS(
		{
			file: "/printable.css",
			allFrames: true,
			cssOrigin: "user"
		}
	).then(() => {
		browser.tabs.executeScript(
			{
				file: "/printable-display-light.js",
				allFrames: true
			}
		)
		// for Fx85 dialog, let's close the panel on autopreview
		if (oPDFPrefs.autopreview) self.close();
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnPrintableDisplayLight').addEventListener('click', printable_override_display_light, false);

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
		// for Fx85 dialog, let's close the panel on autopreview
		if (oPDFPrefs.autopreview) self.close();
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
		// for Fx85 dialog, let's close the panel on autopreview
		if (oPDFPrefs.autopreview) self.close();
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
		// for Fx85 dialog, let's close the panel on autopreview
		if (oPDFPrefs.autopreview) self.close();
	}).catch((err) => {
		document.getElementById('errs').textContent = 'Error: ' + err.message;
	});
}
document.getElementById('btnFixedToAbsolute').addEventListener('click', printable_unfix_position, false);

document.getElementById('btnPrintPreview').addEventListener('click', function(){browser.tabs.printPreview();}, false);

function update_auto_preview(evt){
	oPDFPrefs.autopreview = evt.target.checked;
	// Save it to storage
	browser.storage.local.set({PDFprefs: oPDFPrefs})
		.then(function(){browser.runtime.sendMessage({"command": "updateprefs"});})
		.catch((err) => {console.log('Error on browser.storage.local.set(): '+err.message);});
}

document.getElementById('chkAutoPreview').addEventListener('click', update_auto_preview, false);

function saveAsPDF(evt){
	// Set up the pageSettings object for PDF'ing, save dialog changes to storage for next time
	var pageSettings = {
		edgeTop: 0.25, edgeRight: 0.25, edgeBottom: 0.25, edgeLeft: 0.25,
		marginTop: 0.5, marginRight: 0.25, marginBottom: 0.5, marginLeft: 0.25
	};
	var frm = evt.target.form;
	var changed = false;
	pageSettings.orientation = parseInt(frm.orientation.value);
	if (pageSettings.orientation !== oPDFPrefs.orientation){
		changed = true;
		oPDFPrefs.orientation = pageSettings.orientation;
	}
	if (frm.paper.value == 'A4'){
		pageSettings.paperSizeUnit = 1;
		pageSettings.paperHeight = 297;
		pageSettings.paperWidth = 210;
	}
	if (frm.paper.value !== oPDFPrefs.paperSize){
		changed = true;
		oPDFPrefs.paperSize = frm.paper.value;
	}
	if (frm.showBackgroundColors.checked) pageSettings.showBackgroundColors = true;
	if (frm.showBackgroundColors.checked !== oPDFPrefs.bgcolor){
		changed = true;
		oPDFPrefs.bgcolor = frm.showBackgroundColors.checked;
	}
	if (frm.showBackgroundImages.checked) pageSettings.showBackgroundImages = true;
	if (frm.showBackgroundImages.checked !== oPDFPrefs.bgimages){
		changed = true;
		oPDFPrefs.bgimages = frm.showBackgroundImages.checked;
	}
	if (frm.scale.value != 'shrinkToFit'){
		pageSettings.shrinkToFit = false;
		pageSettings.scaling = parseFloat(frm.scale.value);
		if (pageSettings.scaling !== oPDFPrefs.scaling){
			changed = true;
			oPDFPrefs.scaling = pageSettings.scaling;
		}
	} else {
		pageSettings.shrinkToFit = true;
	}
	if (pageSettings.shrinkToFit !== oPDFPrefs.shrinkToFit){
		changed = true;
		oPDFPrefs.shrinkToFit = pageSettings.shrinkToFit;
	}
	if (!frm.headerLeft.checked) pageSettings.headerLeft = '';
	if (frm.headerLeft.checked !== oPDFPrefs.headerLeft){
		changed = true;
		oPDFPrefs.headerLeft = frm.headerLeft.checked;
	}
	if (!frm.headerRight.checked) pageSettings.headerRight = '';
	if (frm.headerRight.checked !== oPDFPrefs.headerRight){
		changed = true;
		oPDFPrefs.headerRight = frm.headerRight.checked;
	}
	if (!frm.footerLeft.checked) pageSettings.footerLeft = '';
	if (frm.footerLeft.checked !== oPDFPrefs.footerLeft){
		changed = true;
		oPDFPrefs.footerLeft = frm.footerLeft.checked;
	}
	if (!frm.footerRight.checked) pageSettings.footerRight = '';
	if (frm.footerRight.checked !== oPDFPrefs.footerRight){
		changed = true;
		oPDFPrefs.footerRight = frm.footerRight.checked;
	}
	if (changed) browser.storage.local.set({PDFprefs: oPDFPrefs})
			.catch((err) => {console.log('Error on browser.storage.local.set(): '+err.message);});
	browser.tabs.saveAsPDF(pageSettings);
}

browser.runtime.getPlatformInfo().then((info) => {
	if (['win', 'linux'].includes(info.os)){
		document.getElementById('printPDF').style.display = 'block';
		document.getElementById('btnPrintPDF').addEventListener('click', saveAsPDF, false);
	}
});

/**** Storage ****/
// Default starting values
var oPDFPrefs = {
	orientation: 0,				// 0 = portrait, 1 = landscape
	paperSize: 'L',				// L = Letter, A4 = A4
	bgcolor: true,				// showBackgroundColors
	bgimages: true,				// showBackgroundImages
	shrinkToFit: false,			// shrinkToFit
	scaling: 1.0,				// scaling
	headerLeft: true,			// default left header = title
	headerRight: true,			// default right header = URL
	footerLeft: true,			// default left footer = page x of y
	footerRight: true,			// default right header = date
	autopreview: true			// whether to call Print Preview after applying a jab
}
// Update oPDFPrefs from storage
var updtPrefs = browser.storage.local.get("PDFprefs").then((results) => {
	if (results.PDFprefs != undefined){
		if (JSON.stringify(results.PDFprefs) != '{}'){
			var arrSavedPrefs = Object.keys(results.PDFprefs)
			for (var j=0; j<arrSavedPrefs.length; j++){
				oPDFPrefs[arrSavedPrefs[j]] = results.PDFprefs[arrSavedPrefs[j]];
			}
		}
	}
}).catch((err) => {console.log('Error retrieving "PDFprefs" from storage: '+err.message);});
// Fix up form starting values
updtPrefs.then(() => {
	var frm = document.querySelector('form[name="pdf"]');
	frm.orientation.value = oPDFPrefs.orientation;
	frm.paper.value = oPDFPrefs.paperSize;
	frm.showBackgroundColors.checked = oPDFPrefs.bgcolor;
	frm.showBackgroundImages.checked = oPDFPrefs.bgimages;
	if (oPDFPrefs.shrinkToFit){
		frm.scale.value = 'shrinkToFit';
	} else {
		frm.scale.value = oPDFPrefs.scaling;
	}
	frm.headerLeft.checked = oPDFPrefs.headerLeft;
	frm.headerRight.checked = oPDFPrefs.headerRight;
	frm.footerLeft.checked = oPDFPrefs.footerLeft;
	frm.footerRight.checked = oPDFPrefs.footerRight;
	// Auto-Preview
	document.getElementById('chkAutoPreview').checked = oPDFPrefs.autopreview;
});

// Future buttons?
//document.getElementById('btnSansSerifFonts').addEventListener('click', printable_override_fontsSS, false);
//document.getElementById('btnPrintableLinkURLs').addEventListener('click', printable_suppress_URLs, false);

// TODO: something for fieldset's