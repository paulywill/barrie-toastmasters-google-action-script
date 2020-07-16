// Barrie Toastmasters ~ Executive Meeting Minutes Helper
// sloppyright Paul Will Gamble, 2020
// paulywill.com | https://github.com/paulywill/barrie-toastmasters-google-action-script
// ----------------------------------------------------------------------------------------
// Modeled in part after this fantastic tutorial by Kurt Kaiser
//   ref:https://kurtkaiser.us/how-to-code-a-html-user-interface-in-google-apps-script/
//   UI Sheets Email Notifications
//   Kurt Kaiser
//   kurtkaiser.us
//   All Rights Reserved, 2019
// ----------------------------------------------------------------------------------------

var sp = PropertiesService.getScriptProperties();

function replaceText(){  
/* 
   PLACEHOLDERS           PROPERTIES AND TEST DATA  
   ============           ========================
   {Names_Present},
   {Names_Regrets}  
                          role1Hidden=true  settingRole1=Fleurette Knaggs      ( President )
                          role2Hidden=false settingRole2=Dan Bell              ( VP of Edu. )
                          role3Hidden=true  settingRole3=Jennifer Keresztesi   ( VP of Mem. )
                          role4Hidden=false settingRole4=Shelly Grant          ( VP of PR )
                          role5Hidden=true  settingRole5=Brian MacGregor       ( Treasurer )
                          role6Hidden=false settingRole6=Rufus Willett         ( SAA ) 
                          role7Hidden=true  settingRole7=Paul Gamble           ( Secretary )
                         
   {Meeting_Date}         meetingDate=2020-08-04 
   {Meeting_Location}     meetingLocation=Zoom 
   {Meeting_startTime}    startTime=17:45 
   {Meeting_endTime}      endTime=18:46 

   {Name_Chair}           meetingChair=Fleurette Knaggs
   {Name_Secretary}       meetingRecorder=Paul Gamble
    
   {Next_Date}            nextDate=2020-09-01 
   {Next_Location}        nextLocation=Zoom 
   {Next_Time}            nextStart=17:45   

*/
  
  Logger.log('replaceText');
  let doc = DocumentApp.getActiveDocument().getBody();
  let properties =  getAllProperties();
  let present = [];
  let regrets = [];
  let meeting = {
    Meeting_Date: "meetingDate",
    Meeting_Location: "meetingLocation",
    Meeting_startTime: "startTime",
    Meeting_endTime: "endTime",
    Name_Chair: "meetingChair",
    Name_Secretary: "meetingRecorder",
    Next_Date: "nextDate",
    Next_Location: "nextLocation",
    Next_Time: "nextStart"   
  } 
  
  //logic for 'present' and 'regrets' 
  for (i = 1; i < 8; i++){  
    if(properties['role'+i+'Hidden'] == 'true'){
      present.push(' ' + properties['settingRole'+i]);  
    } else {
      regrets.push(' ' + properties['settingRole'+i]);  
    }  
  }
  
  //replace {Names_Present} placeholder with array
  var foundPresent = doc.findText('{Names_Present}');
  var elemPresent = foundPresent.getElement();
  elemPresent.setForegroundColor("#000000");
  doc.replaceText('{Names_Present}', present); 
  
  //replace '{Names_Regrets}' placeholder with array
  var foundRegrets = doc.findText('{Names_Regrets}');
  var elemRegrets = foundRegrets.getElement();
  elemRegrets.setForegroundColor("#000000");
  doc.replaceText('{Names_Regrets}', regrets); 
   
  //logic for replace placeholders with properties
  for (const [key, value] of Object.entries(meeting)) {
    //Logger.log(`${key}: ${value}`); 
    
    var found = doc.findText(`{${key}}`);
    var elem = found.getElement();
    elem.setForegroundColor("#000000");
    //format date
    if(key == 'Meeting_Date'){
      Logger.log('date: ' + properties[value]);
      doc.replaceText(`{${key}}`, formatDate(properties[value]));          
    }
    if(key.includes('Time')){
      Logger.log('time: ' + properties[value]);
      doc.replaceText(`{${key}}`, formatTime(properties[value]));          
    }  
    doc.replaceText(`{${key}}`, properties[value]);   
  }
    
};

