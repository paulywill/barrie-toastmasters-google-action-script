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
  Logger.log('replaceText');
  var properties =  getAllProperties();
  Logger.log('properties.meetingDate: '+ properties.meetingDate);
  var present = [];
  var regrets = [];
  for (i = 1; i < 8; i++){
    
    if(properties['role'+i+'Hidden'] == 'true'){
      present.push(properties['settingRole'+i]);  
    } else{
      regrets.push(properties['settingRole'+i]);  
    }  
  }
  Logger.log('present: ' + present );
  Logger.log('regrets: ' + regrets );
  /* 
  
  {  
     role1Hidden=true,  settingRole1=Fleurette Knaggs, 
     role2Hidden=false, settingRole2=Dan Bell, 
     role3Hidden=true,  settingRole3=Jennifer Keresztesi, 
     role4Hidden=false, settingRole4=Shelly Grant, 
     role5Hidden=true,  settingRole5=Brian MacGregor, 
     role6Hidden=false, settingRole6=Rufus Willett, 
     role7Hidden=true,  settingRole7=Paul Gamble, 
            
     startTime=17:45, 
     endTime=18:46, 
     meetingLocation=Zoom, 
     meetingDate=2020-08-04, 
     
     nextDate=2020-09-01, 
     nextLocation=Zoom, 
     nextStart=17:45, 
     
     meetingRecorder=Paul Gamble, 
     meetingChair=Fleurette Knaggs}
  
  */
  
  /*
 var meetingPlaceholders = {
   {Meeting_Date}
   {Meeting_Location}
   {Meeting_startTime} 
   {Meeting_endTime}
   {Name_Chair}
   {Name_Secretary}
   {Names_Present}
   {Name_Regrets}
   {Next_Date} 
   {Next_Location}
   {Next_Time}
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

