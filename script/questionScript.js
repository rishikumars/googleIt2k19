document.addEventListener('contextmenu', event => event.preventDefault());

var config = {
    apiKey: "AIzaSyCB7rul7DyyZXhmM_6UoDyBQuom0qWIR5Y",
    authDomain: "it-de7b7.firebaseapp.com",
    databaseURL: "https://it-de7b7.firebaseio.com",
    projectId: "it-de7b7",
    storageBucket: "",
    messagingSenderId: "898002933789"
};

firebase.initializeApp(config);
var minutes = "00";
var seconds = "00";

var results = new Vue({
    el: "#questions",
    data: {
        isRetrieved: false,
        isTimeOver: false,

        i: 0,
        mins: 00,
        secs: 00,
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        images: [],
        answers: [],
        marks: 0
    },
    methods: {
        increment: function() {
            this.i++

                if (this.i === this.arr.length) {
                    this.i = 0
                }
        },
        enterEvent: function(event) {
            event.preventDefault()
            if (event.keyCode == 13) {
                this.check()
            }
        },
        decrement: function() {
            this.i--

                if (this.i === -1)
                    this.i = (this.arr.length - 1)
        },
        shuffle: function() {
            let counter = this.arr.length;
            while (counter > 0) {
                let index = Math.floor(Math.random() * counter);
                counter--;
                let temp = this.arr[counter];
                this.arr[counter] = this.arr[index];
                this.arr[index] = temp;
            }
            this.arr = this.arr.slice(0, 10);

        },
        check: function() {
            if (this.isCompleted() === true) {
                Materialize.toast('You have completed. Results will be announced soon.', 2000)
                return
            }
            if (this.isTimeOver) {
                submitResults();
                alert('Time Over');
                window.open("../thank_you.html", "_self");
                return
            }
            var userAnswer = document.getElementById("quest").value
            if (userAnswer === "") {
                Materialize.toast('Please give an answer', 2000)
            } else {
                if (this.images[this.arr[this.i]].isAnswered === true) {
                    Materialize.toast('You have already answered this!', 2000)
                } else {
                    var userAnswer = document.getElementById("quest").value
                    userAnswer = userAnswer.replace(/ /g, "");
                    userAnswer = userAnswer.toLowerCase()
                    var preparedAnswer = this.images[this.arr[this.i]].answer
                    this.images[this.arr[this.i]].isAnswered = true
                    this.answers.push(this.images[this.arr[this.i]].pic + " : " + userAnswer)
                    if (userAnswer == preparedAnswer) {
                        this.marks++;
                    }

                }
                if (this.isCompleted() === true) {
                    submitResults()
                    window.open("../thank_you.html", "_self");
                    return
                }

                this.increment()
            }
        },
        isCompleted: function() {

            for (var index = 0; index < this.arr.length; index++) {
                if (this.images[this.arr[index]].isAnswered === false) {
                    return false
                }
            }
            return true
        }
    }
})

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

firebase.database().ref('/participants/images').once('value').then(function(snapshot) {
    var retrievedImages = (snapshot.val()) || '';
    if (retrievedImages != '') {
        results.images = retrievedImages;
        results.shuffle();
        results.isRetrieved = true;
        var deadline = new Date(Date.parse(new Date()) + (20 * 60 * 1000));
        initializeClock(deadline);

    } else {
        Materialize.toast("Something went wrong", 2000);
    }
});

function submitResults() {

    var mobileNumber = getCookie("mobileNumber");
    var updates = {};
    updates['/participants/' + mobileNumber + '/' + 'answers'] = results.answers;
    updates['/participants/' + mobileNumber + '/' + 'result'] = results.marks;
    updates['/participants/' + mobileNumber + '/' + 'time'] = minutes + ":" + seconds;
    firebase.database().ref().update(updates);
}



function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    seconds = Math.floor((t / 1000) % 60);
    minutes = Math.floor((t / 1000 / 60) % 60);

    return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(endtime) {


    function updateClock() {
        var t = getTimeRemaining(endtime);
        results.mins = ('0' + t.minutes).slice(-2);
        results.secs = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            results.isTimeOver = true
            clearInterval(timeinterval);
        }

    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}