var validPropNames = ["RoomNumber", "RoomType", "FloorNumber"];
var dirDataList;


$(document).ready(function() {
    var dataSource = "AAB"
    if(currentBuilding == "TB"){
        dataSource = "TB"
    }
    $.ajax({
        // url: "data/rooms" + currentBuilding + ".csv", 
        url: "frontend/php/getData.php?dbtable=rooms" + dataSource.toLowerCase(),
        // url: "http://www.visixcreative.com/test/SLCC/frontend/php/getData.php?dbtable=rooms" + currentBuilding.toLowerCase(),
        // dataType: "text", 
        dataType: "json",
        success: function(data) {
            console.log("success");
            //data = $.csv.toObjects(data); //only needed for csv data and requires jquery.csv.min.js
            console.log(data)
            dirDataList = data;
            dirDataList.forEach(e => {
                e.RoomNumber = e.field1;
                e.RoomType = e.field2;
                e.FloorNumber = e.field3;
                delete e.field1;
                delete e.field2;
                delete e.field3;
            })
            document.getElementById("roomDirContainer").appendChild(buildDirectory(dirDataList, "roomDirContainerList", validPropNames, createFindIt));
            sortList(document.getElementById("roomDirContainerList"), 0, true);
            document.getElementById("roomDirContainerList").children[0].className += " rowA";
            $("#roomDirContainer").mCustomScrollbar({
                axis: "y",
                theme: "dark",
                scrollButtons: {
                    enable: false,
                    scrollType: "stepped",
                    scrollAmount: 880
                }
            });
        },
        error: function(xhr, status) {
            console.log(xhr, status);
        }
    });
});


var createFindIt = function(id) {
    var imgElem = document.createElement('img');
    imgElem.className = "mapItBtn";
    imgElem.src = "img/mapItBtn.png";
    imgElem["id"] = id;

    $(imgElem).click(function() {
        console.log(this.parentNode.data);

        //ADD FUNCTIONALITY TO MAP TO ROOM
        //data of the row can be accessed at this.parentNode.data for mapping to room
        $("#aab_buttn").click();
        getRoute(this.parentNode.data.RoomNumber.replace(/-/g, ""));
    })

    return imgElem;
}


$("#roomRowDownBtn").click(function() {
    var nextElem = $("#roomDirContainerList .rowA").next()[0];
    if (nextElem !== undefined) {
        $("#roomDirContainerList .rowA").removeClass("rowA")
        $(nextElem).addClass("rowA");

        $("#roomDirContainer").mCustomScrollbar("scrollTo", nextElem, {
            scrollInertia: 0
        });
    }
})

$("#roomRowUpBtn").click(function() {
    var prevElem = $("#roomDirContainerList .rowA").prev()[0];
    if (prevElem !== undefined) {
        $("#roomDirContainerList .rowA").removeClass("rowA")
        $(prevElem).addClass("rowA");

        $("#roomDirContainer").mCustomScrollbar("scrollTo", prevElem, {
            scrollInertia: 0
        });
    }
})



function searchRoomDirectory(text) {
    ul = document.getElementById("roomDirContainerList");
    li = ul.getElementsByTagName('li');
    //text = text.replace(" to ", "2");
    text = text.toLowerCase();
    text = text.replace(":", "");
    text = text.replace(",", "");
    var textMultiCheck = text

    text = text.replace(/\W/g, '');

    numText = text.replace("too", "2")
    numText = numText.replace(":", "")
    numText = numText.replace("zr", "0")
    numText = numText.replace("to", "2")
    numText = numText.replace(" to ", "2")
    numText = numText.replace(/[^\d.]/g, '');
    numText = numText.padStart(3, '0')
    console.log("heres numText", numText)
    var roomNumberGiven = false
    if (textMultiCheck.indexOf("stratton") == -1 && textMultiCheck.indexOf("puerto") == -1 && numText != '000' && numText != '002' && numText.length == 3) {
        roomNumberGiven = true
    } else if (textMultiCheck.indexOf("stratton") == -1 && textMultiCheck.indexOf("puerto") == -1 && numText.length == 4 && numText[0] == "2") {
        numText = numText.substring(1, 4);
        roomNumberGiven = true;
    }
    var foundRoom = false
    if (roomNumberGiven && roomNumberMatch(numText)) {
        return true
    }
    if (findBestMatch(textMultiCheck)) {
        return true
    } else {
        return false
    }
}

function findBestMatch(text) {
    ul = document.getElementById("roomDirContainerList");
    li = ul.getElementsByTagName('li');

    textMultiCheckArr = text.split(" ");

    var longestMatchLength = 0
    var longestMatchString = ""
    var longestMatchIndex = -1
    var found = false;
    var visibleRoomIndex = 0
    var scrollIndex = 0
    for (var i = 0; i < li.length; i++) {
        if (li[i].style.display == "") {
            visibleRoomIndex++;
            var curRow = $(li[i]).children()[0].data.toLowerCase();
            curRowArr = curRow.split(" ");
            var curMatchLength = 0
            for (var j = 0; j < textMultiCheckArr.length; j++) {
                for (var k = 0; k < curRowArr.length; k++) {
                    if (textMultiCheckArr[j] == curRowArr[k]) {
                        curMatchLength++
                        break
                    }
                }
            }
            if (curMatchLength > longestMatchLength) {
                console.log("For row ", curRow, " Match percentage is: ", curMatchLength / textMultiCheckArr.length)
                longestMatchLength = curMatchLength;
                longestMatchString = curRow;
                longestMatchIndex = i;
                scrollIndex = visibleRoomIndex
                found = true
            }
        }
    }

    if (found) {
        for (var j = 0; j < li.length; j++) {
            document.getElementById("roomDirContainerList").children[j].classList.remove("rowA")
        }
        activeRoomIndex = longestMatchIndex;
        document.getElementById("roomDirContainerList").children[activeRoomIndex].className += " rowA";

        document.getElementById("roomDirContainer").scroll({
            top: (scrollIndex - 1) * 82 + 17,
            behavior: 'smooth'
        });
        return true;
    }
    return false;
}

function roomNumberMatch(numText) {
    var found = false
    var longestMatchIndex = 0
    var visibleRoomIndex = 0;
    var scrollIndex = 0;
    for (var i = 0; i < li.length; i++) {
        if (li[i].style.display == "") {
            visibleRoomIndex++;
            if ($(li[i]).children()[1].data.replace(/[^\d.]/g, '') == numText) {
                console.log("Found", $(li[i]).children()[1].data)
                found = true;
                longestMatchIndex = i;
                scrollIndex = visibleRoomIndex;
                break;
            }
        }
    }

    if (found) {
        for (var j = 0; j < li.length; j++) {
            document.getElementById("roomDirContainerList").children[j].classList.remove("eventRowA")
        }
        activeRoomIndex = longestMatchIndex;
        document.getElementById("roomDirContainerList").children[activeRoomIndex].className += " eventRowA";

        document.getElementById("roomDirectoryContainer").scroll({
            top: (scrollIndex - 1) * 82 + 17,
            behavior: 'smooth'
        });
        return true;
    }
    return false;

}