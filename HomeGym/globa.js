function languageSwap() {
	var thisChild = document.getElementById("languageTab");
	if (thisChild) thisChild.parentNode.removeChild(thisChild);
	else {
		var languageTab = document.createElement("div");
		languageTab.id = "languageTab";
		for (var lang in JSONcommands["HomeGym"]) {
			
			var pickLang = document.createElement("input");
			pickLang.type = "button";
			pickLang.value = lang;
			pickLang.classList.add("pickLang");
			pickLang.onclick = function() {
				language = this.value;
				startUp();
			}
			languageTab.append(pickLang);
		}
		document.getElementById("langPicks").append(languageTab);
		
		console.log(language)
	}
}