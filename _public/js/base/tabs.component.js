(function() {
	// -- gather all tab components
	var tabComponents = document.querySelectorAll(".c-tabView");
	// -- declare active tabs
	var activeLog = [];
	// -- links tabs to tab contents
	var activeObj = null;


	for(var a=0; a<tabComponents.length; a++) {
		// -- id log array
		var ids = [];
		// -- declare parent tab component
		var _parent = tabComponents[a];
		// -- collect listing per component
		var tabs = _parent.querySelectorAll(".c-tabView__tabs li");
		// -- collect content blocks per listing
		var tabContents = _parent.querySelectorAll(".c-tabView__content > *");
		// -- collect first UL from component
		var tabsContainer = _parent.querySelector("ul");
		// -- generate new tab for mobile reserve
		var tabTemp = newTab();
		// -- generate generic object
		var _obj = {
			id: a,
			expanded: false
		};

		// -- identify tabs and set properties
		for(var b=0; b<tabs.length; b++) {
			var tab = tabs[b];
			if(!tab.dataset.tab) {
				// -- store tab/content ids in object
				var tabObj = {
					"tabId": "tab" + a + "_" + b,
					"contentId": "tabContent" + a + "_" + b
				};
				if(!tab.dataset.href) {
					tab.id = tabObj.tabId;
					tab.dataset.tab = tabObj.contentId;
					tab.setAttribute("aria-controls", tabObj.contentId);
				}
				tab.setAttribute("role", "tab");
				tab.setAttribute("aria-selected", "false");
				ids.push(tabObj);
			}
			tab.dataset.parent = a;
			if(tab.dataset.href) {
				var _anchor = anchorReserve(this);
				_parent.insertAdjacentElement("afterbegin", _anchor);
				tab.addEventListener("click", function() {
					window.open(this.dataset.href,"_blank");
				});				
			} else tab.addEventListener("click", tabClick);
			if(tab.classList.contains("-active")) _obj.tab = tab;

		}

		// -- set first tab as active if none are declared
		if(!_obj.tab) {
			_obj.tab = tabs[0];
			_obj.tab.classList.add("-active");
			_obj.tab.setAttribute("aria-selected", "true");
		}

		// -- identify content blocks and set properties
		for(var c=0; c<tabContents.length; c++) {
			var content = tabContents[c];
			content.setAttribute("role", "tabpanel");
			content.setAttribute("aria-labelledby", ids[0].tabId);
			if(!content.id) {
				var contentId = (ids.length>0) ? ids.shift() : false;
				if(contentId) content.id = contentId.contentId;
			}
		}

		// -- setup mobile reserve tab
		tabsContainer.insertBefore(tabTemp, tabsContainer.firstChild);
		tabTemp.dataset.parent = a;
		tabTemp.addEventListener("click", tabExpand);

		//Activate tab contents
		activeLog.push(_obj);
		activeObj = _obj;
		tabShow();
	}

	function anchorReserve() {
		var anchor = document.createElement("a");
		anchor.href = tab.dataset.href;
		anchor.target = "_blank";
		anchor.classList.add("c-tabView__externals");
		anchor.innerHTML = tab.innerHTML;
		return anchor;
	}

	// -- (RETURNS) mobile reseve tab
	function newTab() {
		// -- generate svg(arrow-down) for mobile reserve dropdown menu
		var svgTag = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var svgPath = '<path d="M24 2L8 16l16 14"/>';
		svgTag.setAttribute("viewBox", "0 0 32 32");
		svgTag.innerHTML = svgPath;

		// -- generate markup for mobile reserve element
		var tabReserve = document.createElement('li');
		var tabText = document.createElement('span');
		tabReserve.appendChild(tabText);
		tabReserve.classList.add("mobileReserve");
		tabReserve.appendChild(svgTag);

		return tabReserve;
	}

	// -- (VOID) performs tab click actions
	function tabClick(e) {
		var _target = this;
		var _index = _target.dataset.parent;
		activeObj = activeLog[_index];
		if(!_target.classList.contains("-active")) {
			activeObj.tab.classList.remove('-active');
			activeObj.tab.setAttribute("aria-selected", "false");
			activeObj.tab = _target;
			tabShow();
		}
	}

	// -- (VOID) performs mobile reserve click actions
	function tabExpand(e) {
		var _target = e.target;
		var _index = _target.dataset.parent;
		for(var i=0; i<activeLog.length; i++) {
			if(i!=_index) {
				activeLog[i].tab.parentNode.classList.remove('open');
				activeLog[i].expanded = false;
			}
		}
		activeObj = activeLog[_index];
		if(!activeObj.expanded) _target.parentNode.classList.add('open');
		else _target.parentNode.classList.remove('open');
		activeObj.expanded = !activeObj.expanded;
	}

	// -- (VOID) 
	function tabShow() {
		// -- get related tab content
		var tabContent = document.getElementById(activeObj.tab.dataset.tab);
		if(tabContent != activeObj.content) {
			if(activeObj.content) activeObj.content.classList.remove('show');
			activeObj.tab.classList.add('-active');
			activeObj.tab.setAttribute("aria-selected", "true");
			tabContent.classList.add('show');
			activeObj.content = tabContent;
			tabText = tabComponents[activeObj.id].querySelector(".mobileReserve > span");
			tabText.textContent = activeObj.tab.textContent;
			if(activeObj.expanded) {
				activeObj.tab.parentNode.classList.remove('open');
				activeObj.expanded = false;
			}
		}
	}
})();