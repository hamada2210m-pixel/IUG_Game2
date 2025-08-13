// saveData.js - الكود النهائي والمحدث بتاريخ 13 أغسطس 2025

// لقد تم وضع الرابط الجديد والصحيح هنا
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2RjbdyISPTbhfR8h-lE41eY0lEWEOxZevGyTMxNbpY2zTmRzWa3DEAd5Dc6O72GgtMA/exec';

// دالة للتسجيل الفوري
function registerPlayer(name, phone, year) {
  const formData = new FormData();
  formData.append('action', 'register');
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('year', year);

  // إرجاع الوعد (Promise) للعبة لكي تنتظر الرد
  return fetch(SCRIPT_URL, {
    method: 'POST',
    body: formData,
  }).then(response => response.json());
}

// دالة لتحديث النتيجة في النهاية
function updatePlayerScore(uniqueId, score) {
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
        console.log('Score updated successfully!');
      } else {
        console.error('Error updating score:', data.message);
      }
    })
    .catch(error => console.error('Error in update fetch:', error));
}
