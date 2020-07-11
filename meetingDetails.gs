
function replaceText(){
  
  //code for button to replace text based on details
  
}

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





//function myFunction() {
  //var timestamp = new Date()
  
  //playing around with timezone; hardcoded right now
  //var formattedDate = Utilities.formatDate(new Date(), "GMT-4", "yyyy-MM-dd' 'HH:mm:ss' '");
  //var doc = DocumentApp.getActiveDocument().getBody(); 
  //doc.replaceText('[Location_meeting]','- Online Zoom Meeting'); 

  
  //[Location_meeting]

  
  
  //.create('Latest Exec Meeting'+' '+ formattedDate);
  //var body = doc.getBody().setPageHeight(612.283).setPageWidth(790.866);
  //var rowsData = [['Item', 'Points Covered in Discussion','Action', 'Date of Completion', 'Lead Staff']]; 
  //body.insertParagraph(0, doc.getName())
  //    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  //table = body.appendTable(rowsData);
  //table.getRow(0).editAsText().setBold(true);
  
  
//}
  