function onOpen(e){ 
  DocumentApp.getUi()
  .createMenu("TM Executive Meeting Helper")
  .addItem('Meeting details', 'showDetails')
  .addItem('Item/Tasks', 'showTasks')
  .addSeparator()
  .addItem('Settings', 'showSettings')
  .addItem('Delete data', 'deleteData')
  .addItem('Help', 'showHelp')
      .addToUi();
}

// ------------------------ Save Details  ------------------------
function meetingInput(form) {
  Logger.log('meetingInput');
  Logger.log(form);
  sp.setProperty('meetingLocation', form.meetingLocation);
  sp.setProperty('meetingDate', form.meetingDate);
  sp.setProperty('startTime', form.startTime);
  sp.setProperty('endTime', form.endTime);
  sp.setProperty('meetingChair', form.meetingChair);
  sp.setProperty('meetingRecorder', form.meetingRecorder);
  sp.setProperty('nextLocation', form.nextLocation);
  sp.setProperty('nextDate', form.nextDate);
  sp.setProperty('nextStart', form.nextStart);
  for (i = 1; i <8; i++){
    sp.setProperty('role'+i+'Hidden', form['role'+i+'Hidden']);    
  }  
}

// ------------------------ Save Settings  -----------------------
function settingsInput(form) {
  Logger.log('settingsInput');
  Logger.log(form);
  //loop through and save all names for roles
  for (i = 1; i < 8; i++){
    sp.setProperty('settingRole'+i, form['settingRole'+i]);     
  }
  //loop through and save all the names of locations
  for (i = 1; i < 6; i++){
     sp.setProperty('settingLocation'+i, form['settingLocation'+i]);    
  }  
}


// ------------------------ Save Item  -----------------------
function itemInput(form) {
  Logger.log('itemInput');
  Logger.log(form);
  
}



// --------------- Returns Array of All Properties  ---------------------
function getAllProperties() {
  var propertiesAndKeys = {}
  var data = sp.getProperties();
  for (var key in data) {
    propertiesAndKeys[key] = sp.getProperty(key);
    // Logger.log('Key: %s - %s', key, data[key]);
  }
  return propertiesAndKeys;
}

function showDetails() {
  var html = HtmlService.createHtmlOutputFromFile('detailsSidebar')
      .setTitle('Meeting Details')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

function showTasks() {
  var html = HtmlService.createHtmlOutputFromFile('tasksSidebar')
      .setTitle('Tasks')
      .setWidth(300);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

function showDialog() {
  var html = HtmlService.createHtmlOutputFromFile('taskDialog')
      .setWidth(600)
      .setHeight(575);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Item/Tasks');
}

function showSettings() {
  var html = HtmlService.createHtmlOutputFromFile('settingsSidebar')
      .setTitle('Settings')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

function showHelp() {
  var html = HtmlService.createHtmlOutputFromFile('helpSidebar')
      .setTitle('Help')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

// Limits the Saved message in the sidebar to 6 seconds
function waitSeconds() {
  Utilities.sleep(6000);
}

// Deletes all properties
function deleteData() {
  sp.deleteAllProperties();
}

//format date for readability; ref ~ https://stackoverflow.com/a/31732581
function formatDate(ISOdate) {
  var date = new Date(ISOdate.replace(/-/g, '\/'));
  return date.toDateString();  
}

//format time for readability; ref ~ https://stackoverflow.com/a/13898483
function formatTime(militaryTime) {
  var timeString = militaryTime;
  var H = +timeString.substr(0, 2);
  var h = (H % 12) || 12;
  var ampm = H < 12 ? "AM" : "PM";
  timeString = h + timeString.substr(2, 3) + ' '+ ampm;
  return timeString;
}