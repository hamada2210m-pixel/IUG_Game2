// saveData.js - الكود النهائي مع الرابط الخاص بك

// لقد تم وضع الرابط الصحيح هنا
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUXA6HCET-1MPVvlyLIK-HJYFXqE8wHh71nO5lBBxvR_6yeqwaDOUBzi4cu7Q0wuRriA/exec';

/**
 * يرسل بيانات اللاعب إلى Google Sheet
 * @param {string} name - اسم اللاعب الكامل
 * @param {string} phone - رقم جوال اللاعب
 * @param {string} year - سنة التوجيهي
 * @param {number} score - نتيجته في اللعبة
 */
function saveDataToSheet(name, phone, year, score) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('year', year);
    formData.append('score', score);

    console.log("جاري إرسال البيانات إلى Google Sheet...");

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            console.log('تم حفظ البيانات بنجاح!');
        } else {
            console.error('حدث خطأ من Google Apps Script:', data.error);
        }
    })
    .catch(error => {
        console.error('فشل الاتصال أو إرسال البيانات:', error);
    });
}