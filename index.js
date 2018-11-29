// array con las 12 imagenes (6 imagenes repetidas 2 veces)
var srcList = ["images/alce.jpg", "images/epelante.jpg", "images/nena.jpg", "images/peces.jpg", "images/unichancho.jpg", "images/zapas.jpg", "images/alce.jpg", "images/epelante.jpg", "images/nena.jpg", "images/peces.jpg", "images/unichancho.jpg", "images/zapas.jpg"]
var click1 = {
    src: "",
    element: ""
}
var click2 = {
    src: "",
    element: ""
}
var clicks = 0;
var maxMoves = 0;
var rankingList = JSON.parse(localStorage.getItem("rankingStorage"));
var tries = 0;


// comienza el juego
function startGame() {
    if($("#nameInput").val() == "") {
        $(".name-error").removeClass("hidden");
        $(".name-error").addClass("show");
        setTimeout( function() {
            $(".name-error").removeClass("show");
            $(".name-error").addClass("hidden");
        }, 2000)
    } else {
        $("#homeMenu").removeClass("show");
        $("#homeMenu").addClass("hidden");
        $("#boardCont").removeClass("hidden");
        $("#boardCont").addClass("show");
        $("#name-sel").html( $("#nameInput").val() );
    }
}

// mueve la posicion de los elementos del array de manera random
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;  
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// acomoda las imagenes en el tablero
function placeImg() {
    var i = 0;
    var randomSrc = shuffle(srcList);    
    $(".img").each(function() {
        $(this).attr("src", randomSrc[i])
        i++
    })
}

// contador de clicks
function clickCounter() {
    clicks++
}

// contador de tries
function triesCounter() {
    tries++    
    $("#tries").html("")
    $("#tries").append(tries)
}

// selector de nivel
$(".dif-but").on("click", function() {
    var startButton = $(this).attr("id");
    startGame();
    placeImg();
    flipBoxes();
    if (startButton == "easyBut") {
        maxMoves = 18;
        $("#tries-sel").html(maxMoves);
        $("#dif-sel").html("FACIL");  
    } else if (startButton == "normalBut") {
        maxMoves = 12;
        $("#tries-sel").html(maxMoves);
        $("#dif-sel").html("INTERMEDIO");
    } else if (startButton == "hardBut") {
        maxMoves = 9;
        $("#tries-sel").html(maxMoves);
        $("#dif-sel").html("EXPERTO");
    }
})

// girar las cartas
function flipBoxes() {
    $(".box").on("click", function(event) {
        $(this).children(".front-img").addClass("hidden");
        $(this).children(".back-img").removeClass("hidden");
        clickCounter();
        if ( clicks == 2 ) {
            click2.src = $(this).children(".back-img").children("img")[0].src;
            click2.element = $(this);
            
            if ( click1.element.attr("id") != click2.element.attr("id") ) {
                triesCounter();
                
                if ( click1.src == click2.src ) {
                    clicks = 0
                    $(click1.element).addClass("matched");
                    $(click2.element).addClass("matched");

                } else {
                    setTimeout(function() {
                        $(click1.element).children(".front-img").removeClass("hidden");
                        $(click1.element).children(".back-img").addClass("hidden");
                        $(click2.element).children(".front-img").removeClass("hidden");
                        $(click2.element).children(".back-img").addClass("hidden");
                        clicks = 0
                    }, 500);
                }

                checkWinningCondition();   
            } else {
                clicks = 1;
            }
        } else if (clicks == 1) {
            click1.src = $(this).children(".back-img").children("img")[0].src;
            click1.element = $(this);
        }               
    })
}

// checkea si ganaste o perdiste
function checkWinningCondition() {
    var matchedList = $(".matched").length;
    if( tries == maxMoves ) {
        if (matchedList != 12) {
            youLost();
        } else {
            youWon();
        }
    } else if ( tries <= maxMoves ) {
        if (matchedList == 12) {
            youWon();
        }
    } 
}

// perdiste
function youLost() {
    showResults();
    $(".you-lose").removeClass("hidden");
    $(".player-info").removeClass("show");
    $(".player-info").addClass("hidden");
}

// ganaste (agrega la info del user al ranking)
function youWon() {
    showResults();
    $(".you-won").removeClass("hidden");
    var obj = {
        name: $("#nameInput").val(),
        level: $("#dif-sel").html(),
        tries: tries
    }
    if ( rankingList  == null ) {
        rankingList = []
    } else {
        rankingList = rankingList;
    } 
    rankingList.push(obj)
    localStorage.setItem("rankingStorage", JSON.stringify(rankingList))
    appendRanking()
}

// muestra el cartel de perdiste/ganaste
function showResults() {
    $(".win-lose").removeClass("hidden");
    $(".win-lose").addClass("show");
    $(".main-container").addClass("opacity");
    $(".box").addClass("disableClick");
    $("#player-name").html( $("#nameInput").val() )
    $("#player-tries").html(tries)
    $("#triesSpan").html(tries)
}

// appendear el ranking
function appendRanking() {
    for (var i = 0 ; i < rankingList.length ; i++) {
        var playerName = "<p>" + rankingList[i].name + "</p>"
        var playerLevel = "<p>" + rankingList[i].level + "</p>"
        var playerTries = "<p>" + rankingList[i].tries + "</p>"
        $(".player-name").append(playerName)
        $(".player-level").append(playerLevel)
        $(".player-tries").append(playerTries)
    }
}

// jugar otra vez
$("#playAgainBut").on("click", function() {
    window.location.reload();
})
