/***********************************************************************************************************************************
 *   Company: Visix, Inc.
 *   Authors: Andrew Essig & Brian Belies
 *   Utility function library for frequently used functions in wayfinding.
 ************************************************************************************************************************************/

/**
 * !NOTE! rowE and rowO are the assumed css class names to apply even/odd coloring.
 * Sorts an HTML list by a child column. Built to also handle a pre-filtered list.
 * @param {Unordered List} ul HTML unordered list to be modified, without recreating the list.
 * @param {Integer} index Column index to apply the sort against.
 * @param {Boolean} asc If true, sort ascending
 * @return {Boolean} True for Success
 * Example - class row with columns column0, column1, column2. Sort by column1, ascending.
 * sortList(ul, 1, true)
 */
function sortList(ul, index, asc) {
    try {
        var new_ul = ul.cloneNode(false);

        // Add all lis to an array
        var lis = [];
        for (var i = ul.childNodes.length; i--;) {
            if (ul.childNodes[i].nodeName === 'LI')
                lis.push(ul.childNodes[i]);
        }

        // Sort the lis in descending order
        lis.sort(function(a, b) {
            if (asc) {
                if (a.childNodes[index].data > b.childNodes[index].data) {
                    return 1;
                }
                if (a.childNodes[index].data < b.childNodes[index].data) {
                    return -1;
                }
            } else {
                if (a.childNodes[index].data < b.childNodes[index].data) {
                    return 1;
                }
                if (a.childNodes[index].data > b.childNodes[index].data) {
                    return -1;
                }
            }
            return 0;
        });

        // Add them into the ul in order
        for (var i = 0; i < lis.length; i++) {
            if (i % 2 == 0) {
                lis[i].className = "rowE"
            } else {
                lis[i].className = "rowO"
            }
            new_ul.appendChild(lis[i]);
        }

        var y = 0;
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].style.display == "") {
                if (y % 2 == 0) {
                    lis[i].className = "rowE"
                } else {
                    lis[i].className = "rowO"
                }
                new_ul.appendChild(lis[i]);
                y++;
            }
        }

        ul.parentNode.replaceChild(new_ul, ul);
    } catch (err) {
        console.log("Sort failed: ", err, ul, index)
        return false;
    }
    return true;
}


/**
 * !NOTE! rowE and rowO are the assumed css class names to apply even/odd coloring.
 * Filters an HTML list by a child column value. 
 * @param {Stack} filterStack [
 * !INDEX 0!@param {Array} filter filter value(s)
 * !INDEX 1!@param {Integer} index column index
 * !INDEX 2!@param {Boolean} contains true for a contains filter, false for a 1st character check, undefined for exact match
 * ]
 * @param {Unordered List} ul HTML unordered list to be modified, without recreating the list.
 * @return {FilteredList} Filtered list
 */
function comboFilterList(filterStack, ul) {
    try {
        // Declare variables
        var li, a, i, txtValue;
        li = ul[0].getElementsByTagName('li');

        var filteredList = []
        for (v = 0; v < filterStack.length; v++) {
            var filter = filterStack[0]
            var index = filterStack[1]
            var contains = filterStack[2]
                // Loop through all list items, and hide those who don't match the search query
            for (i = 0; i < li.length; i++) {
                li[i].className = li[i].className.replace(" rowA", "");
                a = li[i].children[index];
                txtValue = a.textContent || a.innerText;
                for (j = 0; j < filter.length; j++) {
                    if (filter[j] == "" || txtValue == "") {
                        //li[i].style.display = "";
                        filteredList.push(i);
                        break;
                    } else if (contains === true && txtValue.toUpperCase().indexOf(filter[j].toUpperCase()) > -1) {
                        //li[i].style.display = "";
                        filteredList.push(i);
                        break;
                    } else if (contains === false && filter[j].length > 0 && txtValue[0].toUpperCase().indexOf(filter[j][0].toUpperCase()) > -1) {
                        //li[i].style.display = "";
                        filteredList.push(i);
                        break;
                    } else if (contains === undefined && txtValue.toUpperCase().indexOf(filter[j].toUpperCase()) > -1 && txtValue.length == filter[j].length) {
                        filteredList.push(i);
                        break;
                    } else {
                        //li[i].style.display = "none";
                    }
                }
            }
        }
        var finalFiltered = []
        var y = 0;
        var rowA = true;
        for (i = 0; i < li.length; i++) {
            var validCount = 0
            for (v = 0; v < filteredList.length; v++) {
                if (filteredList[v] == i) {
                    validCount++
                }
            }
            if (validCount == filterStack.length) {
                li[i].style.display = "";
                finalFiltered.push(li[i])
                if (y % 2 == 0) {
                    li[i].className = "rowE"
                } else {
                    li[i].className = "rowO"
                }
                if (rowA == true) {
                    if (li[i].className.indexOf("rowA") == -1)
                        li[i].className += " rowA";
                    rowA = false;
                }
                y++;
            } else {
                li[i].style.display = "none";
            }
        }

    } catch (err) {
        console.log("Filter List has failed: ", err, filter)
        return finalFiltered;
    }
    return finalFiltered;
}


