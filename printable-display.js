(function(){
	// Overflow & height: remove inline styles but apply to screen
	var elPr_screen = '';
	var htbd = document.querySelectorAll('html, body, iframe');
	for (var i=0; i<htbd.length; i++){
		if (htbd[i].style.overflow != ''){  // capture direct style and clear it
			elPr_screen += htbd[i].nodeName.toLowerCase() + "{overflow:" + htbd[i].style.overflow + "}\n";
			htbd[i].style.overflow = "";
		} else {
			if (htbd[i].style.overflowX != ''){  // capture direct style and clear it
				elPr_screen += htbd[i].nodeName.toLowerCase() + "{overflow-x:" + htbd[i].style.overflowX + "}\n";
				htbd[i].style.overflowX = "";
			}
			if (htbd[i].style.overflowY != ''){  // capture direct style and clear it
				elPr_screen += htbd[i].nodeName.toLowerCase() + "{overflow-y:" + htbd[i].style.overflowY + "}\n";
				htbd[i].style.overflowY = "";
			}
		}
	}
	// Add rules to the document if applicable
	if (elPr_screen != ''){
		var TPD_style = document.createElement("style");
		TPD_style.appendChild(document.createTextNode("@media screen{\n" + elPr_screen + "}\n"));
		document.body.appendChild(TPD_style);
	}
	// Override flex and inline-block on elements taller than 400px so they can be paginated
	var blocks = document.querySelectorAll('div,section,article,main,summary,details,aside,header,footer');
	//console.log('Running printable_override_display and found ' + blocks.length + ' blocks!');
	for (var i=0; i<blocks.length; i++) {
		if (window.getComputedStyle(blocks[i],null).getPropertyValue("display") != "block"){
			if (parseInt(window.getComputedStyle(blocks[i],null).getPropertyValue("height")) > 400) blocks[i].style.display="block";
		}
	}
})();