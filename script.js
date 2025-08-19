// الانتظار حتى يتم تحميل كل عناصر الصفحة
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تعريف العناصر الأساسية من ملف الـ HTML ---
    const landingScreen = document.getElementById('landing-screen');
    const startScreen = document.getElementById('start-screen');
    const gameStage = document.getElementById('game-stage');

    const sceneImage = document.getElementById('scene-image');
    const sceneTitle = document.getElementById('scene-title');
    const optionsContainer = document.getElementById('options-container');
    const sceneContent = document.getElementById('scene-content');
    const feedbackMessage = document.getElementById('feedback-message');
    const infoFooter = document.querySelector('.info-footer');
    const nextStageBtn = document.getElementById('next-stage-btn');

    const showStartScreenBtn = document.getElementById('show-start-screen-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const usernameInput = document.getElementById('username');

    // --- 2. إدارة الانتقال بين الشاشات الرئيسية ---
    showStartScreenBtn.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    usernameInput.addEventListener('input', () => {
        startGameBtn.disabled = usernameInput.value.trim() === '';
    });

    startGameBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameStage.classList.remove('hidden');
        loadGameStage('map');
    });

    // --- 3. مخزن بيانات اللعبة الكامل ---
    // هنا نعرّف كل مرحلة ومحتواها وسلوكها
    const gameData = {
        'map': {
            title: 'خريطة الجامعة',
            image: 'images/map.webp',
            type: 'navigation-map',
            options: [
                { text: 'شؤون الطلبة', icon: '🏛️', nextStage: 'admissionInfo' },
                { text: 'الكليات', icon: '📚', nextStage: 'facultiesList' },
                { text: 'المنح الدراسية', icon: '🎓', nextStage: 'grantsInfo' },
                { text: 'التبادل الطلابي', icon: '✈️', nextStage: 'exchangeInfo' }
            ]
        },
        'grantsInfo': {
            title: 'المنح الدراسية المتاحة',
            image: 'images/grants.webp',
            type: 'info-list',
            categories: [
                {
                    title: 'منح للمستجدين',
                    items: [
                        { name: 'منحة التفوق', percentage: '100%', details: ['للحاصلين على 95% فما فوق', 'تغطي الرسوم الدراسية بالكامل'] },
                        { name: 'منحة دعم', percentage: '50%', details: ['تُمنح بناءً على الحاجة', 'تتطلب تقديم إثباتات'] }
                    ]
                },
                {
                    title: 'منح للطلاب الحاليين',
                    items: [
                        { name: 'منحة التميز الأكاديمي', percentage: '25%', details: ['للحاصلين على معدل 3.5 من 4', 'تُجدد فصليًا'] }
                    ]
                }
            ],
            footerButton: { text: 'العودة للخريطة', nextStage: 'map' }
        },
        'facultiesList': {
            title: 'دليل الكليات',
            image: 'images/faculties.webp',
            type: 'card-list',
            items: [
                { name: 'كلية الهندسة', description: 'تضم أقسام الهندسة المدنية، الكهربائية، والميكانيكية.', websiteStage: 'websiteView', url: 'https://engineering.iu.edu.sa' },
                { name: 'كلية الشريعة', description: 'متخصصة في دراسة الفقه وأصوله والشريعة الإسلامية.', websiteStage: 'websiteView', url: 'https://sharia.iu.edu.sa' },
                { name: 'كلية الحاسب الآلي', description: 'تقدم برامج في علوم الحاسب ونظم المعلومات.', websiteStage: 'websiteView', url: 'https://computer.iu.edu.sa' },
            ],
            footerButton: { text: 'العودة للخريطة', nextStage: 'map' }
        },
        'websiteView': {
            title: 'موقع الكلية', // سيتم تحديث هذا العنوان ديناميكيًا
            image: 'images/website-bg.webp',
            type: 'iframe-view',
            url: '', // سيتم تحديث هذا الرابط ديناميكيًا
            footerButton: { text: 'العودة لدليل الكليات', nextStage: 'facultiesList' }
        },
        'admissionInfo': {
            title: 'إجراءات القبول والتسجيل',
            image: 'images/admission.webp',
            type: 'info-list',
            categories: [
                {
                    title: 'المستندات المطلوبة',
                    items: [
                        { name: 'شهادة الثانوية العامة', details: ['أصل وصورة مصدقة'] },
                        { name: 'صورة الهوية أو جواز السفر', details: [] },
                        { name: 'صور شخصية', details: ['عدد 4 صور حديثة'] }
                    ]
                }
            ],
            footerButton: { text: 'العودة للخريطة', nextStage: 'map' }
        },
        'exchangeInfo': {
            title: 'برامج التبادل الطلابي',
            image: 'images/exchange.webp',
            type: 'info-list',
            categories: [
                {
                    title: 'برامج متاحة',
                    items: [
                        { name: 'برنامج إيراسموس+', project: 'أوروبا', details: ['فصل دراسي في جامعة شريكة', 'متاح لطلاب السنة الثالثة والرابعة'] },
                        { name: 'برنامج تبادل مع اليابان', project: 'آسيا', details: ['برنامج صيفي للغة والثقافة اليابانية'] }
                    ]
                }
            ],
            footerButton: { text: 'العودة للخريطة', nextStage: 'map' }
        }
    };
    
    // --- 4. الوظيفة الرئيسية لتحميل وتجهيز المراحل ---
    function loadGameStage(stageKey, params = {}) {
        const stage = gameData[stageKey];
        if (!stage) return console.error('Stage not found:', stageKey);

        // تحديث العناصر العامة
        sceneTitle.textContent = params.title || stage.title;
        sceneImage.src = stage.image;
        sceneImage.classList.remove('hidden');
        infoFooter.classList.add('hidden');
        optionsContainer.innerHTML = ''; // إفراغ المحتوى القديم دائمًا
        
        // بناء المحتوى بناءً على نوع المرحلة
        switch (stage.type) {
            case 'navigation-map':
                sceneContent.appendChild(sceneTitle);
                sceneContent.appendChild(optionsContainer);
                optionsContainer.className = 'options-container';
                stage.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerHTML = `<span class="map-icon">${opt.icon}</span> ${opt.text}`;
                    btn.onclick = () => loadGameStage(opt.nextStage);
                    optionsContainer.appendChild(btn);
                });
                break;

            case 'info-list':
                sceneContent.innerHTML = ''; // مسح كل شيء أولاً
                optionsContainer.innerHTML = `<div class="info-scene-container"></div>`;
                const container = optionsContainer.querySelector('.info-scene-container');
                stage.categories.forEach(cat => {
                    const catTitle = document.createElement('h2');
                    catTitle.className = 'grant-category';
                    catTitle.textContent = cat.title;
                    container.appendChild(catTitle);
                    cat.items.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'grant-card'; // يمكن استخدام نفس التنسيق لأنواع مختلفة
                        const detailsList = item.details.map(d => `<li>${d}</li>`).join('');
                        card.innerHTML = `
                            <h3>${item.name} ${item.percentage ? `<span class="grant-percentage">${item.percentage}</span>` : ''} ${item.project ? `<span class="exchange-project">${item.project}</span>` : ''}</h3>
                            <div class="grant-details"><ul>${detailsList}</ul></div>
                        `;
                        container.appendChild(card);
                    });
                });
                infoFooter.classList.remove('hidden');
                nextStageBtn.textContent = stage.footerButton.text;
                nextStageBtn.onclick = () => loadGameStage(stage.footerButton.nextStage);
                break;

            case 'card-list':
                sceneContent.innerHTML = '';
                optionsContainer.innerHTML = `<div class="info-scene-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"></div>`;
                const cardContainer = optionsContainer.querySelector('.info-scene-container');
                stage.items.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'college-info-card';
                    card.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p>`;
                    card.onclick = () => loadGameStage(item.websiteStage, { title: `موقع ${item.name}`, url: item.url });
                    cardContainer.appendChild(card);
                });
                infoFooter.classList.remove('hidden');
                nextStageBtn.textContent = stage.footerButton.text;
                nextStageBtn.onclick = () => loadGameStage(stage.footerButton.nextStage);
                break;

            case 'iframe-view':
                sceneImage.classList.add('hidden'); // إخفاء الصورة العلوية
                sceneContent.innerHTML = `
                    <div class="loader-container">
                        <div class="loader"></div>
                        <p>يتم الآن تحميل الموقع...</p>
                    </div>
                    <iframe id="college-website-iframe" src="${params.url || stage.url}" style="opacity: 0;"></iframe>
                `;
                const iframe = document.getElementById('college-website-iframe');
                iframe.onload = () => {
                    document.querySelector('.loader-container').classList.add('hidden');
                    iframe.style.opacity = 1;
                };
                infoFooter.classList.remove('hidden');
                nextStageBtn.textContent = stage.footerButton.text;
                nextStageBtn.onclick = () => loadGameStage(stage.footerButton.nextStage);
                break;
        }
    }
});
