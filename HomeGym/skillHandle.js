function loadSkills() {
	
	firebase.database().ref("tumblingSkills").once('value').then(function(snapshot) {
		var key = snapshot.val();
		var skills = document.getElementById("skills");

		if (key) {
		
			//Sort according to platform
			keysSorted = Object.keys(key).sort(function(a,b){
				if(key[a]["platform"] < key[b]["platform"]) { return -1; }
				if(key[a]["platform"] > key[b]["platform"]) { return 1; }
				return 0;
			});
			
			//Get each skill
			skills.innerHTML = "";
			for (var each in keysSorted) {
				var newSkill = document.createElement("div");
				newSkill.classList.add("skill");
				
				//Write element name - holder
				var nameHolder = document.createElement("p");
					nameHolder.classList.add("name");
				
					//Make element title
					var newElem = document.createElement("span");
					newElem.innerHTML = cap(JSONcommands["name"][language]) + ": ";
					nameHolder.append(newElem);
				
					//Make element name
					var newElemName = document.createElement("span");
					newElemName.classList.add("changable");
					if (key[keysSorted[each]]["name"][language] == undefined) {
						newElemName.innerHTML = "<i>" + cap(JSONcommands["missingName"][language]) + "<i>";
					} else newElemName.innerHTML = key[keysSorted[each]]["name"][language];
					nameHolder.append(newElemName);
					
					//Make edit button
					var contElem = document.createElement("button");
					contElem.classList.add("contElem");
					contElem.innerHTML = "&#9998;";
					contElem.skillId = keysSorted[each];
					if (key[keysSorted[each]]["name"][language] == undefined) contElem.noName = true;
					contElem.onclick = function(event) {
						if (document.getElementById("suggest")) {
						} else {
							//Make tab
							var suggest = document.createElement("div");
							suggest.id = "suggest";
							suggest.classList.add("popupTab");
							var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
							var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
							suggest.style.left = event.clientX + scrollLeft;
							suggest.style.top = event.clientY + scrollTop;
							
							//Make edit but
							var sugInput = document.createElement("input");
							sugInput.type = "button";
							sugInput.classList.add("suggest");
							sugInput.classList.add("sugInput");
							sugInput.skillId = this.skillId;
							sugInput.noName = this.noName;
							sugInput.id = "sugAnotherName";
							sugInput.value = JSONcommands["sugAnotherName"][language];
							sugInput.onclick = function() {
								var otherNames = prompt(JSONcommands["nameMessage"][language]);
								if (otherNames != "" && isNaN(otherNames)) {
									if (this.noName) {
										var holder = {};
										holder[language] = otherNames;
										firebase.database().ref("tumblingSkills/" + this.skillId + "/name/" + language).set(
											otherNames
										);
										var suggest = document.getElementById("suggest");
										suggest.parentNode.removeChild(suggest);
									} else {
										firebase.database().ref("tumblingSkills/" + this.skillId + "/otherNames/" + language).push(
											otherNames
										);
									}
									var conRapport = {}
									conRapport["email"] = email;
									conRapport["uid"] = uid;
									conRapport["conribution"] = otherNames + " suggestion";
									firebase.database().ref("tumblingSkills/" + this.skillId + "/contribute").push(
										conRapport
									);
									console.log("Send");
									startUp();
								} else if (otherNames != null) {
									alert(JSONcommands["inputError"][language]);
								}
							}
							suggest.append(sugInput);
							
							//Make reportage but
							var repInput = document.createElement("input");
							repInput.type = "button";
							repInput.classList.add("suggest");
							repInput.classList.add("repInput");
							repInput.skillId = this.skillId;
							repInput.id = "report";
							repInput.value = JSONcommands["report"][language];
							repInput.onclick = function() {
								var reportage = prompt(JSONcommands["reportMessage"][language]);
								console.log(reportage)
								if (reportage != null) {
									var conRapport = {}
									conRapport["email"] = email;
									conRapport["uid"] = uid;
									conRapport["conribution"] = "report";
									conRapport["report"] = reportage;
									firebase.database().ref("tumblingSkills/" + this.skillId + "/reportages").push(
										reportage
									);
									console.log("Send");
									var suggest = document.getElementById("suggest");
									suggest.parentNode.removeChild(suggest);
									startUp();
								}
							}
							suggest.append(repInput);
							
							this.parentElement.append(suggest);
							//sugInput.focus();
						}
					}
					nameHolder.append(contElem);
					
				newSkill.append(nameHolder);
				
				//Get each skill element
				for (var elem in key[keysSorted[each]]) {
					if (elem != "contribute" && elem != "name" && elem != "otherNames" && elem != "reportages") {
						//Write element name
						var nameHolder = document.createElement("p");
						nameHolder.classList.add(elem);
						
						//Make element title
						var newElem = document.createElement("span");
						newElem.innerHTML = cap(JSONcommands[elem][language]) + ": "
						nameHolder.append(newElem);
						
						//Make element content
						var newElemName = document.createElement("span");
						newElemName.classList.add("changable");
						//Get average difficulty
						if (elem == "diff" || elem == "difficulty") {
							var calAvg = 0;
							var count = 0;
							for (var diff in key[keysSorted[each]][elem]) {
								calAvg += parseInt(key[keysSorted[each]][elem][diff]);
								count++;
							}
							newElemName.innerHTML += calAvg / count;
						} else {
							if (isNaN(key[keysSorted[each]][elem])) newElemName.innerHTML += cap(JSONcommands[key[keysSorted[each]][elem]][language]);
							else newElemName.innerHTML += key[keysSorted[each]][elem];
						}
						nameHolder.append(newElemName);
						
						if (elem == "diff" || elem == "difficulty") {
							//Make edit button
							var contElem = document.createElement("button");
							contElem.classList.add("contElem");
							contElem.skillId = keysSorted[each];
							contElem.elem = elem;
							contElem.innerHTML = "&#9998;";
							contElem.onclick = function(event) {
								if (document.getElementById("suggest")) {
								} else {
									//Make tab
									var suggest = document.createElement("div");
									suggest.id = "suggest";
									var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
									var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
									suggest.style.left = event.clientX + scrollLeft;
									suggest.style.top = event.clientY + scrollTop;
									
									//Make edit but
									var sugInput = document.createElement("input");
									sugInput.type = "button";
									sugInput.classList.add("suggest");
									sugInput.classList.add("sugInput");
									sugInput.skillId = this.skillId;
									sugInput.elem = this.elem;
									sugInput.id = "sugAnotherName";
									sugInput.value = JSONcommands["sugAnotherName"][language];
									sugInput.onclick = function() {
										var otherNames = prompt(JSONcommands["nameMessage"][language]);
										if (otherNames != "" && !isNaN(otherNames)) {
											firebase.database().ref("tumblingSkills/" + this.skillId + "/" + sugInput.elem).push(
												otherNames
											);
											var conRapport = {}
											conRapport["email"] = email;
											conRapport["uid"] = uid;
											conRapport["conribution"] = sugInput.elem + " suggestion";
											firebase.database().ref("tumblingSkills/" + this.skillId + "/contribute").push(
												conRapport
											);
											console.log("Send");
											var suggest = document.getElementById("suggest");
											suggest.parentNode.removeChild(suggest);
											startUp();
										} else if (otherNames != null) {
											alert(JSONcommands["inputError"][language]);
										}
									}
									suggest.append(sugInput);
									
									this.parentElement.append(suggest);
									//sugInput.focus();
								}
							}
							nameHolder.append(contElem);
						}
						newSkill.append(nameHolder);
					}
				}
				
				//User skill level
				var userSkill = document.createElement("div");
				userSkill.classList.add("userSkill");
				userSkill.id = "skillLevel" + keysSorted[each];
				userSkill.skillId = keysSorted[each];
                userSkill.style.backgroundColor = JSONcolors.userSkill.grey;
                userSkill.style.fontWeight = "bold";
				
				//User skill level label
				var userSkillLabel = document.createElement("label");
				userSkillLabel.innerHTML = cap(JSONcommands["execution"][language]);
				userSkillLabel.htmlFor = "execution";
				userSkillLabel.classList.add("userSkillLabel");
				userSkill.append(userSkillLabel); 
				
				userSkill.append(document.createElement("br"));
				
				//Set background color according to current level
				firebase.database().ref('users/' + uid).once('value').then(function(snapshot) {
					var getSkillLevel = snapshot.val();
					for (var every in getSkillLevel) {
						var curSkillLevel = document.getElementById("skillLevel" + every);
                        curSkillLevel.style.fontWeight = "normal";
						if (getSkillLevel[every] == 1) {
							curSkillLevel.style.backgroundColor = JSONcolors.userSkill.red;
						} else if (getSkillLevel[every] == 2) {
							curSkillLevel.style.backgroundColor = JSONcolors.userSkill.yellow;
						} else if (getSkillLevel[every] == 3) {
							curSkillLevel.style.backgroundColor = JSONcolors.userSkill.green;
						}
					}
				});	
					
				//Open or close level tab
				userSkill.onclick = function() {
					var thisChild = document.getElementById("pickSkillLevel" + this.skillId);
					if (thisChild) thisChild.parentNode.removeChild(thisChild);
					else {
						
						//Make skill level tab
						var pickSkillLevel = document.createElement("div");
						pickSkillLevel.id = "pickSkillLevel" + this.skillId;
						
						//Make skill level radios
						for (var i = 1; i <= 3; i++) {
							var userSkillLevel = document.createElement("div");
							userSkillLevel.classList.add("userSkillLevel");
							userSkillLevel.id = "skillLevelRadio_" + keysSorted[each] + "_" + i;
							userSkillLevel.skillId = this.skillId;
							userSkillLevel.levelId = i;
							userSkillLevel.style.textAlign = "center";
								if (i == 1) {
                                    userSkillLevel.style.backgroundColor = JSONcolors.userSkill.red;
									userSkillLevel.innerHTML = "&#10006;";
								} else if (i == 2) {
									userSkillLevel.style.backgroundColor = JSONcolors.userSkill.yellow;
									userSkillLevel.innerHTML = "&#10069;";
								} else if (i == 3) {
									userSkillLevel.style.backgroundColor = JSONcolors.userSkill.green;
									userSkillLevel.innerHTML = "&#10004;";
								}
							
							//Change skill level
							userSkillLevel.onclick = function() {
								var getParent = document.getElementById("skillLevel" + this.skillId)
								if (this.levelId == 1) getParent.style.backgroundColor = JSONcolors.userSkill.red;
								else if (this.levelId == 2) getParent.style.backgroundColor = JSONcolors.userSkill.yellow;
								else if (this.levelId == 3) getParent.style.backgroundColor = JSONcolors.userSkill.green;
								saveSkills(this.skillId, this.levelId);
							}
							pickSkillLevel.append(userSkillLevel);
						}
						this.append(pickSkillLevel);
					}
				}
				newSkill.append(userSkill);
				
				/*
				var elemLink = document.createElement("a");
				elemLink.innerHTML = JSONcommands["readMore"][language];
				elemLink.href = "element.html";
				newSkill.append(elemLink);
				*/
				
				var hide = document.createElement("button");
				hide.innerHTML = "v";
				hide.classList.add("toggleInfo");
				hide.show = true;
				hide.onclick = function () {
					var siblings = this.parentNode.childNodes;	
					if (this.show) {
						for (var i = 0; i < siblings.length; i++) {
							if (!siblings[i].classList.contains("name") && !siblings[i].classList.contains("toggleInfo")) {
								siblings[i].style.position = "absolute";
								siblings[i].style.visibility = "hidden";
								this.innerHTML = "^"
							}
						}
						this.show = false;
					} else {
						for (var i = 0; i < siblings.length; i++) {
							if (!siblings[i].classList.contains("name") && !siblings[i].classList.contains("toggleInfo")) {
								siblings[i].style.position = "relative";
								siblings[i].style.visibility = "visible";
								this.innerHTML = "v"
							}
						}
						this.show = true;
					}
				}
				newSkill.append(hide);
				
				//Append to output
				skills.append(newSkill);
			}
		//If no skills found
		} else skills.innerHTML = "No skills found."
	checkLanguage();
	});
}

