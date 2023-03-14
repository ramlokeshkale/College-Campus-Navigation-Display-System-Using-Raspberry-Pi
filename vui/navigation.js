var inTroubleshooting = false

function navigatePath(path, transcript) {
    console.log('navigating path', path)
    timerIdleState = false
    if (path[0] == "special") {
        if (specialHandler(transcript)) {
            //Found something, turn off this flag
            lastPassContainedKeyword = false;
        }
        return
    }

    //say("I think you said, " + bestTranscription)
    for (var i = 0; i < path.length; i++) {
        //Found something, turn off this flag
        lastPassContainedKeyword = false;
        $(path[i]).trigger('click')
    }
}

function specialHandler(transcript) {
    timerIdleState = false
    numTranscript = translateSpeech(transcript)
    console.log("In special", transcript)
    var phoneArray = numTranscript.match(/\d+/g);
    if ((transcript.toLowerCase().includes("text") || transcript.toLowerCase().includes("sms") || transcript.toLowerCase().includes("send"))) {

        $("#SMSbtn").trigger('click');

        console.log("Phone transcript", numTranscript)
        try {
            if ($("#pText").text().length == 12) {
                console.log(phoneString)
                setTimeout(function() {
                    $("#pSend").trigger('click');
                }, 1000)
                return true
            }
            phoneArray = phoneArray.join('')
            if (phoneArray.length == 10) {
                phoneString = phoneArray
                $('#pText').text(phoneArray.substring(0, 3) + "-" + phoneArray.substring(3, 6) + "-" + phoneArray.substring(6, 10));
                setTimeout(function() {
                        $("#pSend").trigger('click');
                    }, 1000)
                    //return true;
            }
        } catch (e) {}
    }
    if (transcript.toLowerCase().includes("close")) {
        $("#pClose").trigger('click')
        $("#helpClose").trigger('click')
        return true
    }
    customPhrases.forEach(function(item) {
        console.log(item)
        if (transcript.toLowerCase().indexOf(item.phrase.toLowerCase()) > -1 && item.building.toUpperCase() == currentBuilding.toUpperCase()) {
            transcript = transcript.toLowerCase().replace(item.phrase.toLowerCase(), "customcommand " + item.location.toLowerCase())
            console.log("changed transcript ", transcript)
        }
    })

    if (transcript.toLowerCase().includes("help")) {
        $("#help").trigger('click')
        return true
    }

    if (transcript.toLowerCase().includes("commands")) {
        //Open help menu
        return true
    }
    if (transcript.toLowerCase().includes("academic and administration building") && (currentBuilding != "AAB" || currentBuilding != "AAB2")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Academic and Administration Building"
        return true
    }
    if (transcript.toLowerCase().includes("academic and administration building") && (currentBuilding == "AAB" || currentBuilding == "AAB2")) {
        $("#aab_buttn").trigger('click');
        return true
    }
    if (transcript.toLowerCase().includes("technology building") && currentBuilding != "TB") {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Technology Building"
        return true
    }
    if (transcript.toLowerCase().includes("technology building") && currentBuilding == "TB") {
        $("#aab_buttn").trigger('click');
        return true
    }
    if (transcript.toLowerCase().includes("facilities services") || transcript.toLowerCase().includes("gundersen")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Gundersen Facilities Services"
        return true
    }
    if (transcript.toLowerCase().includes("lifetime activities center") || transcript.toLowerCase().includes("lifetime")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Lifetime Activities Center"
        return true
    }
    if (transcript.toLowerCase().includes("science and industry")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Science And Industry"
        return true
    }
    if (transcript.toLowerCase().includes("markosian library")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Markosian Library"
        return true
    }
    if (transcript.toLowerCase().includes("amphitheater") || transcript.toLowerCase().includes("amphitheatre")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Alder Amphitheater"
        return true
    }
    if (transcript.toLowerCase().includes("business building")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Business Building"
        return true
    }
    if (transcript.toLowerCase().includes("student center")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Student Center"
        return true
    }
    if (transcript.toLowerCase().includes("construction trades")) {
        $("#campusmap_btn").trigger('click')
        $("#SMSbtn2").trigger('click');
        lastRoute = "Construction Trades"
        return true
    }
    if (transcript.toLowerCase().includes("nevermind")) {
        return true
    }
    if (transcript.toLowerCase().includes("reset")) {
        $("#campusmap_btn").trigger('click')
        return true
    }



    if (ScreenState == "Room" && transcript.toLowerCase().includes("find it")) {
        $('#roomMapItBtn').trigger('click')
        return true;
    }
    if (ScreenState == "Room" && transcript.toLowerCase().includes("map it")) {
        $('#roomMapItBtn').trigger('click')
        return true;
    }
    if (ScreenState == "Event" && transcript.toLowerCase().includes("find it")) {
        $('#eventFindItBtn').trigger('click')
        return true;
    }
    if ((transcript.toLowerCase().includes("map to") || transcript.toLowerCase().includes("map") || transcript.toLowerCase().includes("take me") || transcript.toLowerCase().includes("route") || transcript.toLowerCase().includes("show me") || transcript.toLowerCase().includes("where")) && transcript.toLowerCase().includes("event")) {
        //console.log("In route to check1", transcript)
        $("#aab_buttn").click();
        regex3 = /[0-9]{1,3}[a-z-]{0,3}/
        try {
            rt = getRoute(transcript.match(regex3)[0].replace(" ", "").padStart(4, '0'))
            if (!rt) {
                rt = getRoute(transcript.match(regex3)[0].replace(" ", "").padStart(3, '0'))
            }
        } catch (e) {
            rt = false
        }
        if (rt) {
            return true;
        } else {
            // bestDistance = 999999;
            // bestString = "";
            // $(".eventSubHeaderText").each(function(){
            //     lev = levenshtein_distance($(this).text(),transcript)
            //     if(lev < bestDistance){
            //         bestString = $(this)
            //         bestDistance = lev;
            //     }
            // })
            // console.log("Best event match: ", bestString)
            // phoneString = ""
            // $("#pText").text("")
            // $(bestString).parents(".eventBoxContainer").find(".eventMap").trigger('click');
        }
        return true

    }
    if ($("#phone").css("display") == "block") {
        return true
    }
    console.log("Before route to check", transcript)
    if (transcript.toLowerCase().includes("customcommand") || transcript.toLowerCase().includes("map") || transcript.toLowerCase().includes("map to") || transcript.toLowerCase().includes("take me") || transcript.toLowerCase().includes("route") || transcript.toLowerCase().includes("show me") || transcript.toLowerCase().includes("where")) {
        regex3 = /[0-9]{1,3}[a-z-]{0,3}/
        $("#aab_buttn").click();
        try {
            //console.log("In route to check2", transcript, transcript.match(regex3)[0])
            phoneString = ""
            $("#pText").text("")
            rt = getRoute(transcript.match(regex3)[0].replace(" ", "").padStart(4, '0'))
            if (!rt) {
                rt = getRoute(transcript.match(regex3)[0].replace(" ", "").padStart(3, '0'))
            }
        } catch (e) {
            rt = false
        }
        if (rt) {
            return true;
        } else {
            mapKeywords = [
                ["map to"],
                ["map"],
                ["take me"],
                ["route"],
                ["show me"],
                ["where"],
            ]
            foundKey = ""
            mapKeywords.forEach(function(item) {
                if (transcript.indexOf(item) > -1 && foundKey == "") {
                    foundKey = item;
                }
            })
            $("#notFoundRoom").text("The room you requested is not on the map.");
            // $("#notFoundRoom").text("Room not found: " + transcript.substring(transcript.indexOf(foundKey)+foundKey[0].length))
            $("#CommandNotFound").show()
            console.log("Room not found: ", transcript.substring(transcript.indexOf(foundKey) + foundKey[0].length))
            setTimeout(function() {
                    $("#CommandNotFound").fadeOut()
                }, 5000)
                // bestDistance = 999999;
                // bestString = "";
                // $(".eventSubHeaderText").each(function(){
                //     lev = levenshtein_distance($(this).text(),transcript)
                //     if(lev < bestDistance){
                //         bestString = $(this)
                //         bestDistance = lev;
                //     }
                // })
                // console.log("Best event match: ", bestString)
                // $(bestString).parents(".eventBoxContainer").find(".eventMap").trigger('click');
                // phoneString = ""
                // $("#pText").text("")
        }
        return true
    }
    //Search for a room
    if (ScreenState == "Room" && (transcript.toLowerCase().includes("search") || transcript.toLowerCase().includes("map to") || transcript.toLowerCase().includes("map") || transcript.toLowerCase().includes("take me") || transcript.toLowerCase().includes("route to") || transcript.toLowerCase().includes("where") || (transcript.toLowerCase().includes("find") && !transcript.toLowerCase().includes(" it")))) {
        searchRoomDirectory(transcript)
        return true;
    }

    //Search for an event
    if (ScreenState == "Event" && transcript.toLowerCase().includes("search") || transcript.toLowerCase().includes("map to") || transcript.toLowerCase().includes("map") || transcript.toLowerCase().includes("take me") || transcript.toLowerCase().includes("route to") || transcript.toLowerCase().includes("where") || transcript.toLowerCase().includes("what") || (transcript.toLowerCase().includes("find") && !transcript.toLowerCase().includes(" it"))) {
        searchEventDirectory(transcript)
        return true;
    }



    var pageScroll = false
    if (transcript.toLowerCase().includes("page")) {
        console.log("page scroll")
        pageScroll = true
    }
    if ((transcript.toLowerCase().includes("down") && (ScreenState == "Event" || ScreenState == "Room"))) {
        numTranscript = numTranscript.replace("to", "2")
        numTranscript = numTranscript.replace("two", "2")
        var l = numTranscript.match(/\d+/g)
        if (pageScroll) {
            if (l > 0) {
                l = l * 7
            } else {
                l = 7
            }
        }
        if (l > 0) {
            for (i = 0; i < l; i++) {
                $("#roomRowDownBtn").trigger("click");
                $("#eventDownRowBtn").trigger("click");
            }
            return true
        } else {
            $("#roomRowDownBtn").trigger("click");
            $("#eventDownRowBtn").trigger("click");
            return true
        }
    }

    if ((transcript.toLowerCase().includes("up") && (ScreenState == "Event" || ScreenState == "Room"))) {
        numTranscript = numTranscript.replace("to", "2")
        numTranscript = numTranscript.replace("two", "2")
        var l = numTranscript.match(/\d+/g)
        if (pageScroll) {
            if (l > 0) {
                l = l * 7
            } else {
                l = 7
            }
        }
        if (l > 0) {
            for (i = 0; i < l; i++) {
                $("#roomRowUpBtn").trigger("click");
                $("#eventUpRowBtn").trigger("click");
            }
            return true
        } else {
            $("#roomRowUpBtn").trigger("click");
            $("#eventUpRowBtn").trigger("click");
            return true
        }
        return false
    }

}

function levenshtein_distance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};