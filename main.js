var saveFile;
var mapList = maplistEntries.maps;
var items = itemj.items;
var invsort = [[],[],[],[],[],[],[],[]];

document.getElementById("default").click();
document.getElementById("defaultinv").click();

for (var i = 0; i < items.length; i++) {
    var cat;
    
    if (items[i].icon === "item-helm") cat = 0;
    else if (items[i].icon === "item-sword") cat = 1;
    else if (items[i].icon === "item-belt") cat = 2;
    else if (items[i].icon === "item-shoe") cat = 3;
    else if (items[i].icon === "item-items") cat = 4;
    else if (items[i].icon === "item-key") cat = 5;
    else if (items[i].icon === "item-trade") cat = 6;
    else cat = 7;

    var aaaa = {
        "ind": i,
        "i": items[i]
    }
    
    invsort[cat].push(aaaa);
}

// console.log(mapList)
for (let map of Object.keys(mapList)) {
    let mapoption = document.createElement('option')
    mapoption.innerHTML = `<option id='${map}' value='${map}'>${map}</option>`
    // console.log(mapdiv)
    gEle("selectmaplist").appendChild(mapoption)
}

const updateSelectValues = (e) => {
    // get map from the maplist, then extract all the markers and add them to select
    // console.log(e)
    let map = mapList[e.target.value]
    let entryMenu = gEle("selectentrance")
    entryMenu.innerHTML = ""
    if (map.markers.length > 0) {
        for (let i = 0; i < map.markers.length ; i++) {
            let markerdiv = document.createElement('option')
            markerdiv.value = map.markers[i]
            markerdiv.id = `marker${i}`
            markerdiv.text = map.markers[i]
            entryMenu.appendChild(markerdiv)
            // console.log(markerdiv)
        }
    }
    else {
        let markeroption = document.createElement('option')
        markeroption.value = "entrance"
        markeroption.id = "marker0"
        markeroption.text = "default"
        entryMenu.appendChild(markeroption)
    }
}
gEle("selectmaplist").addEventListener('change', updateSelectValues)

var itemCount = 0;
for (var i = 0; i < invsort.length; i++) {
    var itemstr = "";
    for (var j = 0; j < invsort[i].length; j++) {
        var type = "";
        var item = invsort[i][j].i;
        if (i === 0) type = "head";
        else if (i === 1) type = "weap";
        else if (i === 2) type = "torso";
        else if (i === 3) type = "feet";
        else if (i === 4) type = "cons";
        else if (i === 5) type = "key";
        else if (i === 6) type = "trade";
        else type = "other";
        itemstr += '<div class="textBoxAlignItem"><img src="icon/' + type + item.rarity + '.png"> ' + item.name.en_US + '<input id="item' + invsort[i][j].ind + '" type="text" class="textBoxAlignItem"></div>';
        itemCount++;
    }
    document.getElementById("itemlist" + i).innerHTML = itemstr;
}


function load() {
    updateFromFile();
    document.getElementById("onload").click();
    alert("Save loaded.");
}

