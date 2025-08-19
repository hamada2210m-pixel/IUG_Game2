// الانتظار حتى يتم تحميل كل عناصر الصفحة
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تعريف العناصر الأساسية ---
    const landingScreen = document.getElementById('landing-screen');
    const startScreen = document.getElementById('start-screen');
    const gameStage = document.getElementById('game-stage');

    const showStartScreenBtn = document.getElementById('show-start-screen-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const usernameInput = document.getElementById('username');

    // --- 2. إدارة الانتقال بين الشاشات ---
    
    // عند الضغط على "ابدأ الرحلة"
    showStartScreenBtn.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    // تفعيل زر "هيا بنا" فقط عند كتابة الاسم
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim() !== '') {
            startGameBtn.disabled = false;
        } else {
            startGameBtn.disabled = true;
        }
    });

    // عند الضغط على "هيا بنا"
    startGameBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        // يمكنك حفظ اسم المستخدم لاستخدامه لاحقاً
        // localStorage.setItem('username', username);
        
        startScreen.classList.add('hidden');
        gameStage.classList.remove('hidden');
        
        // ابدأ المرحلة الأولى من اللعبة
        loadGameStage('map'); 
    });

    // --- 3. منطق اللعبة ومراحلها ---

    // هذا مجرد هيكل للعبة، يمكنك ملؤه بالبيانات الحقيقية
    const gameData = {
        'map': {
            title: 'خريطة الجامعة',
            image: 'images/map.webp',
            options: [
                { text: 'شؤون الطلبة', icon: '🏛️', nextStage: 'admission' },
                { text: 'الكليات', icon: '📚', nextStage: 'faculties' },
                { text: 'المنح الدراسية', icon: '🎓', nextStage: 'grants' },
                { text: 'التبادل الطلابي', icon: '✈️', nextStage: 'exchange' }
            ],
            type: 'map'
        },
        'faculties': {
            title: 'اختر اهتمامك',
            image: 'images/faculties.webp',
            options: [
                 { text: 'الكليات العلمية', icon: '🔬', nextStage: 'scientific_faculties' },
                 { text: 'الكليات الإنسانية', icon: '⚖️', nextStage: 'humanities_faculties' },
            ],
            type: 'choice' // نوع مختلف لتغيير التنسيق
        }
        // ... أضف باقي مراحل اللعبة هنا
    };

    function loadGameStage(stageKey) {
        const stage = gameData[stageKey];
        if (!stage) {
            console.error('المرحلة غير موجودة:', stageKey);
            return;
        }

        // تحديث عناصر الواجهة
        document.getElementById('scene-title').textContent = stage.title;
        document.getElementById('scene-image').src = stage.image;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // إفراغ الخيارات القديمة

        // تحميل الخيارات الجديدة
        stage.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            
            // تخصيص شكل الزر بناءً على نوع المرحلة
            if (stage.type === 'map') {
                button.innerHTML = `<span class="map-icon">${option.icon}</span> ${option.text}`;
            } else {
                button.innerHTML = `<span>${option.icon}</span> ${option.text}`;
            }

            button.addEventListener('click', () => {
                // عند اختيار خيار، انتقل للمرحلة التالية
                loadGameStage(option.nextStage);
            });

            optionsContainer.appendChild(button);
        });
        
        // يمكنك إضافة تحديث شريط التقدم هنا
    }
});
