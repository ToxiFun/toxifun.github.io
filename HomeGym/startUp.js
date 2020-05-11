function startUp() {
	firebase.auth().onAuthStateChanged(function(user) {
		//LOGGED IN
		if (user) {
			console.log("User signed in.");
			document.getElementById('firebaseui-auth-container').style.display = 'none';
			document.getElementById('loginLoader').style.display = 'none';
			document.getElementById('headerLogin').style.display = 'none';
            
			document.getElementById('loggedIn').style.display = 'block';
			
			var user = firebase.auth().currentUser

			if (user != null) {
			  name = user.displayName;
			  email = user.email;
			  photoUrl = user.photoURL;
			  emailVerified = user.emailVerified;
			  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
							   // this value to authenticate with your backend server, if
							   // you have one. Use User.getToken() instead.
			}
			document.getElementById("userNameTitle").innerHTML = cap(JSONcommands["welcome"][language]) + " " + name + "!";
			
		//NOT LOGGED IN
		} else {
			document.getElementById('loggedIn').style.display = 'none';
			console.log("No user signed in.");
			
			var ui = new firebaseui.auth.AuthUI(firebase.auth());

			ui.start('#firebaseui-auth-container', {
			  signInOptions: [
				{
				  provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
				  signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
				}
			  ],
			  // Other config options...
			});
			
			var uiConfig = {
				  callbacks: {
					signInSuccessWithAuthResult: function(authResult, redirectUrl) {
					  // User successfully signed in.
					  // Return type determines whether we continue the redirect automatically
					  // or whether we leave that to developer to handle.
					  //return true;
					},
					uiShown: function() {
					  // The widget is rendered.
					  // Hide the loginLoader.
					  document.getElementById('loginLoader').style.display = 'none';
					}
				  },
				  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
				  signInFlow: 'popup',
				  signInSuccessUrl: '<url-to-redirect-to-on-success>',
				  signInOptions: [
					// Leave the lines as is for the providers you want to offer your users.
					firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					//firebase.auth.TwitterAuthProvider.PROVIDER_ID,
					//firebase.auth.GithubAuthProvider.PROVIDER_ID,
					firebase.auth.EmailAuthProvider.PROVIDER_ID,
					//firebase.auth.PhoneAuthProvider.PROVIDER_ID
				  ],
				  // Terms of service url.
				  tosUrl: '<your-tos-url>',
				  // Privacy policy url.
				  privacyPolicyUrl: '<your-privacy-policy-url>'
				};

			ui.start('#firebaseui-auth-container', uiConfig);
		}
	loadSkills();
	refreshHTML();
	});
}

function refreshHTML() {
	var labels = document.getElementsByTagName('LABEL');
	for (var i = 0; i < labels.length; i++) {
		labels[i].innerHTML = cap(JSONcommands[labels[i].htmlFor][language]);
	}
	
	var inputs = document.getElementsByTagName('INPUT');
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "button" && inputs[i].classList != "pickLang" && inputs[i].value != "") inputs[i].value = cap(JSONcommands[inputs[i].id][language]);
	}
	
	var H1s = document.getElementsByTagName('H1');
	for (var i = 0; i < H1s.length; i++) {
		if (H1s[i].id != "userNameTitle") H1s[i].innerHTML = cap(JSONcommands[H1s[i].id][language]);
	}
    
    var Ps = document.getElementsByTagName('P');
	for (var i = 0; i < Ps.length; i++) {
		if (Ps[i].id != "userNameTitle" && Ps[i].id != "") Ps[i].innerHTML = cap(JSONcommands[Ps[i].id][language]);
	}
}


function checkLanguage() {
	var allChildren = document.querySelectorAll( 'body *' );
	for (var i = 0; i < allChildren.length; i++) {
		if (allChildren != "") {
		}
	}
}