var bestNavPath = null
var bestTranscription = null
var navPath = null;
var lastPassContainedKeyword = false;
var lastTranscript = null;
var lastText = "";
function speechPipeline(transcript, isFinal) {



    if (navPath != null) {
        return
    }
    var custFilter = transcript
    transcript = transcript.toLowerCase()
    //replace some possible mispronunciations
    transcript = fixMistranslations(transcript)
    //Special case, need to handle here
    if (transcript.indexOf("help") > -1) {
        if(transcript.indexOf("help") > -1){
            logTranslation(custFilter,transcript)
            navPath = ["special"]
            bestTranscription = transcript
            return true
        }
    }


    if (ScreenState.toLowerCase() == "floor" && (transcript.indexOf("see to") > -1 || transcript.indexOf("see two") > -1 || transcript.indexOf("see 2") > -1) && transcript.substring(transcript.toLowerCase().indexOf("brutus") + "brutus".length + 1).length < 20) {
        logTranslation(custFilter,transcript)
        navPath = ["#aab_buttn", '#two']
        bestTranscription = transcript
        return true
    }



    if (transcript != custFilter) {
        console.log("Custom translation was applied: ")
        console.log("Before:", custFilter)
        console.log("After:", transcript)
    }
    if(transcript.length > 10 && transcript.indexOf("brutus") > -1 ){
        $.ajax({
            type: "POST",
            url: "frontend/php/addLog.php",
            async: true,
            data: {entry:[currentPlayer,custFilter,transcript]},
            success: function(msg){
              
            }
          });
    }

    if (!transcript.toLowerCase().includes("brutus")) {
        //console.log("Couldn't find brutus", transcript)
        if (lastPassContainedKeyword) {
            lastPassContainedKeyword = false
        } else {
            return false
        }
    } else {
        lastPassContainedKeyword = true;
        transcript = transcript.substring(transcript.toLowerCase().indexOf("brutus") + "brutus".length + 1)
    }
    if (transcript.length < 5) {
        transcript = transcript.replace("to", "2")
        transcript = transcript.replace("two", "2")
        transcript = transcript.replace("too", "2")
    }
    numTranscript = translateSpeech(transcript)
    var phoneArray = numTranscript.match(/\d+/g);
    //Phone number was given
    if (phoneArray != null && (phoneArray.length == 3)) {
        navPath = ["special"]
        bestTranscription = transcript
        return true
    } else if (phoneArray != null && phoneArray[0].length > 1) {
        return
    }



    if (transcript.toLowerCase().includes("floor") || transcript.toLowerCase().includes("level")) {
        transcript = translateSpeech(transcript)
    }
    //transcript = translateSpeech(transcript)
    //console.log("checking dict")
    for (var i = 0; i < commandDictionary.length; i++) {
        var checkState = ScreenState.toLowerCase()
        navPath = commandDictionary[i][1]
        for (var j = 0; j < commandDictionary[i][0].length; j++) {
            //console.log("checking", commandDictionary[i][0][j].toLowerCase())
            if (commandDictionary[i][2] == undefined) {
                checkState = undefined
                    //console.log("check state undefined")
            } else if (commandDictionary[i][2][0].toLowerCase() != checkState) {
                navPath = null
                    //console.log("check state incorrect, exit")
                break
            } else {
                //console.log("check state match")
            }
            if (transcript.toLowerCase().indexOf(commandDictionary[i][0][j].toLowerCase()) < 0) {
                navPath = null
                break
            }
        }
        if (navPath != null) {
            //console.log("HERE FOUND", transcript, navPath);
            bestNavPath = navPath
            bestTranscription = transcript
            return true
        }
    }
    //console.log("checking dict2")
    //Try again with number transcript
    for (var i = 0; i < commandDictionary.length; i++) {
        var checkState = ScreenState.toLowerCase()
        navPath = commandDictionary[i][1]
        for (var j = 0; j < commandDictionary[i][0].length; j++) {
            //console.log("checking", commandDictionary[i][0][j].toLowerCase())
            if (commandDictionary[i][2] == undefined) {
                checkState = undefined
                    //console.log("check state undefined")
            } else if (commandDictionary[i][2][0].toLowerCase() != checkState) {
                navPath = null
                    //console.log("check state incorrect, exit")
                break
            } else {
                //console.log("check state match")
            }
            if (numTranscript.toLowerCase().indexOf(commandDictionary[i][0][j].toLowerCase()) < 0) {
                navPath = null
                break
            }
        }
        if (navPath != null) {
            //console.log("HERE FOUND", transcript, navPath);
            bestNavPath = navPath
            bestTranscription = numTranscript
            console.log(bestNavPath)
            return true
        }
    }
    console.log("LAST PATH", transcript, navPath);
    return
    return speechNavigation(translateSpeech(transcript), isFinal)

}
function logTranslation(custFilter2,transcript2){
    try{
        $.ajax({
            type: "POST",
            url: "frontend/php/addLog.php",
            async: true,
            data: {entry:[currentPlayer,custFilter2,transcript2]},
            success: function(msg){
              
            }
          });
    } catch(e){

    }

}
function fixMistranslations(transcript) {
    transcript = transcript.toLowerCase()
    
    //replace some possible mispronunciations
    if (transcript.indexOf("brutus") == -1) {
        //transcript = transcript.replace("panda ", "brutus ")
        transcript = transcript.replace("regis ", "brutus ")
        transcript = transcript.replace("future ", "brutus ")
        transcript = transcript.replace("prettiest ", "brutus ")
        transcript = transcript.replace("buddhist ", "brutus ")
        transcript = transcript.replace("prudence ", "brutus ")
        transcript = transcript.replace("biggest ", "brutus ")
        transcript = transcript.replace("weirdest ", "brutus ")
        transcript = transcript.replace("birkenstock ", "brutus ")
        transcript = transcript.replace("buddhist ", "brutus ")
        transcript = transcript.replace("furnace ", "brutus ")
        transcript = transcript.replace("burgess ", "brutus ")
        transcript = transcript.replace("curtis ", "brutus ")
        transcript = transcript.replace("bruchis ", "brutus ")
        transcript = transcript.replace("sturgis ", "brutus ")
        transcript = transcript.replace("british ", "brutus ")
        transcript = transcript.replace("rubis ", "brutus ")
        transcript = transcript.replace("vertisol ", "brutus level ")
        transcript = transcript.replace("puritas ", "brutus ")
        transcript = transcript.replace("prunus ", "brutus ")
        transcript = transcript.replace("vitas ", "brutus ")
    }
    transcript = transcript.replace("-", "")
    transcript = transcript.replace("you", "u")
    transcript = transcript.replace("new", "u")
    transcript = transcript.replace("why", "y")
    transcript = transcript.replace("hawks", "x")
    if(!transcript.toLowerCase().includes("text") && !transcript.toLowerCase().includes("sms")){
        transcript = transcript.replace("225 dea", "225da")
        transcript = transcript.replace("237a a", "237aa")
        transcript = transcript.replace("237a h", "237ah")
        transcript = transcript.replace("101 hard", "101r")
        transcript = transcript.replace("101nae", "101ae")
        transcript = transcript.replace("101a h", "101ah")
        transcript = transcript.replace("101 a h", "101ah")
        transcript = transcript.replace("101a nh", "101ah")
        transcript = transcript.replace("237a h", "237ah")
        transcript = transcript.replace("237 a h", "237ah")
        transcript = transcript.replace("237a nh", "237ah")
        transcript = transcript.replace("237a n", "237an")
        transcript = transcript.replace("237 a n", "237an")
        transcript = transcript.replace("237a s", "237as")
        transcript = transcript.replace("237 a s", "237as")
        transcript = transcript.replace("101av", "101ab")
        transcript = transcript.replace("225 a b", "225ab")
        transcript = transcript.replace("225a e", "225ae")
        transcript = transcript.replace("225cbe", "225ce")
        transcript = transcript.replace("225cte", "225ce")
        transcript = transcript.replace("225 cte", "225ce")
        transcript = transcript.replace("225c dashie", "225ce")
        transcript = transcript.replace("225c e", "225ce")
        transcript = transcript.replace("201's", "201s")
        transcript = transcript.replace("301 e e", "301ee")
        transcript = transcript.replace("301e f", "301ef")
        transcript = transcript.replace("301 e f", "301ef")
        transcript = transcript.replace("g37 ak", "237ak")
        transcript = transcript.replace("237 80", "237at")
        transcript = transcript.replace("2118", "211h")
        transcript = transcript.replace(" 7 e", " 7e")
        transcript = transcript.replace(" 70", " 7e")
        transcript = transcript.replace("115 a r", " 115r")
        transcript = transcript.replace("115ar", "115r")
        transcript = transcript.replace("1 15r", " 115r")
        transcript = transcript.replace("115off", "115r")
        transcript = transcript.replace("101off", "101r")
        transcript = transcript.replace("101 a b", "101ab")
        transcript = transcript.replace("101agent ", "101aj")
    }

    transcript = transcript.replace("a.m.", "am")




    transcript = transcript.replace("mall", "map")
    transcript = transcript.replace("hand ", "hey ")
    transcript = transcript.replace("matthew ", "map to ")
    transcript = transcript.replace("math 2", "map to")
    transcript = transcript.replace("map 2", "map to ")
    transcript = transcript.replace("map-2", "map to ")



    transcript = transcript.replace("math", "map")
    transcript = transcript.replace("matt's", "map")
    transcript = transcript.replace("mapsu", "map")
    transcript = transcript.replace("trout", "route to")
    transcript = transcript.replace("fein", "find")
    transcript = transcript.replace("from", "room")
    transcript = transcript.replace("snap", "map")
    transcript = transcript.replace("rim", "room")
    transcript = transcript.replace("sword", "sort")
    transcript = transcript.replace("show by", "sort by")
    transcript = transcript.replace("spoken", "filter")
    if (transcript.indexOf("show") == -1) {
        transcript = transcript.replace("sho ", "show ")
    }
    transcript = transcript.replace("shelby", "show me")
    transcript = transcript.replace("shoby", "show me")
    transcript = transcript.replace("max", "map")
    transcript = transcript.replace("mapchat", "map to")
    transcript = transcript.replace("squirrel", "scroll")
    transcript = transcript.replace(":", "")
    transcript = transcript.replace("show me the 4 maps", "show me the floor maps")
    transcript = transcript.replace("situ", "see 2")
    transcript = transcript.replace("see to", "see 2")
    transcript = transcript.replace("serpe", "sort by")
    transcript = transcript.replace("wrong", "room")
    transcript = transcript.replace("survival", "sort by level")
    transcript = transcript.replace("not to", "map to")
    transcript = transcript.replace("auto ford", "level four")
    transcript = transcript.replace("mats", "maps")
    transcript = transcript.replace("shue", "show")
    transcript = transcript.replace("shoe", "show")
    transcript = transcript.replace("wommack", "floor maps")
    transcript = transcript.replace("florida", "floor maps")
    transcript = transcript.replace("formats", "floor maps")
    transcript = transcript.replace("dianna's", "anna's")
    transcript = transcript.replace("fight it", "find it")
    transcript = transcript.replace("martin", "map it")
    transcript = transcript.replace("mathis", "map it")
    transcript = transcript.replace("method", "map it")
    transcript = transcript.replace("mapes", "map it")

    if (transcript.indexOf("director") > -1 && transcript.indexOf("directory") == -1) {
        transcript = transcript.replace("director", "directory")
    }

    transcript = transcript.replace("how do i get to", "take me to")

    //Handle rooms that have a letter after
    regex = /[0-9]{3} [a-zA-Z]/
    index = transcript.search(regex)
    if(index > -1){
        transcript = transcript.substr(0,index + 3) + transcript.substr(index+4)
    }
    regex2 = /[0-9]{3}/
    index = transcript.search(regex2)
    if(index > -1 && !transcript.includes("map") && !transcript.includes("route") && !transcript.includes("text") && !transcript.includes("sms")){
        transcript = transcript + " map to"
    }

    return transcript
}

