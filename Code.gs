// Barrie Toastmasters ~ Executive Meeting Minutes Helper
// sloppyright Paul Gamble, 2020
// ----------------------------------------------------------------------------------------
// Model ref:https://kurtkaiser.us/how-to-code-a-html-user-interface-in-google-apps-script/
//   UI Sheets Email Notifications
//   Kurt Kaiser
//   kurtkaiser.us
//   All Rights Reserved, 2019
// ----------------------------------------------------------------------------------------

// Declare global variables
//var ss = SpreadsheetApp.getActiveSpreadsheet();
//var sheet = ss.getActiveSheet();
//var lastRow = sheet.getLastRow();
//var lastColumn = sheet.getLastColumn();

//ref: https://stackoverflow.com/questions/51689943/sp-userproperties-had-been-deprecated
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
      present.push(properties['settingRole'+i]);  
    } else{
      regrets.push(properties['settingRole'+i]);  
    }  
  }
  
  
  //logic for replace placeholders with properties
  for (const [key, value] of Object.entries(meeting)) {
    //Logger.log(`${key}: ${value}`); 
    var found = doc.findText(`{${key}}`);
    Logger.log(found);
  }
  
  
  /*
 var meetingPlaceholders = {
   
   
   
   
  
   
 }
   */  
  
  
/*              //  TESTING
                //--------------
                var meeting = {
                  //this is where to pull properties
                  location: '- Online Zoom Meeting',
                  startTime: '5:30 PM'
                }
                
                var doc = DocumentApp.getActiveDocument().getBody();
                
                //this will be a loop through the meeting object; replacing text ForegroundColor to black; and properties pulled.
                var found = doc.findText("{Meeting_Location}");
                var elem = found.getElement();
                elem.setForegroundColor("#000000");
                doc.replaceText('{Meeting_Location}', meeting.meetingLocation);     
                var found2 = doc.findText("{Meeting_startTime}");
                var elem2 = found2.getElement();
                elem2.setForegroundColor("#000000");
                doc.replaceText('{Meeting_startTime}', meeting.startTime); 
  */
  
  
  
};

function onOpen(e){ 
  DocumentApp.getUi()
  .createMenu("TM Executive Meeting Helper")
  .addItem('Meeting details', 'showDetails')
  .addItem('Items/Tasks', 'showTasks')
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
  //sp.setProperty('meetingLocation', form.meetingLocation);
  for (i = 1; i < 8; i++){
    sp.setProperty('settingRole'+i, form['settingRole'+i]);     
  }

  for (i = 1; i < 6; i++){
     sp.setProperty('settingLocation'+i, form['settingLocation'+i]);    
  }  
  
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

