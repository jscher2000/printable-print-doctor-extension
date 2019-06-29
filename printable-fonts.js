(function(){
	function override_font(arrEls){
		for (var i=0; i<arrEls.length; i++) {
			var blockfonts = window.getComputedStyle(arrEls[i],null).getPropertyValue("font-family");
			if (blockfonts.trim() === ''){
				arrEls[i].style.fontFamily = 'sans-serif';
			} else {
				//console.log('Block '+i+' '+arrEls[i].nodeName + ' before: '+blockfonts);
				var arrFonts = blockfonts.split(',');
				for (var j=0; j<arrFonts.length; j++){
					if (okfonts.includes(arrFonts[j].trim())){
						if (j===0){
							// no change needed
							//console.log('No change');
							break;
						} else {
							arrEls[i].style.fontFamily = arrFonts[j].trim();
							//console.log('Block '+i+' '+arrEls[i].nodeName + ' after: '+window.getComputedStyle(arrEls[i],null).getPropertyValue("font-family"));
							break;
						}
					} else {
						if (j == arrFonts.length-1){
							arrEls[i].style.fontFamily = 'sans-serif';
							//console.log('Block '+i+' '+arrEls[i].nodeName + ' after: '+window.getComputedStyle(arrEls[i],null).getPropertyValue("font-family"));
							break;
						}
					}
				}
			}
		}
	}
	// Override custom fonts
	var okfonts = ['Arial', 'Courier New', 'Times New Roman', 'Verdana', 'monospace', 'sans-serif', 'serif'];
	// Large elements
	var blocks = document.querySelectorAll('html,body,div,section,article,main,summary,details,aside,header,footer');
	override_font(blocks);
	// Small elements
	blocks = document.querySelectorAll('p,td,ul,ol,li,h1,h2,h3,h4,h5,h6,span');
	override_font(blocks);
})();