function translateSpeech(transcript) {
    var numberTranscript = transcript;
    numberTranscript = numberTranscript.replace("one", "1");
    numberTranscript = numberTranscript.replace("two", "2");
    numberTranscript = numberTranscript.replace("ii", "2");
    numberTranscript = numberTranscript.replace(" too ", "2");
    numberTranscript = numberTranscript.replace("three", "3");
    numberTranscript = numberTranscript.replace("four", "4");
    numberTranscript = numberTranscript.replace("for", "4");
    numberTranscript = numberTranscript.replace("five", "5");
    //numberTranscript = numberTranscript.replace("v", "5");
    numberTranscript = numberTranscript.replace("six", "6");
    numberTranscript = numberTranscript.replace("seven", "7");
    numberTranscript = numberTranscript.replace("eight", "8");
    numberTranscript = numberTranscript.replace("nine", "9");
    if (transcript.substring(transcript.toLowerCase().indexOf("brutus") + "brutus".length + 1).length < 4) {
        numberTranscript = numberTranscript.replace("to", "2");
    }

    return numberTranscript
}

//Order of these matter.
var commandDictionary = [
    [
        ["Text"],
        ["special"]
    ],
    [
        ["Send"],
        ["special"]
    ],
    [
        ["Help"],
        ["#help"]
    ],
    [
        ["Clothes"],
        ["#helpClose"]
    ],
    [
        ["Close"],
        ["special"]
    ],
    [
        ["Replay"],
        ["special"]
    ],
    [
        ["AAB"],
        ["#aab_buttn"]
    ],
    [
        ["Admin"],
        ['#aab_buttn']
    ],
    [
        ["Gundersen Facilities Services"],
        ["special"]
    ],
    [
        ["Lifetime Activities Center"],
        ["special"]
    ],
    [
        ["Science And Industry"],
        ["special"]
    ],
    [
        ["Markosian Library"],
        ["special"]
    ],
    [
        ["Alder Amphitheater"],
        ["special"]
    ],
    [
        ["Business Building"],
        ["special"]
    ],
    // [
    //     ["Building"],
    //     ["#aab_buttn"]
    // ],
    [
        ["Student Center"],
        ["special"]
    ],
    
    [
        ["Construction Trades"],
        ["special"]
    ],
    [
        ["Technology Building"],
        ["special"]
    ],
    [
        ["Search"],
        ["special"]
    ],
    [
        ["Filter", "Default"],
        ["#defaultBtn"]
    ],
    [
        ["Filter", "Classroom"],
        ["#classroomFilter"]
    ],
    [
        ["Filter", "Common"],
        ["#commonFilter"]
    ],
    [
        ["Filter", "Office"],
        ["#officeFilter"]
    ],
    [
        ["Filter", "Study"],
        ["#studyFilter"]
    ],
    [
        ["Filter", "Conference"],
        ["#conferenceFilter"]
    ],
    [
        ["Filter", "All"],
        ["#allFilter"]
    ],
    [
        ["Reset"],
        ["special"]
    ],
    [
        ["Basement"],
        ['#aab_buttn', '#basement']
    ],
    [
        ["First Floor"],
        ['#aab_buttn', '#one']
    ],
    [
        ["1st Floor"],
        ['#aab_buttn', '#one']
    ],
    [
        ["Second Floor"],
        ['#aab_buttn', '#two']
    ],
    [
        ["2nd Floor"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Third Floor"],
        ['#aab_buttn', '#three']
    ],
    [
        ["3rd Floor"],
        ['#aab_buttn', '#three']
    ],
    [
        ["Fourth Floor"],
        ['#aab_buttn', '#four']
    ],
    [
        ["4th Floor"],
        ['#aab_buttn', '#four']
    ],
    [
        ["Fifth Floor"],
        ['#aab_buttn', '#five']
    ],
    [
        ["5th Floor"],
        ['#aab_buttn', '#five']
    ],
    [
        ["Level 1"],
        ['#aab_buttn', '#one']
    ],
    [
        ["Level 2"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Level to"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Level too"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Level 3"],
        ['#aab_buttn', '#three']
    ],
    [
        ["Level 4"],
        ['#aab_buttn', '#four']
    ],
    [
        ["Level 5"],
        ['#aab_buttn', '#five']
    ],
    [
        ["1"],
        ['#aab_buttn', '#one'],
        ["floor"]
    ],
    // [
    //     ["2"],
    //     ['#aab_buttn', '#two'],
    //     ["floor"]
    // ],
    [
        ["2nd"],
        ['#aab_buttn', '#two'],
        ["floor"]
    ],
    [
        ["second"],
        ['#aab_buttn', '#two'],
        ["floor"]
    ],
    // [
    //     ["3"],
    //     ['#aab_buttn', '#three'],
    //     ["floor"]
    // ],
    [
        ["3rd"],
        ['#aab_buttn', '#three'],
        ["floor"]
    ],
    [
        ["third"],
        ['#aab_buttn', '#three'],
        ["floor"]
    ],
    // [
    //     ["4"],
    //     ['#aab_buttn', '#four'],
    //     ["floor"]
    // ],
    [
        ["4th"],
        ['#aab_buttn', '#four'],
        ["floor"]
    ],
    [
        ["fourth"],
        ['#aab_buttn', '#four'],
        ["floor"]
    ],
    // [
    //     ["5"],
    //     ['#aab_buttn', '#five'],
    //     ["floor"]
    // ],
    [
        ["Floor 1"],
        ['#aab_buttn', '#one']
    ],
    [
        ["Floor 2"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Floor 3"],
        ['#aab_buttn', '#three']
    ],
    [
        ["Floor 4"],
        ['#aab_buttn', '#four']
    ],
    [
        ["Floor 5"],
        ['#aab_buttn', '#five']
    ],
    [
        ["First"],
        ['#aab_buttn', '#one']
    ],
    [
        ["Second"],
        ['#aab_buttn', '#two']
    ],
    [
        ["Third"],
        ['#aab_buttn', '#three']
    ],
    [
        ["Forth"],
        ['#aab_buttn', '#four']
    ],
    [
        ["Fourth"],
        ['#aab_buttn', '#four']
    ],
    [
        ["Fifth"],
        ['#aab_buttn', '#five']
    ],
    // [
    //     ["Event"],
    //     ['#eventDirBtn']
    // ],
    [
        ["Events Directory"],
        ['#eventdirectory_btn']
    ],
    [
        ["Event Directory"],
        ['#eventdirectory_btn']
    ],
    [
        ["Event"],
        ['#eventdirectory_btn']
    ],
    [
        ["Academic and administration"],
        ['#aab_buttn']
    ],
    // [
    //     ["Tech"],
    //     ['#aab_buttn']
    // ],
    // [
    //     ["Technology"],
    //     ['#aab_buttn']
    // ],
    [
        ["Event Directory"],
        ['#eventdirectory_btn']
    ],
    // [
    //     ["Room"],
    //     ['#roomDirBtn']
    // ],
    [
        ["Room Directory"],
        ['#roomdirectory_btn']
    ],
    // [
    //     ["Room"],
    //     ['#roomdirectory_btn']
    // ],
    [
        ["Destination"],
        ['#roomdirectory_btn']
    ],
    [
        ["Destination Directory"],
        ['#roomdirectory_btn']
    ],
    [
        ["Campus"],
        ["#campusmap_btn"]
    ],
    [
        ["Campus Map"],
        ["#campusmap_btn"]
    ],
    [
        ["Floor"],
        ['#aab_buttn']
    ],
    [
        ["Floor Map"],
        ['#aab_buttn']
    ],
    [
        ["Map to"],
        ['special']
    ],
    [
        ["Route to"],
        ['special']
    ],
    [
        ["Route"],
        ['special']
    ],
    [
        ["Map"],
        ['special']
    ],
    [
        ["Route 2"],
        ['special']
    ],
    [
        ["Show me"],
        ['special']
    ],
    [
        ["Sho "],
        ['special']
    ],
    [
        ["Go to"],
        ['special']
    ],
    [
        ["Take me"],
        ['special']
    ],
    [
        ["Scroll"],
        ["special"],
        ["room"]
    ],
    [
        ["Scroll"],
        ["special"],
        ["event"]
    ],
    [
        ["Find it"],
        ["special"],
        ["room"]
    ],
    [
        ["Map it"],
        ["special"],
        ["room"]
    ],
    [
        ["Find it"],
        ["special"],
        ["event"]
    ],
    [
        ["Find"],
        ["special"],
        ["room"]
    ],
    [
        ["Find"],
        ["special"],
        ["event"]
    ],
    [
        ["Locate"],
        ["#roomMapItBtn"],
        ["room"]
    ],
    [
        ["Locate"],
        ["#eventMapItBtn"],
        ["event"]
    ],
    [
        ["Route"],
        ["#roomMapItBtn"],
        ["room"]
    ],
    [
        ["Route"],
        ["#eventMapItBtn"],
        ["event"]
    ],
    [
        ["Page"],
        ["special"]
    ],
    [
        ["Page"],
        ["special"]
    ],

    [
        ["Direction"],
        ["special"]
    ],
    [
        ["Directions"],
        ["special"]
    ],
    [
        ["Clear"],
        ["special"]
    ],
    [
        ["Delete"],
        ["special"]
    ],
    [
        ["Nevermind"],
        ["special"]
    ],
    [
        ["work"],
        ["special"]
    ],
    [
        ["get"],
        ["special"],
        ["floor"]
    ],
    [
        ["where"],
        ["special"],
        ["floor"]
    ],
    [
        ["2"],
        ['#aab_buttn', '#two'],
        ["floor"]
    ],
    [
        ["3"],
        ['#aab_buttn', '#three'],
        ["floor"]
    ],
    [
        ["4"],
        ['#aab_buttn', '#four'],
        ["floor"]
    ],
    [
        ["5"],
        ['#aab_buttn', '#five'],
        ["floor"]
    ],
]

customPhrases = []
$.ajax({
    type: "GET",
    url: "frontend/php/getData.php?dbtable=commands",
    // url: "http://www.visixcreative.com/test/SLCC/frontend/php/getData.php?dbtable=tbt" + currentBuilding.toLowerCase(),
    dataType: "json",
    success: function(data) {
        console.log('custom phrase data ', data)
        customPhrases = []
        i = 0
        data.forEach(e => {
            insertItem = new Object();
            insertItem.phrase = e.field1;
            insertItem.building = e.field2;
            insertItem.location = e.field3;
            customPhrases[i] = insertItem;
            i++;
        })
        console.log(customPhrases)
    }
});