/**
 * !NOTE! rowE and rowO are the assumed css class names to apply even/odd coloring. Must provide at least a json and a name (other parameters are optional).
 * !NOTE! If passed, Function func must have parameter i, which will be the id of the wayfinding button
 * Creates a HTML directory.
 * @param {json} json json data from ajax call
 * @param {String} name String for what the directory will be called
 * @param {Stack} validPropNames [ an array of strings that are equal to the names of the properties to be input into the directory
 * !INDEX 0! @param {String} propName   a string that is equal to a name of one of the properties to be input into the directory
 * !INDEX 1! @param {String} propName   a string that is equal to a name of one of the properties to be input into the directory
 * ...
 * !INDEX X! @param {String} propName   a string that is equal to a name of one of the properties to be input into the directory
 * ]
 * @param {Function} func if provided, creates the wayfinding button 
 * @return {HTMLUListElement} returns an HTMLElement to replace an existing HTMLUListElement
 * 
 * Example:
 * var validPropNames = [
 *     "Name",
 *     "Number",
 *     "Type",
 *     "Level"
 * ];
 * var func = function(i) {
 * var xmlns = "http://www.w3.org/2000/svg";
 *     var boxWidth = 117;
 *     var boxHeight = 82;
 * 
 *     var svgElem = document.createElementNS(xmlns, "svg");
 *     svgElem.setAttributeNS(null, "width", boxWidth);
 *     svgElem.setAttributeNS(null, "height", boxHeight);
 *     svgElem.setAttributeNS(null, "id", id);
 *     svgElem.setAttributeNS(null, "class", "roomFindItRow");
 *     svgElem.setAttributeNS(null, "style", "position:relative;");
 *     svgElem.innerHTML = "<image xlink:href='images/Buttons_other/findit.png'>"
 * 
 *     $(svgElem).click(function() {
 *         goToRoom(roomList.responseJSON[$(this)[0].id].Number)
 *     })
 *     return svgElem;}
 * 
 * getRooms();
 * 
 * function getRooms() {
 *     roomList = $.ajax({
 *         global: false,
 *         url: 'frontend/room-json.php',
 *         dataType: 'json',
 *         async: 'false',
 *         type: 'get',
 *         success: function(json) {
 *             console.log(json); // this will show the info it in firebug console
 *             document.getElementById("roomDirectoryContainer").appendChild(buildDirectory(json, "roomDirContainerList", validPropNames, func));
 *             return json;
 *         }
 *     })
 * }
 */

function buildDirectory(json, name, validPropNames, func) {
    try {
        if (json === undefined) //checking first two parameters to see if they are valid, since they are required
            throw 'Invalid JSON parameter.';
        if (name === undefined)
            throw 'Invalid name parameter';
        if (document.getElementById(name)) {
            var el = document.getElementById(name);
            el.parentNode.removeChild(el);
        }
        var dirContainerList = document.createElement("ul"); //declaring HTMLUListElement
        dirContainerList.id = name;
        for (var i = 0; i < json.length; i++) {
            var newRow = document.createElement("li");
            newRow.data = json[i];
            var funcExists = false;
            if (func)
                funcExists = ((func() instanceof SVGSVGElement) || (func() instanceof HTMLElement));
            if (i % 2 == 0) //alternates names for each row to apply even/odd coloring
                newRow.className = "rowE";
            else
                newRow.className = "rowO";
            newRow.data = json[i];
            newRow.index = i;
            if (validPropNames === undefined)
                validPropNames = Object.getOwnPropertyNames(json[i]);
            validPropNames.forEach(function(j) { //for each property j in json[i]
                if (json[i][j] === undefined)
                    throw 'Invalid property name in parameter array validPropNames: ' + j;
                var newSpan = document.createElement("span");
                newSpan.className = j.replace(/ /g, "");
                newSpan.data = json[i][j];
                if (json[i][j] == null)
                    newSpan.data = "zzzzzzzzz"
                else
                    newSpan.data = json[i][j]

                newSpan.innerText = json[i][j];
                // newSpan.innerHTML = json[i][j];
                // $(newSpan).html(json[i][j])
                newRow.appendChild(newSpan);
            });

            if (funcExists) //if function is defined, call the function with parameter i (to pass for the id of the button)
                newRow.appendChild(func(i));
            dirContainerList.appendChild(newRow);
        }
    } catch (e) {
        console.log("Failed to create directory: ", e, json);
        return dirContainerList;
    }
    return dirContainerList;
}


