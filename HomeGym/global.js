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

function cap(input) {
	return input.charAt(0).toUpperCase() + input.slice(1); 
}

document.addEventListener('click', function (event) {
	if (event.target.id != "sugInput" && document.getElementById("sugInput") && !event.target.classList.contains("changable")) {
		var sugInput = document.getElementById("sugInput");
		sugInput.parentNode.childNodes[1].style.visibility = "visible";
		sugInput.parentNode.childNodes[1].style.position = "relative";
		//sugInput.parentNode.removeChild(sugInput);
	}
}, false);

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 && document.getElementById("sugInput")) {
		var sugInput = document.getElementById("sugInput");
		if (sugInput.value != "" && isNaN(sugInput.value)) {
			console.log("Suggestion send")
			console.log(sugInput.skillId)
			console.log(sugInput.value)
			firebase.database().ref("tumblingSkills/" + sugInput.skillId + "/otherNames").push(
				sugInput.value
			);
			sugInput.parentNode.childNodes[1].style.visibility = "visible";
			sugInput.parentNode.childNodes[1].style.position = "relative";
			sugInput.parentNode.removeChild(sugInput);
		}
	}
}, false);

document.addEventListener("mousemove", function(event) {
	if (document.getElementById("suggest")) {
		var suggest = document.getElementById("suggest");
		var suggestPos = suggest.getBoundingClientRect();
		
		if (suggestPos.y > event.clientY || suggestPos.y + suggestPos.height < event.clientY || suggestPos.x > event.clientX || suggestPos.x + suggestPos.width < event.clientX) {
			suggest.parentNode.removeChild(suggest);
		}
	}
}, false);
 
