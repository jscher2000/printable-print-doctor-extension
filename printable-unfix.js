(function(){
	// Override position:fixed to position:absolute with ability to tweak
	// Create tweak panel and append to document.body if not already there
	if (!document.querySelector('#fixedpositiontweakpanel')){
		var tweakpanel = `<div id="fixedpositiontweakpanel">Node layout for printing:
			<span id="tweakpanelclose">X</span><br>
			<form><label><input type="radio" name="tweakpos" value="absolute">&nbsp;absolute</label><br>
			<label><input type="radio" name="tweakpos" value="relative">&nbsp;relative</label><br>
			<label><input type="radio" name="tweakpos" value="hidden">&nbsp;hidden</label><br>
			<button id="tweakprintpreview" type="button">Print Preview</button> 
			<button id="disabletweakpanels" type="button">Disable Tweaking</button>
			</form></div>`;
		// use a contextual fragment
		var range = document.createRange();
		range.selectNode(document.body.firstChild);
		var frag = range.createContextualFragment(tweakpanel);
		document.body.appendChild(frag);
		// set up panel event handlers
		document.querySelector('#fixedpositiontweakpanel').addEventListener('change', function(evt){
			var fixednode = document.querySelector('[tweakpanelactive="true"]');
			if (!fixednode){
				alert('Script lost track of the node to tweak. Please mouse away and try again.');
				// TODO: hide panel?
				return;
			}
			var tgtvalue = evt.target.getAttribute('value');
			switch (tgtvalue){
				case 'absolute':
					if (fixednode.hasAttribute('printpositionrelative')) fixednode.removeAttribute('printpositionrelative');
					if (fixednode.hasAttribute('hidefromprint')) fixednode.removeAttribute('hidefromprint');
					fixednode.setAttribute('printpositionabsolute', 'true');
					break;
				case 'relative':
					if (fixednode.hasAttribute('printpositionabsolute')) fixednode.removeAttribute('printpositionabsolute');
					if (fixednode.hasAttribute('hidefromprint')) fixednode.removeAttribute('hidefromprint');
					fixednode.setAttribute('printpositionrelative', 'true');
					break;
				case 'hidden':
					if (fixednode.hasAttribute('printpositionabsolute')) fixednode.removeAttribute('printpositionabsolute');
					if (fixednode.hasAttribute('printpositionrelative')) fixednode.removeAttribute('printpositionrelative');
					fixednode.setAttribute('hidefromprint', 'true');
					break;
			}
		});
		document.querySelector('#fixedpositiontweakpanel').addEventListener('mouseout', function(evt){
			var tweakpanel = document.querySelector('#fixedpositiontweakpanel');
			if (evt.target != tweakpanel) return;
			var fixednode = document.querySelector('[tweakpanelactive="true"]');
			if (evt.relatedTarget == fixednode) return;
			var selfparent = evt.relatedTarget.closest('#fixedpositiontweakpanel');
			if (selfparent) return;
			var sameparent = evt.relatedTarget.closest('[tweakpanelactive]');
			if (sameparent) return;
			// Hide myself & clear active indication
			closeTweakPanel();
			//tweakpanel.style.display = '';
			//fixednode.removeAttribute('tweakpanelactive');
		});
		document.querySelector('#disabletweakpanels').addEventListener('click', function(evt){
			// Remove attribute identifying fixed position elements (and clear active)
			var fixednodes = document.querySelectorAll('[fixedpositionforscreen]');
			for (var f=0; f<fixednodes.length; f++){
				fixednodes[f].removeAttribute('fixedpositionforscreen');
				if(fixednodes[f].hasAttribute('tweakpanelactive')) fixednodes[f].removeAttribute('tweakpanelactive');
			}
			// Hide the tweakpanel
			var tweakpanel = document.querySelector('#fixedpositiontweakpanel');
			tweakpanel.style.display = '';
		});
		document.querySelector('#tweakprintpreview').addEventListener('click', function(evt){
			// Send message to background script
			browser.runtime.sendMessage({"command": "preview"});
			// Close the panel
			closeTweakPanel();
		});
		document.querySelector('#tweakpanelclose').addEventListener('click', function(evt){
			// Close the panel
			closeTweakPanel();
		});
		document.querySelector('#fixedpositiontweakpanel form').addEventListener('submit', function(evt){
			// Don't submit!
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	}
	function closeTweakPanel(){
		var tweakpanel = document.querySelector('#fixedpositiontweakpanel');
		tweakpanel.style.display = '';
		var fixednode = document.querySelector('[tweakpanelactive="true"]');
		fixednode.removeAttribute('tweakpanelactive');
	}
	// Find the fixed position elements, switch to absolute, and add panel hooks
	var els = document.querySelectorAll('body,header,footer,nav,div,span,button,a,section,article,main,summary,details,aside');
	for (var i=0; i<els.length; i++) {
		if (window.getComputedStyle(els[i],null).getPropertyValue("position") == 'fixed'){
			els[i].setAttribute("fixedpositionforscreen", "true");
			els[i].setAttribute("printpositionabsolute", "true");
			els[i].addEventListener('mouseover', function(evt){
				var tweakpanel = document.querySelector('#fixedpositiontweakpanel');
				if (tweakpanel.style.display !== 'block'){
					var fixednode = evt.target;
					if (!fixednode.hasAttribute('fixedpositionforscreen')) fixednode = evt.target.closest('[fixedpositionforscreen="true"]');
					if (!fixednode) return;
					// Set up radio buttons
					if (fixednode.hasAttribute('hidefromprint')) tweakpanel.querySelector('[value="hidden"]').checked = true;
					else if (fixednode.hasAttribute('printpositionabsolute')) tweakpanel.querySelector('[value="absolute"]').checked = true;
					else if (fixednode.hasAttribute('printpositionrelative')) tweakpanel.querySelector('[value="relative"]').checked = true;
					// Position and display panel
					tweakpanel.style.display = 'block';
					tweakpanel.style.left = (evt.clientX + 2) + 'px';
					tweakpanel.style.top = (evt.clientY + window.scrollY) + 'px';
					// Mark the target
					fixednode.setAttribute('tweakpanelactive', 'true');
				}
			});
			els[i].addEventListener('mouseout', function(evt){
				var tweakpanel = document.querySelector('#fixedpositiontweakpanel');
				if (evt.relatedTarget == tweakpanel) return;
				var sameparent = evt.relatedTarget.closest('[tweakpanelactive]');
				if (sameparent) return;
				// Hide the panel and unmark the target
				tweakpanel.style.display = '';
				var fixednode = evt.target.closest('[fixedpositionforscreen="true"]');
				fixednode.removeAttribute('tweakpanelactive');
			});
		}
	}
	// Send message to background script
	browser.runtime.sendMessage({"command": "conditionalpreview"});
})();