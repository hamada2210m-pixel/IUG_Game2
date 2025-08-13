// =================================================================
// ملف Code.gs - النسخة النهائية الصحيحة
// =================================================================

// تحديد أرقام الأعمدة لتسهيل الصيانة
const COLS = {
  TIMESTAMP: 1,
  FULLNAME: 2,
  PHONE: 3,
  YEAR: 4,
  SCORE: 5,
  UNIQUE_ID: 6
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // قفل آمن للتعامل مع المستخدمين المتعددين

  try {
    var action = e.parameter.action;
    // تم استخدام الـ ID الخاص بملفك الذي زودتني به
    // 🔴 تأكد أن اسم الورقة في ملفك هو "ورقة1"
    var sheet = SpreadsheetApp.openById('1hOM3leAFWKb8UAbEnftfD70AREPuEYAGOTBKfouZmxg').getSheetByName("ورقة1"); 

    if (action == "register") {
      return registerUser(e, sheet);
    } else if (action == "updateScore") {
      return updateScore(e, sheet);
    } else {
      throw new Error("Action not specified or invalid.");
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// دالة لتسجيل مستخدم جديد
function registerUser(e, sheet) {
  var name = e.parameter.name;
  var phone = e.parameter.phone;
  var year = e.parameter.year;
  var uniqueId = Utilities.getUuid();
  var timestamp = new Date();

  sheet.appendRow([timestamp, name, phone, year, 0, uniqueId]);

  return ContentService.createTextOutput(JSON.stringify({ result: 'success', uniqueId: uniqueId })).setMimeType(ContentService.MimeType.JSON);
}

// دالة لتحديث النتيجة
function updateScore(e, sheet) {
  var uniqueId = e.parameter.uniqueId;
  var score = e.parameter.score;

  if (!uniqueId) { throw new Error("Unique ID is required to update score."); }

  var idColumnValues = sheet.getRange(2, COLS.UNIQUE_ID, sheet.getLastRow(), 1).getValues();
  var targetRow = -1;

  for (var i = 0; i < idColumnValues.length; i++) {
    if (idColumnValues[i][0] == uniqueId) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow != -1) {
    sheet.getRange(targetRow, COLS.SCORE).setValue(score);
    return ContentService.createTextOutput(JSON.stringify({ result: 'success', message: 'Score updated.' })).setMimeType(ContentService.MimeType.JSON);
  } else {
    throw new Error("User with the specified Unique ID was not found.");
  }
}