function updateFromFile() {
    var s = gVal("loadtext");
    saveFile = JSON.parse(inc(s, "a"));
    gEle("savedecrypted").value = inc(s, "a");
    gEle("savespaced").value = JSON.stringify(JSON.parse(inc(s, "a")), null, 4);
    gEle("savepreset").value = s

    var player = saveFile.player;
    var party = saveFile.party;
    var ngPlus = saveFile.newGamePlus;
    gEle("level").value = player.level;
    gEle("exp").value = player.exp;
    gEle("hp").value = player.hp;
    gEle("credits").value = player.credit;
    gEle("sp").value = player.spLevel;
    gEle("skillneutral").value = player.skillPoints[0];
    gEle("skillheat").value = player.skillPoints[1];
    gEle("skillcold").value = player.skillPoints[2];
    gEle("skillshock").value = player.skillPoints[3];
    gEle("skillwave").value = player.skillPoints[4];
    gEle("head").value = getItemNameById(player.equip.head);
    gEle("leftarm").value = getItemNameById(player.equip.leftArm);
    gEle("rightarm").value = getItemNameById(player.equip.rightArm);
    gEle("torso").value = getItemNameById(player.equip.torso);
    gEle("feet").value = getItemNameById(player.equip.feet);

    // Party and Map
    gEle("currentparty").innerText = party.currentParty

    gEle("currentmap").innerText = saveFile.map
    gEle("selectentrance").value = saveFile.position.marker
    gEle("selectmaplist").value = saveFile.map

    // New Game Plus settings

    if (ngPlus) {
        gEle("ngplus-enable").checked = ngPlus.active   
        showNGOptions()
        let selectableOptions = gEle('ngoptions').children[0].children
        let checkboxOptions = gEle('ngoptions').children[1].children
        for (let i of selectableOptions) {
            let currentEntry = i.children[1]
            currentEntry.value = "none" 
            for (let entry in Object.keys(currentEntry)) {
                if (ngPlus.options[currentEntry.children[entry].value]) {
                    currentEntry.value = currentEntry.children[entry].value
                }
            }
        }
        for (let i of checkboxOptions) {
            let currentEntry = i.children[0]
            currentEntry.checked = false;
            if (ngPlus.options[currentEntry.name]) {
                currentEntry.checked = true;
            }
        }
    }


    /*var flags = saveFile.vars.storage.maps;
    gEle("bossCold1").checked = flags["coldDng/b3/room7"].bossKilled;
    gEle("bossCold2").checked = flags["coldDng/g/boss"].bossKill;
    gEle("bossHeat1").checked = flags["heatDng/f1/midboss"].midbossDefeated;
    gEle("bossHeat2").checked = flags["heatDng/f4/boss"].bossKill;
    gEle("bossWave").checked = flags["waveDng/b1/boss"].bossDefeated;
    gEle("bossShock").checked = flags["shockDng/f3/roomBoss"].bossDefeated;
    gEle("bossGrand1").checked = flags["treeDng/f2/room-01"].apeDefeated;
    gEle("bossGrand2").checked = flags["treeDng/f4/boss"].apeDefeated;*/

    for (var i = 0; i < items.length; i++) {
        if (i >= player.items.length) player.items[i] == null;
        gEle("item" + i).value = player.items[i];
    }
}

function updateFromPlayer() {
    var player = saveFile.player;
    var party = saveFile.party
    var newMap = saveFile.map
    var newMarker = saveFile.position.marker
    player.level = strToNum(gVal("level"));
    player.exp = strToNum(gVal("exp"));
    player.hp = strToNum(gVal("hp"));
    player.credit = strToNum(gVal("credits"));
    player.spLevel = strToNum(gVal("sp"));
    player.skillPoints[0] = strToNum(gVal("skillneutral"));
    player.skillPoints[1] = strToNum(gVal("skillheat"));
    player.skillPoints[2] = strToNum(gVal("skillcold"));
    player.skillPoints[3] = strToNum(gVal("skillshock"));
    player.skillPoints[4] = strToNum(gVal("skillwave"));
    player.equip.head = getItemIdByName(gVal("head"));
    player.equip.leftArm = getItemIdByName(gVal("leftarm"));
    player.equip.rightArm = getItemIdByName(gVal("rightarm"));
    player.equip.torso = getItemIdByName(gVal("torso"));
    player.equip.feet = getItemIdByName(gVal("feet"));

    party.currentParty = addToParty()
    gVal("partylevelcheck") && (party.models = setPartyLevel())
    // console.log("New party: ", party.currentParty)

    newMap = gVal("selectmaplist")
    newMarker = gVal("selectentrance") || "entrance"
    
    saveFile.party = party;
    saveFile.player = player;
    saveFile.map = newMap
    saveFile.position.marker = newMarker
    updateTextareas();
    alert("Player data updated.");
}

function updateFromInventory() {
    var inv = saveFile.player.items;
    for (var i = 0; i < items.length; i++) inv[i] = strToNum(gVal("item" + i));
    saveFile.player.items = inv;
    updateTextareas();
    alert("Inventory updated.");
}

function updateFromQuests() {
    console.log('soon :tm:')
    alert("eventually");
    // alert("Quests updated.");
}

// Party and Current Map

