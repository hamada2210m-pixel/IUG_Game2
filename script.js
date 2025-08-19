// الانتظار حتى يتم تحميل كل عناصر الصفحة
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تعريف العناصر الأساسية من ملف الـ HTML ---
    const landingScreen = document.getElementById('landing-screen');
    const startScreen = document.getElementById('start-screen');
    const gameStage = document.getElementById('game-stage');

    const showStartScreenBtn = document.getElementById('show-start-screen-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const usernameInput = document.getElementById('username');

    // --- 2. إدارة الانتقال بين الشاشات الرئيسية ---
    
    // عند الضغط على زر "ابدأ الرحلة" في الشاشة الأولى
    showStartScreenBtn.addEventListener('click', () => {
        landingScreen.classList.add('hidden'); // إخفاء شاشة البداية
        startScreen.classList.remove('hidden'); // إظهار شاشة إدخال الاسم
    });

    // تفعيل زر "هيا بنا" فقط عند كتابة أي نص في حقل الاسم
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim() !== '') {
            startGameBtn.disabled = false;
        } else {
            startGameBtn.disabled = true;
        }
    });

    // عند الضغط على زر "هيا بنا" لبدء اللعبة
    startGameBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        
        // يمكنك حفظ اسم المستخدم في الذاكرة المحلية لاستخدامه لاحقاً
        // localStorage.setItem('username', username);
        
        startScreen.classList.add('hidden'); // إخفاء شاشة إدخال الاسم
        gameStage.classList.remove('hidden'); // إظهار شاشة اللعبة
        
        // ابدأ المرحلة الأولى من اللعبة (مرحلة الخريطة)
        loadGameStage('map'); 
    });

    // --- 3. منطق اللعبة ومراحلها ---

    // هذا هو مخزن بيانات اللعبة، كل مرحلة لها بياناتها الخاصة
    // يمكنك توسيعه بسهولة بإضافة مراحل جديدة
    const gameData = {
        'map': {
            title: 'خريطة الجامعة',
            image: 'images/map.webp', // تأكد من وجود الصورة في مجلد images
            options: [
                { text: 'شؤون الطلبة', icon: '🏛️', nextStage: 'admission' },
                { text: 'الكليات', icon: '📚', nextStage: 'faculties' },
                { text: 'المنح الدراسية', icon: '🎓', nextStage: 'grants' },
                { text: 'التبادل الطلابي', icon: '✈️', nextStage: 'exchange' }
            ],
            type: 'map' // نوع خاص لتنسيق الأزرار بشكل مختلف
        },
        'faculties': {
            title: 'اختر اهتمامك الرئيسي',
            image: 'images/faculties.webp',
            options: [
                 { text: 'الكليات العلمية', icon: '🔬', nextStage: 'scientific_faculties' },
                 { text: 'الكليات الإنسانية', icon: '⚖️', nextStage: 'humanities_faculties' },
            ],
            type: 'choice' // نوع مختلف لتغيير التنسيق
        },
        'admission': {
            title: 'شؤون القبول والتسجيل',
            image: 'images/admission.webp',
            options: [
                 { text: 'العودة للخريطة', icon: '🗺️', nextStage: 'map' },
            ],
            type: 'info'
        },
        'grants': {
            title: 'المنح الدراسية',
            image: 'images/grants.webp',
            options: [
                 { text: 'العودة للخريطة', icon: '🗺️', nextStage: 'map' },
            ],
            type: 'info'
        },
        'exchange': {
            title: 'التبادل الطلابي الدولي',
            image: 'images/exchange.webp',
            options: [
                 { text: 'العودة للخريطة', icon: '🗺️', nextStage: 'map' },
            ],
            type: 'info'
        }
        // ... يمكنك إضافة باقي مراحل اللعبة هنا بنفس الطريقة
    };

    /**
     * وظيفة تقوم بتحميل بيانات مرحلة جديدة وعرضها على الشاشة
     * @param {string} stageKey - اسم المرحلة المطلوب تحميلها من gameData
     */
    function loadGameStage(stageKey) {
        const stage = gameData[stageKey];
        if (!stage) {
            console.error('المرحلة غير موجودة:', stageKey);
            return;
        }

        // تحديث عناصر الواجهة (العنوان، الصورة، إلخ)
        document.getElementById('scene-title').textContent = stage.title;
        document.getElementById('scene-image').src = stage.image;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // إفراغ الخيارات القديمة قبل إضافة الجديدة

        // بناء أزرار الخيارات الجديدة للمرحلة الحالية
        stage.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            
            // تخصيص شكل الزر بناءً على نوع المرحلة المحدد في gameData
            if (stage.type === 'map') {
                button.innerHTML = `<span class="map-icon">${option.icon}</span> ${option.text}`;
                optionsContainer.className = 'options-container'; // إعادة التنسيق الأساسي
            } else if (stage.type === 'choice' || stage.type === 'info') {
                button.innerHTML = `<span>${option.icon}</span> ${option.text}`;
                 // تطبيق تنسيق العمود الواحد
                optionsContainer.className = 'options-container single-column'; 
            }

            // إضافة حدث النقر على الزر للانتقال للمرحلة التالية
            button.addEventListener('click', () => {
                // عند اختيار خيار، قم بتحميل المرحلة التالية المرتبطة به
                loadGameStage(option.nextStage);
            });

            optionsContainer.appendChild(button);
        });
        
        // يمكنك إضافة تحديث شريط التقدم هنا بناءً على المرحلة
        // updateProgressBar();
    }
});
