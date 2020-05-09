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
				
				//Write element label
				var newElem = document.createElement("p");
				newElem.innerHTML = cap("name") + ": " + key[keysSorted[each]]["name"];
				newSkill.append(newElem);
				
				//Get each skill element
				for (var elem in key[keysSorted[each]]) {
					if (elem != "contribute" && elem != "name") {
						var newElem = document.createElement("p");
						newElem.innerHTML = cap(elem) + ": " + key[keysSorted[each]][elem];
						newSkill.append(newElem);
					}
				}
				
				//User skill level
				var userSkill = document.createElement("div");
				userSkill.classList.add("userSkill");
				userSkill.id = "skillLevel" + keysSorted[each];
				userSkill.skillId = keysSorted[each];
				
				//User skill level label
				var userSkillLabel = document.createElement("label");
				userSkillLabel.innerHTML = "Skill level: ";
				userSkillLabel.classList.add("userSkillLabel");
				userSkill.append(userSkillLabel);
				
				userSkill.append(document.createElement("br"));
				
				//Set background color according to current level
				firebase.database().ref('users/' + uid).once('value').then(function(snapshot) {
					var getSkillLevel = snapshot.val();
					for (var every in getSkillLevel) {
						var curSkilLevel = document.getElementById("skillLevel" + every);
						if (getSkillLevel[every] == 0) {
							curSkilLevel.style.backgroundColor = "grey";
						} else if (getSkillLevel[every] == 1) {
							curSkilLevel.style.backgroundColor = "red";
						} else if (getSkillLevel[every] == 2) {
							curSkilLevel.style.backgroundColor = "yellow";
						} else if (getSkillLevel[every] == 3) {
							curSkilLevel.style.backgroundColor = "green";
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
							if (i == 1) userSkillLevel.style.backgroundColor = "red";
							else if (i == 2) userSkillLevel.style.backgroundColor = "yellow";
							else if (i == 3) userSkillLevel.style.backgroundColor = "green";
							
							//Change skill level
							userSkillLevel.onclick = function() {
								var getParent = document.getElementById("skillLevel" + this.skillId)
								if (this.levelId == 1) getParent.style.backgroundColor = "red";
								else if (this.levelId == 2) getParent.style.backgroundColor = "yellow";
								else if (this.levelId == 3) getParent.style.backgroundColor = "green";
								saveSkills(this.skillId, this.levelId);
							}
							pickSkillLevel.append(userSkillLevel);
						}
						this.append(pickSkillLevel);
					}
				}
				
				newSkill.append(userSkill);
				
				//Append to output
				skills.append(newSkill);
			}
		//If no skills found
		} else skills.innerHTML = "No skills found."
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
	if (skillName == "" || skillPosition == "" || skillRotations == "" || skillTwists == "" || skillDiff == "" || skillPlatform == "") {
		alert("Must be filled out");
		return;
	}

	var newSkill = {
		"name": skillName,
		"position": skillPosition,
		"rotations": skillRotations,
		"twists": skillTwists,
		"diff": skillDiff,
		"platform": skillPlatform,
		"contribute": {
			"email": email,
			"uid": uid
		}
	}

	if (ref) {
		ref.push(newSkill);
		console.log("Database: Success");
		window.location.reload();
	} else {
		console.log("Database: Error - 404");
	}
}