function addToParty() {
    let partyField = gEle('partymembers').elements
    let newParty = []
    for (let i of partyField) {
        i.checked && newParty.push(i.value)
        // console.log(i, newParty)
    }
    return newParty
}
function setPartyLevel() {
    var partyModels = saveFile.party.models
    var player = saveFile.player
    // console.log(partyModels)

    for (let i of Object.values(partyModels)) {
        i.level = player.level
        // console.log(i)
    }
    // console.log(party)
    return partyModels
}

function getCurrentMap() {
    var currentMap = saveFile.map
    var currentEntrance = saveFile.position.marker

    return { map: currentMap, marker: currentEntrance}
}

// New Game options

function updateFromNGPlus() {
    var ngPlus = getNGPlusData()
    if (saveFile && saveFile.newGamePlus && !gEle('ngplus-enable').checked) {
        saveFile.newGamePlus.active = false
        updateTextareas();
        alert("New Game Plus data updated");
    }
    if (gEle('ngplus-enable').checked) { 
        saveFile.newGamePlus = ngPlus
        updateTextareas();
        alert("New Game Plus data updated");
    }
}

function showNGOptions() {
    gEle('ngplus-enable').checked 
        ? gEle('ngoptions').style = `display: block;`
        : gEle('ngoptions').style = `display: none;`
}

const ngPlusEnabler = document.getElementById('ngplus-enable')
ngPlusEnabler.addEventListener('change', showNGOptions)

function getNGPlusData() {
    let ngData = { "options": {}, "active": true, "store": {} }
    let options = {}
    let store = saveFile.newGamePlus ? saveFile.newGamePlus.store : {}

    let selectableOptions = gEle('ngoptions').children[0].children
    let checkboxOptions = gEle('ngoptions').children[1].children
    for (let i of selectableOptions) {
        let currentValue = i.children[1].value
        if (currentValue && (currentValue != "none")) {
            options[currentValue] = true;
        }
    }
    for (let i of checkboxOptions) {
        let currentEntry = i.children[0]
        if (currentEntry.checked) {
            options[currentEntry.name] = true;
        }
    }

    ngData.options = options
    ngData.store = store
    return ngData
}



// Save Presets 

const saveCreateBtn = document.getElementById('create-save-btn')
const downloadPresetBtn = document.getElementById('download-preset-btn')
const outputBox = document.getElementById('save-preset-result')
saveCreateBtn.addEventListener('click', (e) => createPreset(e));
downloadPresetBtn.addEventListener('click', (e, presetOutput) => downloadSavePreset(e, presetOutput));

let presetOutput

const createPreset = (e) => { 
    e.preventDefault()
    let name = gVal("save-name-box") ? gVal("save-name-box") : "Name"
    let description = gVal("save-desc-box") ? gVal("save-desc-box") : "Description"
    if (gVal("loadtext")) {
        let data = gVal("loadtext") 
        presetOutput = `{"title": {"langUid": 1,"en_US": "${name}","de_DE": "${name}","zh_CN": "${name}","ko_KR": "${name}","ja_JP": "${name}"},
    "sub": {"langUid": 2,"en_US": "${description}","en_DE": "${description}","zh_CN": "${description}","de_DE": "${description}","ko_KR": "${description}","ja_JP": "${description}"},
    "savefile": "${data}"}`
    
        outputBox.innerText = presetOutput
    } 
    else {
        alert('Please import a save on the File menu');
        changeTab(document.getElementById('default'), 'tabcontent', 'file')
        return false;
    } 
}