//Save skills to Firebase
function saveSkills(target, changeTo) {
	firebase.database().ref('users/' + uid + "/" + target).set(
		changeTo
	);
}
	
function addSkills() {

	var skillName = document.forms["skillForm"]["skillName"].value;
	var skillPosition = document.forms["skillForm"]["skillPosition"].value;
	var skillRotations = document.forms["skillForm"]["skillRotations"].value;
	var skillTwists = document.forms["skillForm"]["skillTwists"].value;
	var skillDiff = document.forms["skillForm"]["skillDiff"].value;
	var skillPlatform = document.forms["skillForm"]["skillPlatform"].value;
	
	if (skillName == "" || !isNaN(skillName)) return alert("Check name");
	if (skillPosition == "") return alert("Check position");
	if (isNaN(skillRotations) || skillRotations < 0 || skillRotations == "") return alert("Check rotations");
	if (isNaN(skillTwists) || skillTwists < 0 || skillTwists == "") return alert("Check twists");
	if (isNaN(skillDiff) || skillDiff < 1 || skillDiff > 10 || skillDiff == "") return alert("Check difficulty");
	if (skillPlatform == "") return alert("Check platform");

	var newSkill = {
		"name": {},
		"position": skillPosition,
		"rotations": parseInt(skillRotations),
		"twists": parseInt(skillTwists),
		"diff": [parseInt(skillDiff)],
		"platform": skillPlatform,
		"contribute": {
			"creater": {
				"email": email,
				"uid": uid
			}
		}
	}
	newSkill["name"][language] = skillName;

	if (ref) {
		ref.push(newSkill);
		console.log("Database: Success");
		window.location.reload();
	} else {
		console.log("Database: Error - 404");
	}
}