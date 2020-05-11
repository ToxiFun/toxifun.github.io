function languageSwap() {
}

function cap(input) {
	return input.charAt(0).toUpperCase() + input.slice(1); 
}
/* Click to remove editable text input

document.addEventListener('click', function (event) {
	if (event.target.id != "sugInput" && document.getElementById("sugInput") && !event.target.classList.contains("changable")) {
		var sugInput = document.getElementById("sugInput");
		sugInput.parentNode.childNodes[1].style.visibility = "visible";
		sugInput.parentNode.childNodes[1].style.position = "relative";
		//sugInput.parentNode.removeChild(sugInput);
	}
}, false);
*/

/* Confirm and submit editable text input

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
*/

document.addEventListener("mousemove", function(event) {
	if (document.getElementById("suggest")) {
		var suggest = document.getElementById("suggest");
		var suggestPos = suggest.getBoundingClientRect();
		
		if (suggestPos.y > event.clientY || suggestPos.y + suggestPos.height < event.clientY || suggestPos.x > event.clientX || suggestPos.x + suggestPos.width < event.clientX) {
			suggest.parentNode.removeChild(suggest);
		}
	}
	if (document.getElementById("setTab")) {
		var setTab = document.getElementById("setTab");
		var setTabPos = setTab.getBoundingClientRect();
		
		if (setTabPos.y > event.clientY || setTabPos.y + setTabPos.height < event.clientY || setTabPos.x > event.clientX || suggestPos.x + setTabPos.width < event.clientX) {
			setTab.parentNode.removeChild(setTab);
		}
	}
}, false);

function settings(event) {
	if (document.getElementById("setTab")) {
	} else {
        
        //Make tab
		var setTab = document.createElement("div");
		setTab.id = "setTab";
		setTab.classList.add("popupTab");
		var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
		var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		setTab.style.left = event.clientX + scrollLeft;
		setTab.style.top = event.clientY + scrollTop;
		setTab.style.position = "absolute";
		
        //Language button
		var langSwap = document.createElement("div");
		langSwap.id = "langPicks";
		langSwap.classList.add("settingTab");
		langSwap.onclick = function() {
			var thisChild = document.getElementById("languageTab");
			if (thisChild) thisChild.parentNode.removeChild(thisChild);
			else {
				console.log("AD");
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
			}
		}
		var langBut = document.createElement("input");
		langBut.type = "button";
		langBut.value = "Language";
		langBut.id = "language";
		langSwap.append(langBut);
		setTab.append(langSwap);
		
        //Log out button
		var logOut = document.createElement("input");
		logOut.type = "button";
		logOut.value = "Log-out";
		logOut.id = "logout";
		logOut.classList.add("settingTab");
		logOut.onclick = function() {
			firebase.auth().signOut().then(function() {
				// Sign-out successful.
				console.log("Log out complete.");
				window.location.reload();
			}).catch(function(error) {
				// An error happened.
				console.log("Log out error.");
			});
		}
		setTab.append(logOut);
	
		document.body.append(setTab);
	}
}
 
