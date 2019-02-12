// Initialize Firebase
var config = {
    apiKey: "AIzaSyCB7rul7DyyZXhmM_6UoDyBQuom0qWIR5Y",
    authDomain: "it-de7b7.firebaseapp.com",
    databaseURL: "https://it-de7b7.firebaseio.com",
    projectId: "it-de7b7",
    storageBucket: "",
    messagingSenderId: "898002933789"
};

firebase.initializeApp(config);

var database = firebase.database();

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function writeUserData() {
    var mobileNumber = document.getElementById("mobile_number").value;
    var userName = document.getElementById("user_name").value;
    if (Number(parseInt(mobileNumber)) != mobileNumber) {
        Materialize.toast('Please enter your mobile number');
        return;
    }

    if (getCookie("mobileNumber") === mobileNumber + "") {
        window.open("./round_one.html", "_self");
    }

    document.cookie = "mobileNumber=" + mobileNumber;
    document.cookie = "userName=" + userName;

    if (mobileNumber.length > 1 && userName.length > 1) {
        firebase.database().ref('participants/' + mobileNumber + '/').set({
            user_name: userName,
            result: 10
        });
        window.open("./round_one.html", "_self");
    }
}