const downloadSavePreset = (e) => {
    e.preventDefault()
    const link = document.createElement("a"); 
    let content;
    if (gVal('savepreset')) { 
        createPreset;
        content = outputBox.value 
    }
    // console.log(content)
    if (content == undefined || !gVal("savepreset")) { 
        alert('Please import a valid save on the File menu');
        return false;
    }
    const file = new Blob([content], { type: 'text/plain' });

    let digit = gVal("save-digit-box")
    let category = gVal("save-cat-box") ? gVal("save-cat-box") : "Any"
    let savename = gVal("save-name-box") ? gVal("save-name-box").replaceAll(" ", "-") : "Preset"

    link.href = URL.createObjectURL(file);
    let filename = (digit + "-" + category + "-" + savename + ".json")
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Advanced Options
gEle("advanced-checker").addEventListener('change', () => {
    let checkValue = gEle("advanced-checker").checked
    let advancedList = document.querySelectorAll('.advanced')
    for (let i = 0; i < advancedList.length; i++) {
        checkValue ? advancedList[i].style.display = "block" : advancedList[i].style.display = "none"
    }
    localStorage.setItem('CC-Save-Exit-Extras', checkValue)
})

// Keep settings from last session
window.addEventListener('load', () => {
    console.log("loading checkbox")
    let checkValue = localStorage.getItem('CC-Save-Exit-Extras')
    gEle("advanced-checker").checked = checkValue
    gEle('ngplus-enable').checked = false
    let advancedList = document.querySelectorAll('.advanced')
    for (let i = 0; i < advancedList.length; i++) {
        checkValue ? advancedList[i].style.display = "block" : advancedList[i].style.display = "none"
    }

    let selectableOptions = gEle('ngoptions').children[0].children
    let checkboxOptions = gEle('ngoptions').children[1].children
    for (let i of selectableOptions) {
        i.children[1].value = "none"
    }
    for (let i of checkboxOptions) {
        i.children[0].checked = false
    }
})

/*function updateFromFlags() {
    var flags = saveFile.vars.storage.maps;
    if (gEle("bossCold1").checked) flags["coldDng/b3/room7"] = {};
    if (gEle("bossCold2").checked) flags["coldDng/g/boss"] = {};
    if (gEle("bossCold2").checked) flags["coldDng/g/boss"] = {};
    if (gEle("bossHeat1").checked) flags["heatDng/f1/midboss"] = {};
    if (gEle("bossHeat2").checked) flags["heatDng/f4/boss"] = {};
    if (gEle("bossWave").checked) flags["waveDng/b1/boss"] = {};
    if (gEle("bossShock").checked) flags["shockDng/f3/roomBoss"] = {};
    if (gEle("bossGrand1").checked) flags["treeDng/f2/room-01"] = {};
    if (gEle("bossGrand2").checked) flags["treeDng/f4/boss"] = {};

    saveFile.vars.storage.maps = flags;
    saveFile.stats.combat["killjungle.whale-boss"] = 0;
    saveFile.stats.combat["killjungle.ape-boss"] = 1;
    saveFile.vars.storage.dungeons.tree.beaten = false;
    flags["treeDng/f4/boss"] = {};
    updateTextareas();
    alert("Flags updated.");
}*/

function updateFromDecrypted() {
    gEle("loadtext").value = outc(JSON.stringify(JSON.parse(gVal("savedecrypted"))), "a");
    updateFromFile();
    alert("Save file updated.");
}

function updateFromSpaced() {
    gEle("loadtext").value = outc(JSON.stringify(JSON.parse(gVal("savespaced"))), "a");
    updateFromFile();
    alert("Save file updated.");
}

function updateTextareas() {
    gEle("savedecrypted").value = JSON.stringify(saveFile);
    gEle("savespaced").value = JSON.stringify(saveFile, null, 4);
    gEle("loadtext").value = outc(JSON.stringify(saveFile), "a");
}

// UTILS

function getItemNameById(n) {
    return items[n].name.en_US;
}

function getItemIdByName(s) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].name.en_US == s) {
            return i;
        }
    }
    return -1;
}

function gVal(i) { return document.getElementById(i).value; }
function gEle(i) { return document.getElementById(i); }

function inc(a, b) {
    if (b = 75 * b + "0") b = ":_." + b;
    var c = window.CryptoJS,
        a = a.substr(9, a.length);
    return c.AES.decrypt(a, b).toString(c.enc.Utf8);
}


function outc(a, b) {
    var c;
    if (b = 75 * b + "0") b = ":_." + b;
    c = window.CryptoJS.AES.encrypt(a, b).toString();
    return "[-!_0_!-]" + c;
}

function strToNum(s) {
    if (s.length === 0 || isNaN(s)) return null;
    else return Number(s);
}

//tab stuff
function changeTab(evt, cl, tab) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName(cl);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    gEle(tab).style.display = "block";
    if (evt.currentTarget) {
        evt.currentTarget.className += " active";
    }
    else { 
        evt.className += " active";
    }
}