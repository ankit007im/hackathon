$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyCIzhXw6-5g5Tr_aW3ByOuobWnSjGSI7X8",
    authDomain: "vue-login-3ceac.firebaseapp.com",
    databaseURL: "https://vue-login-3ceac.firebaseio.com",
    projectId: "vue-login-3ceac",
    storageBucket: "vue-login-3ceac.appspot.com",
    messagingSenderId: "245290657588",
    appId: "1:245290657588:web:4e45e3d270abeb64",
  };
  firebase.initializeApp(config);

  const auth = firebase.auth();
  const dbRef = firebase.database().ref("users");
  var auths = null;

  //Register
  $("#registerForm").on("submit", e => {
    e.preventDefault();
    var data = {
      username: $("#registerUsername").val(),
      email: $("#registerEmail").val(),
    };
    var passwords = {
      password: $("#registerPassword").val(), //get the pass from Form
      cPassword: $("#registerConfirmPassword").val(), //get the confirmPass from Form
    };
    if (
      data.email != "" &&
      passwords.password != "" &&
      passwords.cPassword != ""
    ) {
      if (passwords.password == passwords.cPassword) {
        //create user
        auth
          .createUserWithEmailAndPassword(data.email, passwords.password)
          .then(user => {
            return user.updateProfile({
              displayName: data.username,
            });
          })
          .then(user => {
            auths = user;
            //saving the profile data
            dbRef
              .child(user.uid)
              .set(data)
              .then(() => {
                console.log("User Information Saved: ", user.uid);
              });
          })
          .catch(error => {
            console.log("Error creating User: ", error);
          });
      } else {
        alert("Password didn't match");
      }
    }
  });

  //Login
  $("#login").on("submit", e => {
    e.preventDefault();
    if ($("#loginUsername").val() != "" && $("#loginPassword").val() != "") {
      //login the user
      var data = {
        username: $("#loginUsername").val(),
        password: $("#loginPassword").val(),
      };
      auth
        .signInWithEmailAndPassword(data.username, data.password)
        .then(authData => {
          alert("Succesfully Regestier");
        })
        .catch(error => {
          console.log("Login Failed: ", error);
        });
    }
  });

  $("#logout").on("click", function(e) {
    e.preventDefault();
    firebase.auth().signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      auths = user;
      $("body")
        .removeClass("auth-false")
        .addClass("auth-true");
      dbRef
        .child(user.uid)
        .once("value")
        .then(function(data) {
          var info = data.val();
          if (user.photoUrl) {
            $(".user-info img").show();
            $(".user-info img").attr("src", user.photoUrl);
            $(".user-info .user-name").hide();
          } else if (user.displayName) {
            $(".user-info img").hide();
            $(".user-info").append(
              '<span class="user-name">' + user.displayName + "</span>",
            );
          }
        });
    }
  });
});
