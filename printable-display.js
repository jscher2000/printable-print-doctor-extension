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
	// Override flex and inline-block on common container elements taller than 400px so they can be paginated
	// BUG: overrides display:none, TODO: fix this bug
	var blocks = document.querySelectorAll('html,body,div,section,article,main,summary,details,aside,header,footer');
	for (var i=0; i<blocks.length; i++) {
		if (parseInt(window.getComputedStyle(blocks[i],null).getPropertyValue("height")) > 400) blocks[i].setAttribute("forcedisplayblock", "true");
	}
})();