/* OLD 
function buildDirectory(json, name, optionStack, validPropNames, imgPath, func) {
    try {
        if (json === undefined) //checking first two parameters to see if they are valid, since they are required
            throw 'Invalid JSON parameter.';
        if (name === undefined)
            throw 'Invalid name parameter';
        if (document.getElementById(name)) {
            var el = document.getElementById(name);
            el.parentNode.removeChild(el);
        }
        if (!optionStack) {
            optionStack = [];
            optionStack[0] = "width:1755px; height:82px;font-size:16pt;font-family:sans-serif;line-height: 100%;"; //sets default row CSS
        }
        var dirContainerList = document.createElement("ul"); //declaring HTMLUListElement
        dirContainerList.id = name;
        for (var i = 0; i < json.length; i++) {
            var newRow = document.createElement("li");
            if (optionStack && typeof optionStack == 'string') //if optionStack is just a string instead of an array, then assume only css options for rows was the input
                newRow.style = optionStack;
            else
                newRow.style = optionStack[0];
            if (i % 2 == 0) //alternates names for each row to apply even/odd coloring
                newRow.className = "eventRowE";
            else
                newRow.className = "eventRowO";
            var cssCount = 1;
            if (validPropNames === undefined)
                validPropNames = Object.getOwnPropertyNames(json[i]);
            validPropNames.forEach(function(j) { //for each property j in json[i]
                if (!json[i][j])
                    throw 'Invalid property name in parameter array validPropNames: ';
                var newSpan = document.createElement("span");
                if (optionStack[cssCount] && typeof optionStack != 'string')
                    newSpan.style = optionStack[cssCount]; //attempting to apply css options to a column
                else if (imgPath !== undefined)
                    newSpan.style = "display: inline-block; width:" + parseInt(newRow.style.width, 10) / (validPropNames.length + 1) + "px;";
                else
                    newSpan.style = "display: inline-block; width:" + parseInt(newRow.style.width, 10) / validPropNames.length + "px;";
                cssCount++;
                newSpan.className = j;
                newSpan.data = json[i][j];
                newSpan.innerHTML = json[i][j];
                newRow.appendChild(newSpan);
            });
            if (imgPath !== undefined) { //if imgPath is defined, make a wayfinding button
                var xmlns = "http://www.w3.org/2000/svg";
                var svgElem = document.createElementNS(xmlns, "svg");
                svgElem.innerHTML = "<image xlink:href='" + imgPath + "'>";
                svgElem.setAttributeNS(null, "id", i);
                svgElem.setAttributeNS(null, "class", "roomFindItRow");
                svgElem.setAttributeNS(null, "style", optionStack[cssCount]);
                if (func instanceof Function) {
                    $(svgElem).click(function() {
                        func();
                    })
                }
                if (optionStack[cssCount] && typeof optionStack != 'string')
                    svgElem.style = optionStack[cssCount]; //attempting to apply css options to a column
                newRow.appendChild(svgElem);
            } else if (func() instanceof SVGSVGElement) //if imgPath isn't defined, but function is, call the function with parameter i (to pass for the id of the button)
                newRow.appendChild(func(i));
            dirContainerList.appendChild(newRow);
        }
    } catch (e) {
        console.log("Failed to create directory: ", e, json);
        return dirContainerList;
    }
    return dirContainerList;
}
*/