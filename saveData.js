// =================================================================
// ملف saveData.js - النسخة النهائية (تاريخ: 13 أغسطس 2025)
// =================================================================

// لقد تم وضع الرابط الجديد والصحيح الذي أرسلته لي
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2RjbdyISPTbhfR8h-lE41eY0lEWEOxZevGyTMxNbpY2zTmRzWa3DEAd5Dc6O72GgtMA/exec';

// دالة للتسجيل الفوري
function registerPlayer(name, phone, year) {
  const formData = new FormData();
  formData.append('action', 'register');
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('year', year);

  return fetch(SCRIPT_URL, {
    method: 'POST',
    body: formData,
  }).then(response => response.json());
}

// دالة لتحديث النتيجة بشكل فوري
function updatePlayerScore(uniqueId, score) {
  if (!uniqueId) {
      console.error("Attempted to update score without a uniqueId.");
      return; // لا ترسل الطلب إذا لم يكن هناك رقم تعريفي
  }
 
  const formData = new FormData();
  formData.append('action', 'updateScore');
  formData.append('uniqueId', uniqueId);
  formData.append('score', score);

  fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        console.log(`Score updated to: ${score}`);
      } else {
        console.error('Error updating score:', data.message);
      }
    })
    .catch(error => console.error('Error in update fetch:', error));
}
