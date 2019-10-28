(function(){
	function doNotPrint(el){
		var printStyles = getElementPrintStyles(el);
		if (printStyles.length === 0) return false;
		for (var i=0; i<printStyles.length; i++){
			if (printStyles[i].style.display === 'none') return true;
		}
		return false;
	}
	function getElementPrintStyles(element) {
		/* Derived from: https://stackoverflow.com/a/36126329 
		   CC BY-SA 4.0 https://stackoverflow.com/users/496046/tremby */

		var i, len, matching = [], sheets = document.styleSheets, mediaQ, rules;

		function loopRules(rules, forPrint) {
			var i, len, rule, mediaQ;
			for (i = 0, len = rules.length; i < len; i++) {
				rule = rules[i];
				if (rule instanceof CSSMediaRule) {
					mediaQ = rule.conditionText;
					if (mediaQ.indexOf('print') > -1 && mediaQ.indexOf('not print') === -1){
						loopRules(rule.cssRules, true);
					}
				} else if (rule instanceof CSSStyleRule && forPrint) {
					if (element.matches(rule.selectorText)) {
						matching.push(rule);
					}
				}
			}
		};

		for (i = 0, len = sheets.length; i < len; i++) {
			if (!sheets[i].disabled){
				try { // cautious due to cross-domain security block
					rules = sheets[i].cssRules; 
					if (sheets[i].ownerNode && sheets[i].ownerNode.hasAttribute('media')){
						mediaQ = sheets[i].ownerNode.getAttribute('media');
						if (mediaQ.indexOf('print') > -1 && mediaQ.indexOf('not print') === -1){
							loopRules(rules, true);
						}
					} else {
						loopRules(rules, false);
					}
				} catch(err) { 
					console.log('Can\'t access cssRules for ' + sheets[i].href + ' due to: ' + err ); 
					rules = [];
				}
			}
		}

		return matching;
	}
	// Create tweak panel and append to document.body if not already there
	if (!document.querySelector('#displayfixtweakpanel')){
		var tweakpanel = `<div id="displayfixtweakpanel">Node layout for printing:
			<span id="dftweakpanelclose">X</span><br>
			<form><label><input type="radio" name="tweakdisp" value="print">&nbsp;print</label>
			<label><input type="radio" name="tweakdisp" value="hidden">&nbsp;hide</label><br>
			<button id="dftweakprintpreview" type="button">Print Preview</button> 
			<button id="disabledftweakpanels" type="button">Disable Tweaking</button>
			</form></div>`;
		// use a contextual fragment
		var range = document.createRange();
		range.selectNode(document.body.firstChild);
		var frag = range.createContextualFragment(tweakpanel);
		document.body.appendChild(frag);
		// set up panel event handlers
		document.querySelector('#displayfixtweakpanel').addEventListener('change', function(evt){
			var notblock = document.querySelector('[dftweakpanelactive="true"]');
			if (!notblock){
				alert('Script lost track of the node to tweak. Please mouse away and try again.');
				// TODO: hide panel?
				return;
			}
			var tgtvalue = evt.target.getAttribute('value');
			switch (tgtvalue){
				case 'print':
					if (notblock.hasAttribute('hidefromprint')) notblock.removeAttribute('hidefromprint');
					break;
				case 'hidden':
					notblock.setAttribute('hidefromprint', 'true');
					break;
			}
		});
		document.querySelector('#displayfixtweakpanel').addEventListener('mouseout', function(evt){
			var tweakpanel = document.querySelector('#displayfixtweakpanel');
			if (evt.target != tweakpanel) return;
			var notblock = document.querySelector('[dftweakpanelactive="true"]');
			if (evt.relatedTarget == notblock) return;
			var selfparent = evt.relatedTarget.closest('#displayfixtweakpanel');
			if (selfparent) return;
			var sameparent = evt.relatedTarget.closest('[dftweakpanelactive]');
			if (sameparent) return;
			// Hide myself & clear active indication
			closeDFTweakPanel();
			//tweakpanel.style.display = '';
			//notblock.removeAttribute('dftweakpanelactive');
		});
		document.querySelector('#disabledftweakpanels').addEventListener('click', function(evt){
			// Remove attribute identifying fixed position elements (and clear active)
			var notblocks = document.querySelectorAll('[dftweakable]');
			for (var f=0; f<notblocks.length; f++){
				notblocks[f].removeAttribute('dftweakable');
				if(notblocks[f].hasAttribute('dftweakpanelactive')) notblocks[f].removeAttribute('dftweakpanelactive');
			}
			// Hide the tweakpanel
			var tweakpanel = document.querySelector('#displayfixtweakpanel');
			tweakpanel.style.display = '';
		});
		document.querySelector('#dftweakprintpreview').addEventListener('click', function(evt){
			// Send message to background script
			browser.runtime.sendMessage({"command": "preview"});
			// Close the panel
			closeDFTweakPanel();
		});
		document.querySelector('#dftweakpanelclose').addEventListener('click', function(evt){
			// Close the panel
			closeDFTweakPanel();
		});
		document.querySelector('#displayfixtweakpanel form').addEventListener('submit', function(evt){
			// Don't submit!
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	}
	function closeDFTweakPanel(){
		var tweakpanel = document.querySelector('#displayfixtweakpanel');
		tweakpanel.style.display = '';
		var notblock = document.querySelector('[dftweakpanelactive="true"]');
		notblock.removeAttribute('dftweakpanelactive');
	}

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
	// BUG: overrides display:none, TODO: provide UI to hide again (due to cross-site CSS issue, can't fix it completely)
	//var blocks = document.querySelectorAll('html,body,div,section,article,main,summary,details,aside,header,footer');
	var blocks = document.querySelectorAll('html,body,*:not(span):not(h1):not(h2):not(h3):not(h4):not(strong):not(em):not(font):not(img)');
	var printRules = [];
	for (var i=0; i<blocks.length; i++) {
		if (parseInt(window.getComputedStyle(blocks[i],null).getPropertyValue("height")) > 400){
			if (doNotPrint(blocks[i])){
				blocks[i].setAttribute('hidefromprint', 'true');
			} else {
				blocks[i].setAttribute("forcedisplayblock", "true");
				if (!['HTML','BODY'].includes(blocks[i].nodeName)){
					blocks[i].setAttribute("dftweakable", "true");
					blocks[i].addEventListener('mouseover', function(evt){
						var tweakpanel = document.querySelector('#displayfixtweakpanel');
						if (tweakpanel.style.display !== 'block'){
							var nonblock = evt.target;
							if (!nonblock.hasAttribute('dftweakable')) nonblock = evt.target.closest('[dftweakable="true"]');
							if (!nonblock) return;
							// Set up radio buttons
							if (nonblock.hasAttribute('hidefromprint')) tweakpanel.querySelector('[value="hidden"]').checked = true;
							else tweakpanel.querySelector('[value="print"]').checked = true;
							// Position and display panel
							tweakpanel.style.display = 'block';
							tweakpanel.style.left = (evt.clientX + 2) + 'px';
							tweakpanel.style.top = (evt.clientY + window.scrollY - 6) + 'px';
							// Mark the target
							nonblock.setAttribute('dftweakpanelactive', 'true');
						} else { 
							// Tweak panel is displayed but might need to move to a new element
							var nonblock = evt.target;
							// Is current element tweakable?
							if (!nonblock.hasAttribute('dftweakable')) nonblock = evt.target.closest('[dftweakable="true"]');
							if (!nonblock) return;
							// Is this a new element?
							var currTweakTarget = document.querySelector('[dftweakpanelactive="true"]');
							if (nonblock === currTweakTarget) return;
							// Is this element within a non-printing ancestor?
							var npancestor = nonblock.closest('[hidefromprint="true"]');
							if (npancestor && (npancestor !== nonblock)){
								tweakpanel.querySelector('[value="hidden"]').checked = true;
								return;
							}
							// Set up radio buttons
							if (nonblock.hasAttribute('hidefromprint')) tweakpanel.querySelector('[value="hidden"]').checked = true;
							else tweakpanel.querySelector('[value="print"]').checked = true;
							// Position the panel
							tweakpanel.style.left = (evt.clientX + 2) + 'px';
							tweakpanel.style.top = (evt.clientY + window.scrollY - 6) + 'px';
							// Switch the target
							currTweakTarget.removeAttribute('dftweakpanelactive');
							nonblock.setAttribute('dftweakpanelactive', 'true');
						}
					});
					blocks[i].addEventListener('mouseout', function(evt){
						var tweakpanel = document.querySelector('#displayfixtweakpanel');
						if (evt.relatedTarget == tweakpanel) return;
						var sameparent = evt.relatedTarget.closest('[dftweakpanelactive]');
						if (sameparent) return;
						// Hide the panel and unmark the target
						tweakpanel.style.display = '';
						var nonblock = evt.target.closest('[dftweakable="true"]');
						nonblock.removeAttribute('dftweakpanelactive');
					});
				}
			}
		}
	}
})();