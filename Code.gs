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

//GLOBAL VARIABLES
var sp = PropertiesService.getScriptProperties();

// ------------------------ Replace Placeholders  -----------------------
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
    
    //format date entry for readability
    if(key == 'Meeting_Date'){
      doc.replaceText(`{${key}}`, formatDate(properties[value]));          
    }
    if(key.includes('Time')){
      doc.replaceText(`{${key}}`, formatTime(properties[value]));          
    }  
    doc.replaceText(`{${key}}`, properties[value]);   
  }
    
};

// ------------------------ Submit Item to Table  -----------------------
function submitItem(form) {
  Logger.log('submitItem');  
  var properties = getAllProperties();
  let doc = DocumentApp.getActiveDocument().getBody();
  var inputNames = ['Done','ASAP'];  
  let itemDateOption;
  
  Logger.log('properties.itemDate: ' + properties.itemDate);
  
  if(properties.itemDate == 'Done' || 'ASAP'){
    Logger.log("There's a match.");
    itemDateOption = properties.itemDate;
  }else{
    Logger.log("Date Format");
    itemDateOption = formatDate(properties.itemDate);    
  }  
  
  var cells = [
    properties.itemTitle,
    properties.itemPoints,
    properties.itemAction,
    itemDateOption,   
    properties.itemLeadStaff
     
  ];  

  let tables = doc.getTables()
  
  //Second table holds meeting items; first one the meeting details
  let table1 = tables[1]
  //doc.replaceText('{Item_Entry}', ''); 
  let lastRow = table1.getNumRows();
  let addRow1 = table1.insertTableRow(lastRow, );
  

  //setup for non bold styling                                    
  var style = {};
  style[DocumentApp.Attribute.BOLD] = false;                                                                       
  cells.forEach(function(e, i){
    addRow1.insertTableCell(i, e);
    //set normal (i.e. not bold) for the first cell (TESTING)
    
  });  
  
  //setup for border around row
  var tableStyle = {};
  tableStyle[DocumentApp.Attribute.BORDER_WIDTH] = 1; 
  tableStyle[DocumentApp.Attribute.BORDER_COLOR] = '#000000';
  //tableStyle[DocumentApp.Attribute.BOLD] = false;
  table1.setAttributes(tableStyle);
  
}

// ------------------------ Submit and Save ----------------------
function submitAndSaveItem(form) {
  //input form then submit to table
  itemInput(form);
  submitItem(form);
}

// ------------------------ Create Menu --------------------------
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

// ------------------------ Save Item Details --------------------
function itemInput(form) {
  Logger.log('itemInput');
  Logger.log(form);
  
  if(form.itemDate !== null && form.itemDate !== ''){
    itemDate = form.itemDate;    
  }  
  
  //set properties for all the item details
  sp.setProperty('itemTitle', form.itemTitle);
  sp.setProperty('itemPoints', form.itemPoints);
  sp.setProperty('itemAction', form.itemAction); 
   
  //logic for if the 'Done' or 'ASAP' checkboxes are selected instead of date input
  
  if(form.DoneHidden == 'true' | form.ASAPHidden == 'true'){
    if(form.DoneHidden == 'true'){
      sp.setProperty('itemDate', 'Done');   
    } else if(form.ASAPHidden == 'true'){
      sp.setProperty('itemDate', 'ASAP');
    }  
  } else{
    sp.setProperty('itemDate', form.itemDate);   
  }
 
   
  //logic for selecting more than one lead staff
  var leadArray = [];
  leadArray = form.itemLeadStaff;
  if (Array.isArray(leadArray)){    
    var joinLeadArray = leadArray.join(', ');  
    sp.setProperty('itemLeadStaff', joinLeadArray);  
  } else {
      sp.setProperty('itemLeadStaff', form.itemLeadStaff != null ? form.itemLeadStaff : '' );  
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

// --------------- Show Meeting Details Sidebar  ------------------------
function showDetails() {
  var html = HtmlService.createHtmlOutputFromFile('detailsSidebar')
      .setTitle('Meeting Details')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

// --------------- Show Item/Tasks Sidebar  -----------------------------
function showTasks() {
  var html = HtmlService.createHtmlOutputFromFile('tasksSidebar')
      .setTitle('Tasks')
      .setWidth(300);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

// --------------- Open Item/Tasks Popup Dialog  ------------------------
function showTaskDialog() {
  var html = HtmlService.createHtmlOutputFromFile('taskDialog')
      .setWidth(600)
      .setHeight(575);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Item/Tasks');
}


// --------------- Open Item/Tasks Popup Dialog  ------------------------
function showEmailDialog() {
  var html = HtmlService.createHtmlOutputFromFile('emailDialog')
      .setWidth(500)
      .setHeight(300);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Email PDF Copy');
}

// --------------- Show Settings Sidebar  -------------------------------
function showSettings() {
  var html = HtmlService.createHtmlOutputFromFile('settingsSidebar')
      .setTitle('Settings')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

// --------------- Show Help Sidebar  -----------------------------------
function showHelp() {
  var html = HtmlService.createHtmlOutputFromFile('helpSidebar')
      .setTitle('Help')
      .setWidth(550);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

// --------------- Wait Function  ---------------------------------------
// Limits the Saved message in the sidebar to 6 seconds
function waitSeconds() {
  Utilities.sleep(6000);
}

// --------------- Delete all saved data  -------------------------------
// Deletes all properties
function deleteData() {
  sp.deleteAllProperties();
}

// --------------- Format entries  --------------------------------------

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