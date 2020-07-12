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
  doc.replaceText('{Meeting_Location}', meeting.location);   
  
  var found2 = doc.findText("{Meeting_startTime}");
  var elem2 = found2.getElement();
  elem2.setForegroundColor("#000000");
  doc.replaceText('{Meeting_startTime}', meeting.startTime); 
  
};

function onOpen(e){ 
  DocumentApp.getUi()
  .createMenu("TM Executive Meeting Helper")
  .addItem('Meeting details', 'showDetails')
  .addItem('Tasks', 'showTasks')
  .addSeparator()
  .addItem('Settings', 'showSettings')
  .addItem('Help', 'showHelp')
      .addToUi();
}

// ------------------------ Save Sidebar Options ------------------------
function userInput(form) {
  Logger.log('userinput');
  //sp.deleteAllProperties();
  sp.setProperty('meetingLocation', form.meetingLocation);
  sp.setProperty('meetingDate', form.meetingDate);
  sp.setProperty('startTime', form.startTime);
  sp.setProperty('endTime', form.endTime);
  sp.setProperty('meetingChair', form.meetingChair);
  sp.setProperty('meetingRecorder', form.meetingRecorder);
  sp.setProperty('president', form.president);
  sp.setProperty('education', form.education);
  sp.setProperty('membership', form.membership);
  sp.setProperty('pr', form.pr);
  sp.setProperty('treasurer', form.treasurer);
  sp.setProperty('saa', form.saa);
  sp.setProperty('secretary', form.secretary);
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



