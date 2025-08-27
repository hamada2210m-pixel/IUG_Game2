/* --- inline scripts extracted from original index.html --- */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2RjbdyISPTbhfR8h-lE41eY0lEWEOxZevGyTMxNbpY2zTmRzWa3DEAd5Dc6O72GgtMA/exec';
    
    const form = document.getElementById('player-form');
    if(form){
        const startBtn = form.querySelector('button');
        const inputs = form.querySelectorAll('input[required]');
        form.addEventListener('input', () => {
            startBtn.disabled = !form.checkValidity();
        });
    }

    function registerPlayer(name, phone, year) {
        const formData = new FormData();
        formData.append('action', 'register');
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('year', year);
        return fetch(SCRIPT_URL, { method: 'POST', body: formData }).then(response => response.json());
    }
    
    function updatePlayerScore(uniqueId, score) {
        if (!uniqueId) {
            console.error("Attempted to update score without a uniqueId.");
            return;
        }
        const formData = new FormData();
        formData.append('action', 'updateScore');
        formData.append('uniqueId', uniqueId);
        formData.append('score', score);
        fetch(SCRIPT_URL, { method: 'POST', body: formData })
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

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        const newArray = [...array]; 
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [newArray[currentIndex], newArray[randomIndex]] = [
                newArray[randomIndex], newArray[currentIndex]
            ];
        }
        return newArray;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const collegesData = [
            { name: 'كلية الطب', description: 'الطب وعلومه وطبيبٌ للمستقبل', url: 'https://medicine.iugaza.edu.ps/', emoji: '⚕️' },
            { name: 'كلية الهندسة', description: 'هندسة المستقبل بكافة مجالات الحياة', url: 'https://eng.iugaza.edu.ps/', emoji: '🏗️' },
            { name: 'كلية تكنولوجيا المعلومات', description: 'عصر التكنولوجيا والمعلوماتية وأمن المعلومات والبيانات', url: 'https://fit.iugaza.edu.ps/', emoji: '💻' },
            { name: 'كلية التمريض', description: 'بذلٌ وعطاءٌ وتفانٍ لكل مريض وفي كل مكان', url: 'https://nursing.iugaza.edu.ps/', emoji: '🩺' },
            { name: 'كلية العلوم الصحية', description: 'العلاج السليم يبدأ من هنا', url: 'https://healthscience.iugaza.edu.ps/', emoji: '🧬' },
            { name: 'كلية العلوم', description: 'علوم الطبيعة وأسرار الكون', url: 'https://science.iugaza.edu.ps/', emoji: '🔬' },
            { name: 'كلية الآداب', description: 'علمٌ ولغاتٌ وأدبٌ وثقافة الأمم المختلفة قديماً وحديثاً', url: 'https://arts.iugaza.edu.ps/', emoji: '📚' },
            { name: 'كلية الشريعة والقانون', description: 'دراسة للشريعة الاسلامية والمحاماة على مبادئ الشريعة السمحة', url: 'https://sharea.iugaza.edu.ps/', emoji: '⚖️' },
            { name: 'كلية أصول الدين', description: 'الدين الإسلامي ، أصوله وأحكامه', url: 'https://osool.iugaza.edu.ps/', emoji: '🕌' },
            { name: 'كلية التربية', description: 'معلمٌ .. يربي أجيال المستقبل المستنيرة', url: 'https://education.iugaza.edu.ps/', emoji: '👩‍🏫' },
            { name: 'كلية الاقتصاد والعلوم الإدارية', description: 'بناء الاقتصاد والإدارة السليمة والمال', url: 'https://commerce.iugaza.edu.ps/', emoji: '💼' }
        ];

        const allGuides = [
            { id: 'medicine', name: 'د. خالد', gender: 'male', college: 'كلية الطب', emoji: '⚕️', description: 'الدقة والتشخيص السليم هما مفتاح النجاح. سأرشدك في رحلة معرفية صحية.' },
            { id: 'engineering', name: 'م. سارة', gender: 'female', college: 'كلية الهندسة', emoji: '🏗️', description: 'كل مشروع عظيم يبدأ بتصميم دقيق. لنبني مستقبلك خطوة بخطوة.' },
            { id: 'it', name: 'مبرمج بدر', gender: 'male', college: 'كلية تكنولوجيا المعلومات', emoji: '💻', description: 'في عالم الأكواد، كل مشكلة لها حل. سأساعدك على التفكير بمنطقية وإيجاد الحلول.' },
            { id: 'nursing', name: 'ممرضة أمل', gender: 'female', college: 'كلية التمريض', emoji: '🩺', description: 'الرحمة والعناية هما أساس مهنتنا. سأكون بجانبك لألهمك العطاء.' },
            { id: 'health_sciences', name: 'أخصائي رامي', gender: 'male', college: 'كلية العلوم الصحية', emoji: '🧬', description: 'صحة المجتمع تبدأ من المختبر. معًا سنكتشف أسرار الوقاية والعلاج.' },
            { id: 'sciences', name: 'عالمة نور', gender: 'female', college: 'كلية العلوم', emoji: '🔬', description: 'الكون مليء بالأسئلة، والعلوم هي وسيلتنا للإجابة. دعنا نستكشف بشغف.' },
            { id: 'arts', name: 'أديبة ليلى', gender: 'female', college: 'كلية الآداب', emoji: '📚', description: 'الكلمات تبني الحضارات. سأجعل رحلتك مليئة بالإبداع والمعاني الجميلة.' },
            { id: 'law', name: 'فقيه يوسف', gender: 'male', college: 'كلية الشريعة والقانون', emoji: '⚖️', description: 'العدل هو أساس الملك. سأعلمك كيف توازن بين الحقوق والواجبات.' },
            { id: 'religion', name: 'داعية إيمان', gender: 'female', college: 'كلية أصول الدين', emoji: '🕌', description: 'العلم بالدين ينير الدرب. سأرافقك في رحلة لفهم مقاصد شريعتنا السمحة.' },
            { id: 'education', name: 'أستاذة هدى', gender: 'female', college: 'كلية التربية', emoji: '👩‍🏫', description: 'بناء الأجيال هو أسمى الرسالات. معًا سنتعلم كيف نلهم العقول ونبني المستقبل.' },
            { id: 'economics', name: 'خبير مالي', gender: 'male', college: 'كلية الاقتصاد', emoji: '💼', description: 'فهم المال والاقتصاد هو مفتاح بناء مستقبل مزدهر. دعنا نخطط لنجاحك.' }
        ];

        const guideMessages = {
            'gate': {
                medicine: "مرحباً بك! الدخول للجامعة يشبه التشخيص الأول، يجب أن يكون دقيقاً. ركز جيداً.",
                engineering: "أهلاً بك. هذه البوابة هي أساس مشروعك التعليمي. لنبدأ ببناء متين!",
                it: "مصادقة ناجحة! لقد تجاوزت جدار الحماية الأول. أهلاً بك في نظام الجامعة.",
                nursing: "تماماً مثل استقبال المريض، نرحب بك بحرارة. رحلتك نحو العطاء تبدأ الآن.",
                health_sciences: "العينة الأولى هي سؤال الدخول! حلله بعناية لتكشف الإجابة الصحيحة.",
                sciences: "مرحباً أيها الباحث! كل اكتشاف عظيم يبدأ بفرضية. ما هي فرضيتك للإجابة الصحيحة؟",
                arts: "لكل قصة بداية، وهذه بداية قصتك الجامعية. اجعلها بداية مُلهمة.",
                law: "قبل الدخول، يجب التأكد من استيفاء الشروط. هل أنت مستعد لإثبات جدارتك؟",
                religion: "بسم الله نبدأ. هذه البوابة هي مدخلك إلى صرح من صروح العلم والإيمان.",
                education: "أهلاً بك في الفصل الأول من رحلتك. كل إجابة صحيحة هي خطوة نحو إلهام الآخرين.",
                economics: "هذه أول صفقة لك! استثمر تركيزك جيداً لتحقيق أول ربح في رصيدك."
            },
            'library': {
                medicine: "المكتبة هي مصدر الأبحاث الطبية الحديثة. كل كتاب هنا قد ينقذ حياة في المستقبل.",
                engineering: "هنا تجد المخططات والمراجع لبناء أي شيء تتخيله. المعرفة هي أقوى مواد البناء.",
                it: "المكتبة هي قاعدة بياناتنا الضخمة. ابحث جيداً وستجد الخوارزمية الصحيحة لحل أي تحدٍ.",
                nursing: "كما نحتاج للمراجع لمعرفة أفضل طرق الرعاية، ستجد هنا كل ما تحتاجه لتغذية عقلك.",
                health_sciences: "نتائج أبحاثنا تعتمد على دقة مصادرنا. المكتبة هي مختبرك النظري الأول.",
                sciences: "هنا تجد أبحاث من سبقونا. قف على أكتاف العمالقة لترى أبعد.",
                arts: "الكتب هي غذاء الروح. استلهم من قصص العظماء هنا لتكتب قصتك الخاصة.",
                law: "هنا تجد نصوص القوانين والسوابق القضائية. كل قضية ناجحة تبدأ ببحث دقيق.",
                religion: "هذه رياض من رياض الجنة. هنا كتب التفسير والحديث التي تنير العقل والقلب.",
                education: "المكتبة هي مصدر إعداد الدروس للمستقبل. كلما قرأت أكثر، زادت قدرتك على التعليم.",
                economics: "هنا تجد نظريات كبار الاقتصاديين. دراسة الماضي هي أفضل طريقة للتنبؤ بالمستقبل."
            },
            'faculties-list': {
                medicine: "ستجد كلية الطب هنا، حيث نتعلم كيف ننقذ الأرواح. اختر بحكمة وشغف.",
                engineering: "هذه منطقة الكليات، وكليتي (الهندسة) هنا! كل مبنى يحمل معرفة مختلفة. استكشف بشغف.",
                it: "هذه هي الشبكة الرئيسية للكليات. كل كلية تمثل خادماً (Server) للمعرفة. إلى أي واحد ستتصل؟",
                nursing: "هنا تتوزع أقسام المستشفى التعليمي... عفواً، أقصد كليات الجامعة. كل كلية تقدم نوعاً فريداً من الرعاية.",
                health_sciences: "كل كلية هنا تختص بمجال حيوي. استكشفها لتجد المجال الذي يثير شغفك.",
                sciences: "هذه الكليات تمثل فروع شجرة المعرفة. أي فرع ستختار لتتسلقه؟",
                arts: "كل كلية هنا تمثل فصلاً في كتاب الجامعة الكبير. أي فصل ستختار أن تقرأ؟",
                law: "أمامك هيئات تشريعية مختلفة للمعرفة. اختر الهيئة التي ستنتمي إليها.",
                religion: "كل كلية هنا هي منبر علم. اختر المنبر الذي ستنهل منه العلم الشرعي.",
                education: "هذه هي الفصول الدراسية للجامعة. اختر الفصل الذي ستتعلم فيه لكي تُعلِّم.",
                economics: "هذه هي أسواق المعرفة المختلفة. كل كلية لها أصولها وقيمتها. استثمر في مستقبلك."
            },
            'studentaffairs-info': {
                medicine: "صحة الطالب النفسية والاجتماعية جزء لا يتجزأ من نجاحه. شؤون الطلبة هي 'الطبيب' الذي يعالج أي مشكلة تواجهك.",
                engineering: "كما تحتاج المشاريع الكبرى إلى إدارة وإشراف، تحتاج رحلتك الجامعية إلى دعم. شؤون الطلبة هي الجهة المشرفة.",
                it: "شؤون الطلبة هي 'نظام الدعم الفني' لك. مهما كانت المشكلة، لديهم حل أو توجيه.",
                nursing: "هنا تجد الرعاية والدعم. عمادة شؤون الطلبة هي قلب الجامعة الذي يهتم بكل طالب.",
                health_sciences: "تحليل المشكلات الطلابية وإيجاد حلول لها هو تخصصهم. لا تتردد في استشارتهم.",
                sciences: "هم يدرسون 'الظواهر' الطلابية ويضعون الحلول. استكشف الخدمات التي يقدمونها لك.",
                arts: "هنا يتم نسج قصص النجاح الطلابية ودعم المواهب. شؤون الطلبة هي منصة إبداعك.",
                law: "هم يضمنون حقوقك كطالب ويوجهونك لواجباتك. تعرف على 'قوانين' الدعم الطلابي.",
                religion: "الإرشاد والتوجيه السليم من أهم مهامهم، استعن بهم لتكون رحلتك مباركة.",
                education: "هم 'المعلمون' الذين يرشدونك خارج القاعة الدراسية، ويساعدونك على تنمية مهاراتك.",
                economics: "يديرون 'محفظة' المنح والقروض لمساعدتك. استثمر وقتك في التعرف على خدماتهم المالية."
            }
        };

        const gameData = {
            'gate': { id: 'gate_q1', image: 'assets/images/hares 1.webp', question: 'أهلاً بك في الجامعة الإسلامية! للدخول، أجب عن السؤال التالي: في أي عام تأسست الجامعة؟', options: { '1978': '1978', '1982': '1982', '1960': '1960', '1990': '1990' }, correctAnswer: '1978', points: 1, 
                hint: { default: "التاريخ قريب من نهاية السبعينيات." },
                correctFeedback: { default: 'رائع! لقد حصلت على نقطة واحدة. البوابة الآن مفتوحة أمامك!' },
                incorrectFeedback: { default: 'إجابة غير صحيحة. حاول مرة أخرى!' }
            },
            'library': [ { id: 'library_q1', image: 'assets/images/library_question.webp', question: 'تضم مكتبتنا كنزاً معرفياً ضخماً. كم عدد المراجع الإلكترونية التي توفرها؟', options: { '100k': 'أكثر من 100 ألف مرجع الكتروني', '150k': 'أكثر من 150 ألف مرجع الكتروني', '50k': 'أقل من 50 ألف مرجع الكتروني', '200k': 'أكثر من 200 ألف مرجع الكتروني' }, correctAnswer: '150k', points: 1, 
                hint: { it: "قواعد البيانات لدينا واسعة جداً، فكر في رقم كبير لكنه ليس الأكبر في الخيارات." },
                correctFeedback: { default: 'إجابة ممتازة! معرفتك دقيقة. لقد ربحت نقطة واحدة.' },
                incorrectFeedback: { default: 'المعرفة قوة، حاول مرة أخرى!' } 
            }, { id: 'library_q2', image: 'assets/images/library_question_2.webp', question: 'هل توفر المكتبة قاعات هادئة ومخصصة للدراسة؟', options: { 'yes': 'نعم، توفر قاعات هادئة', 'no': 'لا، المكتبة للكتب فقط' }, correctAnswer: 'yes', points: 1, 
                hint: { education: "بيئة التعلم المناسبة ضرورية، والجامعة تهتم بذلك." },
                correctFeedback: { default: 'بالتأكيد! راحتك أثناء الدراسة تهمنا. لقد ربحت نقطة واحدة إضافية.' },
                incorrectFeedback: { default: 'إجابة غير صحيحة. المكتبة مكان مثالي للدراسة.' } 
            }, { id: 'library_q3', image: 'assets/images/library_question_3.webp', question: 'كيف تساعدك المكتبة في أبحاثك الجامعية؟', options: { 'resources': 'توفر مصادر ومراجع متنوعة', 'writes_for_you': 'تكتب البحث بدلاً عنك' }, correctAnswer: 'resources', points: 1, 
                hint: { sciences: "البحث العلمي يعتمد على الاستشهاد بمصادر موثوقة." },
                correctFeedback: { default: 'صحيح! المكتبة هي شريكك الأول في البحث العلمي. ربحت نقطة واحدة.' },
                incorrectFeedback: { default: 'إجابة غير دقيقة. المكتبة تدعمك بالمصادر لا بالقيام بالعمل عنك.' } 
            }, { id: 'library_q4', image: 'assets/images/library_question_4.webp', question: 'هل توفر المكتبة مواد رقمية يمكن الوصول إليها عن بعد؟', options: { 'yes_ebooks': 'نعم، توفر كتباً إلكترونية', 'no_digital': 'لا، كل المواد ورقية فقط' }, correctAnswer: 'yes_ebooks', points: 1, 
                hint: { it: "نحن في عصر التحول الرقمي، والجامعة تواكب ذلك." },
                correctFeedback: { default: 'أحسنت! يمكنك الوصول لكنز معرفي من أي مكان. لقد ربحت آخر نقطة في هذه المرحلة.' },
                incorrectFeedback: { default: 'إجابة غير صحيحة. العصر الرقمي في قلب مكتبتنا.' } 
            } ],
            'faculties-list': { isInfoScreen: true, nextScene: 'faculties' },
            'faculties': { id: 'faculties_menu', image: 'assets/images/first_faculties_q.webp', question: 'اختر نوع التحدي الذي تود خوضه هنا:', options: { 'tf_questions': '<span class="icon">✔️❌</span> أسئلة صح وخطأ', 'mc_questions': '<span class="icon">❓</span> أسئلة اختيار من متعدد' }, correctAnswer: null, points: 0, nextScene: { 'tf_questions': 'tf_questions', 'mc_questions': 'mc_questions' } },
            'tf_questions': [ { id: 'tf_q1', image: 'assets/images/all_q.webp', question: 'تأسست الجامعة الإسلامية بغزة عام 1978.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{default: "هذا السؤال يشبه سؤال البوابة، هل تتذكره?"} }, { id: 'tf_q2', image: 'assets/images/all_q.webp', question: 'الجامعة لديها 11 كلية.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{default: "قمنا بعدّ الكليات في شاشة استكشاف الكليات، العدد فردي."} }, { id: 'tf_q3', image: 'assets/images/all_q.webp', question: 'كلية الطب تأسست عام 2006.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{medicine: "تاريخ تأسيس كليتي حديث نسبياً."} }, { id: 'tf_q4', image: 'assets/images/all_q.webp', question: 'كلية تكنولوجيا المعلومات أُسست قبل كلية التجارة.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'incorrect', points: 1, hint: {economics: "كلية التجارة (الاقتصاد) من الكليات القديمة في الجامعة."} }, { id: 'tf_q5', image: 'assets/images/all_q.webp', question: 'الجامعة تقدم شهادات دكتوراة (PhD) في الإدارة، الاقتصاد، الهندسة، الفنون، وتكنولوجيا المعلومات.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: {default: "الجامعة تقدم برامج دراسات عليا متقدمة في معظم كلياتها الرئيسية."} }, { id: 'tf_q6', image: 'assets/images/all_q.webp', question: 'الجامعة الأولى على مستوى غزة من حيث الترتيب العالمي.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: {default: "الجامعة تفتخر بتصنيفها المتقدم."} }, { id: 'tf_q7', image: 'assets/images/all_q.webp', question: 'في كلية الطب، يجب على الطالب نشر بحث علمي في مجلة محكّمة كجزء من متطلبات التخرج.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: {medicine: "البحث العلمي جزء أساسي من تكوين الطبيب الناجح."} }, { id: 'tf_q8', image: 'assets/images/all_q.webp', question: 'كلية الطب هي المركز الوحيد المعتمد لإجراء امتحانات IFOM داخل غزة.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: {medicine: "هذا الامتحان الدولي مهم لتقييم العلوم الطبية الأساسية والسريرية."} }, { id: 'tf_q9', image: 'assets/images/all_q.webp', question: 'الجامعة مقرها فقط في مدينة غزة، ولا يوجد لها فروع أخرى.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'incorrect', points: 1, hint: {default: "هل تصل خدمات الجامعة التعليمية إلى مناطق أخرى في القطاع؟"} }, { id: 'tf_q10', image: 'assets/images/all_q.webp', question: 'الجامعة عضو في الاتحاد الدولي للجامعات ومجموعة جامعات البحر الأبيض المتوسط.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: {default: "الانتماء لهذه الاتحادات يعزز من مكانة الجامعة العالمية."} } ],
            'mc_questions': [ { id: 'mc_q1', image: 'assets/images/all_q.webp', question: 'كم عدد الكليات في الجامعة الإسلامية بغزة؟', options: { '11': '11', '9': '9', '10': '10', '12': '12' }, correctAnswer: '11', points: 1, hint:{default: "الرقم فردي وأكبر من 10."} }, { id: 'mc_q2', image: 'assets/images/all_q.webp', question: 'أي من الكليات التالية ليست من كليات الجامعة؟', options: { 'it': 'تكنولوجيا المعلومات', 'الفنون': 'الفنون', 'الطب': 'الطب', 'الهندسة': 'الهندسة' }, correctAnswer: 'الفنون', points: 1, hint:{arts: "كليتي هي 'الآداب'، وهي تختلف عن الفنون الجميلة."} }, { id: 'mc_q3', image: 'assets/images/all_q.webp', question: 'متى تأسست كلية الطب بالجامعة؟', options: { '2006': '2006', '1980': '1980', '1993': '1993', '2005': '2005' }, correctAnswer: '2006', points: 1, hint:{default: "كان ذلك في منتصف العقد الأول من الألفية الجديدة."} }, { id: 'mc_q4', image: 'assets/images/all_q.webp', question: 'أي من التالي يصف مكانة الجامعة على مستوى غزة؟', options: { 'الأولى': 'الأولى', 'الثالثة': 'الثالثة', 'الرابعة': 'الرابعة', 'الثانية': 'الثانية' }, correctAnswer: 'الأولى', points: 1, hint: {default: "الجامعة رائدة في قطاع غزة."} }, { id: 'mc_q5', image: 'assets/images/all_q.webp', question: 'في أي كلية يجب على الطالب اجتياز امتحاني IFOM-BSE وIFOM-CSE للتخرج؟', options: { 'الطب': 'الطب', 'الهندسة': 'الهندسة', 'it': 'تكنولوجيا المعلومات', 'التربية': 'التربية' }, correctAnswer: 'الطب', points: 1, hint: {medicine: "هذه امتحانات دولية لقياس الكفاءة الطبية، وهي ضرورية في كليتي."} }, { id: 'mc_q6', image: 'assets/images/all_q.webp', question: 'من بين هذه الكليات، أيها تأسست أولاً؟', options: { 'التربية (1980)': 'التربية (1980)', 'تكنولوجيا المعلومات (2005)': 'تكنولوجيا المعلومات (2005)', 'التجارة (1981)': 'التجارة (1981)', 'الطب (2006)': 'الطب (2006)' }, correctAnswer: 'التربية (1980)', points: 1, hint: {education: "كليتنا من الكليات المؤسسة للجامعة."} }, { id: 'mc_q7', image: 'assets/images/all_q.webp', question: 'أي من الاتحادات التالية الجامعة عضو فيها؟', options: { 'اتحاد البحر المتوسط لجامعات': 'اتحاد البحر المتوسط لجامعات', 'رابطة الجامعات الأمريكية': 'رابطة الجامعات الأمريكية', 'روسيا الجامعات الإسلامية': 'روسيا الجامعات الإسلامية', 'رابطة الجامعات الصينية': 'رابطة الجامعات الصينية' }, correctAnswer: 'اتحاد البحر المتوسط لجامعات', points: 1, hint: {default: "موقع فلسطين الجغرافي قد يساعدك في تحديد الإجابة."} }, { id: 'mc_q8', image: 'assets/images/all_q.webp', question: 'كم عدد المراكز والمعاهد البحثية بالجامعة؟', options: { 'أكثر من 20': 'أكثر من 20', 'أقل من 10': 'أقل من 10', 'حوالي 15': 'حوالي 15', '30 فقط': '30 فقط' }, correctAnswer: 'أكثر من 20', points: 1, hint: {sciences: "البحث العلمي أولوية، لذا عدد المراكز كبير ويدعم تخصصات مختلفة."} } ],
            'exchange-info': { isInfoScreen: true, nextScene: 'exchange' },
            'exchange': { id: 'exchange_menu', image: 'assets/images/all_q.webp', question: 'اختر نوع التحدي الذي تود خوضه هنا:', options: { 'exchange_tf_questions': '<span class="icon">✔️❌</span> أسئلة صح وخطأ', 'exchange_mc_questions': '<span class="icon">❓</span> أسئلة اختيار من متعدد' }, correctAnswer: null, points: 0, nextScene: { 'exchange_tf_questions': 'exchange_tf_questions', 'exchange_mc_questions': 'exchange_mc_questions' } },
            'exchange_tf_questions': [ { id: 'ex_tf_q1', image: 'assets/images/all_q.webp', question: 'تهتم العلاقات الخارجية في الجامعة بتوفير منح بكالوريوس، ماجستير، دكتوراه وما بعد الدكتوراه في جامعات عالمية.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{default:"هل تهدف الجامعة لربط طلابها بالعالم؟"} }, { id: 'ex_tf_q2', image: 'assets/images/all_q.webp', question: 'الجامعة عضو في شبكة جامعات البحر الأسود وشرق البحر المتوسط (BSEMAN).', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{arts: "الانفتاح على ثقافات وحضارات مختلفة هو من أهدافنا."} }, { id: 'ex_tf_q3', image: 'assets/images/all_q.webp', question: 'العلاقات الخارجية أبرمت مشاريع تبادل أكاديمي ضمن برنامج Erasmus+ مع جامعة جلاسكو وجامعة Algarve.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{default: "برنامج إيراسموس هو برنامج تبادل طلابي أوروبي شهير."} } ],
            'exchange_mc_questions': [ { id: 'ex_mc_q1', image: 'assets/images/all_q.webp', question: 'أياً من الخدمات التالية تتولّاها دائرة العلاقات الخارجية؟', options: { 'توفير منح دراسية دولية والتبادل الأكاديمي واستقطاب الباحثين': 'توفير منح دراسية دولية والتبادل الأكاديمي واستقطاب الباحثين', 'تأمين المنح الدراسية فقط': 'تأمين المنح الدراسية فقط', 'تنظيم الرحلات السياحية': 'تنظيم الرحلات السياحية', 'إصدار التراخيص الحكومية': 'إصدار التراخيص الحكومية' }, correctAnswer: 'توفير منح دراسية دولية والتبادل الأكاديمي واستقطاب الباحثين', points: 1, hint:{default: "ابحث عن الإجابة الأكثر شمولاً وتخصصاً."} }, { id: 'ex_mc_q2', image: 'assets/images/all_q.webp', question: 'ما البرنامج الأوروبي الذي فتح المجال لتبادل أعضاء هيئة التدريس والطلبة؟', options: { 'Erasmus+ (Key Action 1)': 'Erasmus+ (Key Action 1)', 'Horizon 2020': 'Horizon 2020', 'Marie Skłodowska-Curie': 'Marie Skłodowska-Curie', 'Erasmus Mundus': 'Erasmus Mundus' }, correctAnswer: 'Erasmus+ (Key Action 1)', points: 1, hint:{default: "إيراسموس هو الاسم الأكثر شهرة في برامج التبادل الأوروبية."} }, { id: 'ex_mc_q3', image: 'assets/images/all_q.webp', question: 'أيٌّ مما يلي ليس من اختصاص العلاقات الخارجية بحسب الموقع؟', options: { 'قبول طلبات القبول الجامعي المحلي': 'قبول طلبات القبول الجامعي المحلي', 'برامج التعاون الأكاديمي': 'برامج التعاون الأكاديمي', 'التبادل الأكاديمي': 'التبادل الأكاديمي', 'بوابة الباحثين عن منح': 'بوابة الباحثين عن منح' }, correctAnswer: 'قبول طلبات القبول الجامعي المحلي', points: 1, hint:{default: "هناك عمادة أخرى مختصة بالقبول المحلي."} } ],
            'grants-info': { isInfoScreen: true, nextScene: 'grants' },
            'grants': [ { id: 'grants_q1', image: 'assets/images/all_q.webp', question: 'أنهت مريم فصلها الدراسي الأول في كلية الهندسة بتفوق، وحصلت على معدل فصلي 96% بعد أن درست 16 ساعة معتمدة. ما هي نسبة "منحة الامتياز" التي تستحقها تلقائياً في الفصل التالي؟', options: { '35': '35%', '50': '50%', '70': '70%', '100': '100%' }, correctAnswer: '70', points: 1, hint:{economics:"التميز العالي يكافأ بأعلى نسبة منحة تفوق متاحة (70% للمعدل فوق 95%)."} }, { id: 'grants_q2', image: 'assets/images/all_q.webp', question: 'ما هي نسبة "منحة الأسرة" التي يحصل عليها كل فرد من أسرة لديها "شقيقان فقط" يدرسان في الجامعة؟', options: { '15': '15%', '25': '25%', '30': '30%', '50': '50%' }, correctAnswer: '15', points: 1, hint:{default:"هي النسبة الأقل في منحة الأسرة."} }, { id: 'grants_q3', image: 'assets/images/all_q.webp', question: 'إذا كان معدل أحد الأشقاء في كلية الطب 72%، هل يستمر في الاستفادة منحة الأسرة؟', options: { 'yes_continue': 'نعم، ستستمر', 'no_stop': 'لا، ستتوقف' }, correctAnswer: 'no_stop', points: 1, hint:{medicine:"للاستمرارية في المنحة، يجب أن يكون معدل طالب الطب 75% فما فوق."} }, { id: 'grants_q4', image: 'assets/images/all_q.webp', question: 'ما هي نسبة المنحة التي يحصل عليها الطالب الذي يحفظ القرآن الكريم كاملاً بعد اجتياز امتحان التسميع؟', options: { '35': '35%', '50': '50%', '70': '70%', '100': '100%' }, correctAnswer: '50', points: 1, hint:{religion:"الجامعة تقدر حفظة كتاب الله وتمنحهم نصف الرسوم."} } ],
            'admission-info': { isInfoScreen: true, nextScene: 'admission' },
            'admission': { id: 'admission_menu', image: 'assets/images/all_q.webp', question: 'اختر نوع التحدي الذي تود خوضه هنا:', options: { 'admission_tf_questions': '<span class="icon">✔️❌</span> أسئلة صح وخطأ', 'admission_mc_questions': '<span class="icon">❓</span> أسئلة اختيار من متعدد' }, correctAnswer: null, points: 0, nextScene: { 'admission_tf_questions': 'admission_tf_questions', 'admission_mc_questions': 'admission_mc_questions' } },
            'admission_tf_questions': [ { id: 'ad_tf_q1', image: 'assets/images/all_q.webp', question: 'معدل القبول في كلية الطب البشري هو 96%.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'incorrect', points: 1, hint:{medicine: "القبول في كليتي يتطلب أعلى معدل على الإطلاق، وهو أعلى من هذا الرقم بقليل."} }, { id: 'ad_tf_q2', image: 'assets/images/all_q.webp', question: 'يمكن لطلبة الفرع الأدبي الالتحاق بكلية التمريض.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{nursing:"نعم، ولكن بمعدل قبول أعلى من الفرع العلمي."} }, { id: 'ad_tf_q3', image: 'assets/images/all_q.webp', question: 'كلية العلوم الصحية لا تقبل طلبة من الفرع الأدبي.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint:{health_sciences:"تخصصاتنا تتطلب أساساً علمياً قوياً."} } ],
            'admission_mc_questions': [ { id: 'ad_mc_q1', image: 'assets/images/all_q.webp', question: 'ما هو معدل القبول المطلوب للالتحاق بتخصص "الذكاء الاصطناعي"؟', options: { '80': '80%', '65': '65%', '70': '70%', '75': '75%' }, correctAnswer: '80', points: 1, hint:{it:"الذكاء الاصطناعي هو تخصص هندسي، ومعدلات الهندسة تبدأ من هذا الرقم."} }, { id: 'ad_mc_q2', image: 'assets/images/all_q.webp', question: 'أي كلية تتطلب أعلى معدل قبول للفرع العلمي؟', options: { 'الهندسة': 'الهندسة', 'الطب': 'الطب', 'تكنولوجيا المعلومات': 'تكنولوجيا المعلومات', 'العلوم': 'العلوم' }, correctAnswer: 'الطب', points: 1, hint:{medicine:"كليتي تتطلب أعلى معدل قبول في الجامعة."} }, { id: 'ad_mc_q3', image: 'assets/images/all_q.webp', question: 'ما هو أدنى معدل قبول يمكن للطالب الحاصل على شهادة الثانوية العامة (الفرع العلمي) الالتحاق به في الجامعة؟', options: { '65': '65%', '70': '70%', '75': '75%', '60': '60%' }, correctAnswer: '65', points: 1, hint:{default:"هذا المعدل يفتح لك أبواب العديد من الكليات مثل العلوم وتكنولوجيا المعلومات."} } ],
            'studentaffairs-info': { isInfoScreen: true, nextScene: 'studentaffairs' },
            'studentaffairs': { id: 'studentaffairs_menu', image: 'assets/images/all_q.webp', question: 'أنت الآن في محطة شؤون الطلبة، اختر نوع التحدي:', options: { 'studentaffairs_tf_questions': '<span class="icon">✔️❌</span> أسئلة صح وخطأ', 'studentaffairs_mc_questions': '<span class="icon">❓</span> أسئلة اختيار من متعدد' }, correctAnswer: null, points: 0, nextScene: { 'studentaffairs_tf_questions': 'studentaffairs_tf_questions', 'studentaffairs_mc_questions': 'studentaffairs_mc_questions' } },
            'studentaffairs_tf_questions': [
                { id: 'sa_tf_q1', image: 'assets/images/all_q.webp', question: 'تأسست عمادة شؤون الطلبة في نفس عام تأسيس الجامعة.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'incorrect', points: 1, hint: { default: 'الجامعة تأسست عام 1978، لكن العمادة تأسست بعد ذلك ببضع سنوات قليلة.' }, correctFeedback: { default: 'إجابة صحيحة! تأسست العمادة عام 1981م.' } },
                { id: 'sa_tf_q2', image: 'assets/images/all_q.webp', question: 'من مهام عمادة شؤون الطلبة الإشراف على النشاط الثقافي والرياضي.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: { default: 'الأنشطة اللامنهجية هي جزء أساسي من عمل العمادة.' } },
                { id: 'sa_tf_q3', image: 'assets/images/all_q.webp', question: 'قسم البحث الاجتماعي هو المسؤول عن ترشيح الطلبة للمنح الخارجية.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: { economics: 'الحالة المادية للطالب عامل مهم في تحديد استحقاقه للمنح، وهذا القسم يدرس ذلك.' } },
                { id: 'sa_tf_q4', image: 'assets/images/all_q.webp', question: 'العمل التطوعي هو مساق اختياري يمكن للطالب التسجيل فيه.', options: { 'correct': 'صح', 'incorrect': 'خطأ' }, correctAnswer: 'correct', points: 1, hint: { education: 'تشجع الجامعة على خدمة المجتمع، والعمل التطوعي هو أحد أشكال هذه الخدمة.' } }
            ],
            'studentaffairs_mc_questions': [
                { id: 'sa_mc_q1', image: 'assets/images/all_q.webp', question: 'في أي عام أنشئت عمادة شؤون الطلبة؟', options: { '1978': '1978م', '1981': '1981م', '1990': '1990م', '2000': '2000م' }, correctAnswer: '1981', points: 1, hint: { default: 'كان ذلك بعد 3 سنوات من تأسيس الجامعة.' } },
                { id: 'sa_mc_q2', image: 'assets/images/all_q.webp', question: 'أي من الأقسام التالية لا يتبع لعمادة شؤون الطلبة؟', options: { 'research': 'البحث الاجتماعي', 'sports': 'النشاط الرياضي', 'guidance': 'التوجيه والإرشاد', 'admission': 'القبول والتسجيل' }, correctAnswer: 'admission', points: 1, hint: { default: 'القبول والتسجيل له عمادة مستقلة ومختصة.' } },
                { id: 'sa_mc_q3', image: 'assets/images/all_q.webp', question: 'ما هو الهدف من قسم البحث الاجتماعي بشكل أساسي؟', options: { 'academic': 'مساعدة الطلبة أكاديمياً', 'financial': 'مساعدة الطلبة مالياً', 'sports': 'تنظيم الفرق الرياضية', 'cultural': 'إقامة الندوات الثقافية' }, correctAnswer: 'financial', points: 1, hint: { economics: 'يركز القسم على دراسة المشكلات الاقتصادية للطلبة.' } },
                { id: 'sa_mc_q4', image: 'assets/images/all_q.webp', question: 'ما هي أول خطوة يجب على الطالب اتباعها للاستفادة من خدمات البحث الاجتماعي؟', options: { 'visit': 'زيارة العمادة شخصياً', 'form': 'تعبئة استمارة إلكترونية', 'call': 'الاتصال هاتفياً بالقسم', 'email': 'إرسال بريد إلكتروني' }, correctAnswer: 'form', points: 1, hint: { it: 'تبدأ معظم المعاملات الحديثة بخطوة رقمية.' } }
            ],
            'cafeteria': { isUnderConstruction: true },
            'hospital': { isUnderConstruction: true },
            'conference': { isUnderConstruction: true },
            'stadium': { isUnderConstruction: false }
        };

        const badgesData = [
            { id: 'library-expert', name: 'شارة المثقف', emoji: '🏅', stageId: 'library' },
            { id: 'faculties-expert', name: 'شارة الخبير الهندسي', emoji: '🏅', stageId: 'faculties' },
            { id: 'speed-runner', name: 'شارة البرق', emoji: '⚡', stageId: 'any-timed-stage' },
            { id: 'grants-master', name: 'شارة المنح', emoji: '✨', stageId: 'grants' },
            { id: 'exchange-master', name: 'شارة الجسر', emoji: '🌉', stageId: 'exchange' },
            { id: 'student-affairs-master', name: 'شارة القائد', emoji: '🎯', stageId: 'studentaffairs' },
            { id: 'admission-master', name: 'شارة القبول', emoji: '📝', stageId: 'admission' },
            { id: 'perfect-score', name: 'شارة العلامة الكاملة', emoji: '💯', stageId: 'any-stage-perfect' }
        ];

        const admissionInfoData = [
            { faculty: "الطب", specializations: [ { name: "الطب البشري", score: "97% علمي / 96% طلاب" } ] },
            { faculty: "الهندسة", specializations: [ { name: "الهندسة المدنية، الهندسة المعمارية (تصميم داخلي، تكنولوجيا مباني، تخطيط عمراني)، الذكاء الاصطناعي، هندسة الحاسوب، الهندسة الصناعية، الهندسة الكهربائية، الهندسة البيئية، الهندسة الميكانيكية، هندسة النظم الذكية", score: "80% علمي" } ] },
            { faculty: "تكنولوجيا المعلومات", specializations: [ { name: "علم الحاسوب، تطوير البرمجيات، تكنولوجيا المعلومات، حوسبة الويب (جديد)", score: "65% علمي" }, { name: "الوسائط المتعددة", score: "70% علمي / 65% أدبي" } ] },
            { faculty: "العلوم", specializations: [ { name: "الكيمياء، الرياضيات، الفيزياء، الأحياء، علوم الأرض والبيئة، الكيمياء الحيوية، علوم البحار، الإنتاج النباتي، التكنولوجيا الحيوية، رياضيات فرعي كمبيوتر", score: "65% علمي" } ] },
            { faculty: "العلوم الصحية", specializations: [ { name: "العلوم الطبية المخبرية، البصريات، العلاج الطبيعي، تقنيات التصوير الطبي (جديد)، التغذية السريرية (جديد)", score: "70% علمي" } ] },
            { faculty: "التمريض", specializations: [ { name: "التمريض", score: "70% علمي / 80% أدبي" }, { name: "القبالة", score: "70% علمي / 80% أدبي" } ] },
            { faculty: "الاقتصاد والعلوم الإدارية", specializations: [ { name: "المحاسبة (دراسة باللغة العربية)، إدارة الأعمال (دراسة باللغة العربية)", score: "65% علمي وأدبي" }, { name: "المحاسبة (دراسة باللغة الإنجليزية)، إدارة الأعمال (دراسة باللغة الإنجليزية)", score: "65% علمي وأدبي" }, { name: "إدارة الأعمال فرعي الريادة والإبتكار (جديد)، التسويق والتجارة الالكترونية، العلوم السياسية والإعلام، الاقتصاد والعلوم السياسية، الاقتصاد فرعي الإحصاء التطبيقي، العلوم المالية والمصرفية، المحاسبة فرعي تكنولوجيا المعلومات، الاقتصاد الرقمي وتكنولوجيا المال", score: "65% علمي وأدبي" } ] },
            { faculty: "الشريعة والقانون", specializations: [ { name: "الشريعة الإسلامية", score: "65% علمي وأدبي" }, { name: "الشريعة الإسلامية فرعي فتوى وتحكيم", score: "75% علمي وأدبي" }, { name: "الشريعة والقانون", score: "75% علمي وأدبي" } ] },
            { faculty: "أصول الدين", specializations: [ { name: "أصول الدين (عام)، الدعوة والإعلام", score: "65% علمي وأدبي" } ] },
            { faculty: "الآداب", specializations: [ { name: "اللغة العربية، اللغة العربية فرعي الصحافة، اللغة العربية فرعي التدقيق اللغوي، اللغة الإنجليزية، لغة إنجليزية فرعي ترجمة، لغة إنجليزية فرعي صحافة وإعلام (جديد)، الجغرافيا، الجغرافيا فرعي نظم المعلومات الجغرافية، الصحافة والإعلام، الإعلام الرقمي، الخدمة الاجتماعية، التاريخ والآثار، التاريخ فرعي دراسات إسرائيلية، صحافة وإعلام فرعي تكنولوجيا الإذاعة والتلفزيون", score: "65% علمي وأدبي" } ] },
            { faculty: "التربية", specializations: [ { name: "تعليم اللغة العربية، تعليم اللغة الإنجليزية، تعليم العلوم، تعليم الرياضيات، تعليم اجتماعيات، تعليم التربية الإسلامية، المرحلة الأساسية، الإرشاد النفسي والتوجيه التربوي، الكيمياء وأساليب تدريسها، الفيزياء وأساليب تدريسها، الأحياء وأساليب تدريسها، الحاسوب وأساليب تدريسه، اللغة العربية وأساليب تدريسها، اللغة الإنجليزية وأساليب تدريسها، التاريخ وأساليب تدريسه، الجغرافيا وأساليب تدريسها، الرياضيات وأساليب تدريسها", score: "65% علمي وأدبي" } ] }
        ];

       const gameState = {
            playerName: '', playerPhone: '', tawjihiYear: '', uniquePlayerId: null,
            score: 0, currentScene: null, currentSubQuestionIndex: 0,
            answeredQuestions: new Set(), selectedGuide: null,
            powerUps: {},
            badges: [],
            stageScores: {}, // تمت الإضافة هنا
            currentQuestionAttempts: 0
       };
        let questionTimer = null;
        const TIME_LIMIT = 25;
        let timeLeft = TIME_LIMIT;
        let startTime = 0;
        let stagePoints = 0;

       const sceneParentMap = {
           'tf_questions': 'faculties', 'mc_questions': 'faculties', 
            'exchange_tf_questions': 'exchange', 'exchange_mc_questions': 'exchange', 
           'admission_tf_questions': 'admission', 'admission_mc_questions': 'admission',
            'studentaffairs_tf_questions': 'studentaffairs', 'studentaffairs_mc_questions': 'studentaffairs'
       };
       
        const landingScreen = document.getElementById('landing-screen');
        const startScreen = document.getElementById('start-screen');
        const gameSceneContainer = document.getElementById('game-scene');
        const playerForm = document.getElementById('player-form');
        const playerNameDisplay = document.getElementById('player-name-display');
        const playerScoreDisplay = document.getElementById('player-score-display');
        const statusBar = document.getElementById('status-bar');
        const modal = document.getElementById('feedback-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const correctSound = document.getElementById('correct-sound');
        const incorrectSound = document.getElementById('incorrect-sound');
        const transitionSound = document.getElementById('transition-sound');
        const guideAppearsSound = document.getElementById('guide-appears-sound');
        const badgeSound = document.getElementById('badge-sound');
        const videoOverlay = document.getElementById('video-overlay');
        const welcomeVideo = document.getElementById('welcome-video');
        const skipVideoBtn = document.getElementById('skip-video-btn');
        const adModal = document.getElementById('ad-modal');
        let adShownThisSession = false; 
        let adTriggerQuestionIndex = -1; 
        let isAudioUnlocked = false;
        
        const preloadedImages = new Set();

        function preloadImage(url) {
            if (!url || preloadedImages.has(url)) return;
            const img = new Image();
            img.src = url;
            preloadedImages.add(url);
        }
        
        async function unlockAudio() {
            if (isAudioUnlocked) return;
            const sounds = [correctSound, incorrectSound, transitionSound, guideAppearsSound, badgeSound];
            for (const sound of sounds) {
                try {
                    await sound.play();
                    sound.pause();
                } catch (error) {
                    // console.warn("Audio unlock failed for one sound, this is expected.", error.name);
                }
            }
            isAudioUnlocked = true;
        }

        function playSound(soundElement) {
            if (isAudioUnlocked && soundElement) {
                soundElement.currentTime = 0;
                soundElement.play().catch(error => {
                    console.error(`Could not play sound: ${soundElement.src}`, error);
                });
            }
        }
        
        function showGuideModal(title, message, playSoundEffect = true) {
            const guideInfo = allGuides.find(g => g.id === gameState.selectedGuide);
            if (!guideInfo) return;
            
            if (playSoundEffect) {
                playSound(guideAppearsSound);
            }

            const verb = guideInfo.gender === 'female' ? 'تقول' : 'يقول';

            const modalContent = `
                <div style="text-align: center;">
                    <div class="guide-icon" style="margin: 0 auto 10px; font-size: 48px; width: 80px; height: 80px;">${guideInfo.emoji}</div>
                    <h3 style="color: var(--primary-dark); margin: 0;">${guideInfo.name} ${verb}:</h3>
                    <p style="font-size: 16px; color: var(--text-light); margin-top: 10px;">"${message}"</p>
                </div>
            `;
            
            showModal(title, modalContent, null);
        }
        
        function saveGameState() {
            try {
                const stateToSave = { 
                    ...gameState, 
                    answeredQuestions: Array.from(gameState.answeredQuestions),
                    badges: gameState.badges
                };
                localStorage.setItem('iugGameProgress', JSON.stringify(stateToSave));
            } catch (e) {
                console.error("Failed to save game state:", e);
            }
        }

        function loadGameState() {
            try {
                const savedStateJSON = localStorage.getItem('iugGameProgress');
                if (savedStateJSON) {
                    const savedState = JSON.parse(savedStateJSON);
                    Object.assign(gameState, savedState);
                    gameState.answeredQuestions = new Set(savedState.answeredQuestions);
                    if (!gameState.powerUps) gameState.powerUps = {};
                    if (!gameState.badges) gameState.badges = [];
                    if (!gameState.stageScores) gameState.stageScores = {}; // تمت الإضافة هنا
                    return true;
                }
                return false;
            } catch (e) {
                console.error("Failed to load game state:", e);
                return false;
            }
        }
        
        function addBadge(badgeId) {
            if (!gameState.badges.includes(badgeId)) {
                gameState.badges.push(badgeId);
                saveGameState();
                const badge = badgesData.find(b => b.id === badgeId);
                if (badge) {
                    showBadgePopup(badge.name, badge.emoji);
                }
            }
        }

        function showBadgePopup(name, emoji) {
            const badgeModal = document.getElementById('badge-modal');
            const badgeIcon = badgeModal.querySelector('.badge-icon');
            const badgeName = document.getElementById('badge-name');
            const badgeCloseBtn = document.getElementById('badge-close-btn');

            badgeIcon.textContent = emoji;
            badgeName.textContent = name;
            playSound(badgeSound);
            badgeModal.classList.remove('hidden');

            badgeCloseBtn.onclick = () => {
                badgeModal.classList.add('hidden');
            };
        }
        
        function performLogout() {
            localStorage.removeItem('iugGameProgress');
            location.reload();
        }

        function showLogoutConfirmation() {
            const logoutModal = document.getElementById('logout-confirm-modal');
            logoutModal.classList.remove('hidden');
        }

        function restoreGameSession() {
            if (loadGameState() && gameState.uniquePlayerId) {
                landingScreen.classList.add('hidden');
                startScreen.classList.add('hidden');
                gameSceneContainer.classList.remove('hidden');
                statusBar.classList.remove('hidden');

                updatePlayerStats();

                const sceneToRender = gameState.currentScene && gameData[gameState.currentScene] ? gameState.currentScene : 'map';
                const indexToRender = gameState.currentSubQuestionIndex || 0;

                showModal('أهلاً بعودتك!', `مرحباً ${gameState.playerName}، يسعدنا رؤيتك مجدداً! سنكمل من حيث توقفنا.`, () => {
                    const sceneMappings = {
                        'admission-info': renderAdmissionInfoScene,
                        'exchange-info': renderExchangeInfoScene,
                        'grants-info': renderGrantsInfoScene,
                        'faculties-list': renderFacultiesListScene,
                        'studentaffairs-info': renderStudentAffairsInfoScene,
                        'player-profile': renderPlayerProfile
                    };

                    const parentScene = sceneParentMap[sceneToRender] || sceneToRender;

                    if (sceneMappings[parentScene]) {
                        sceneMappings[parentScene]();
                    } else if (gameData[parentScene] && gameData[parentScene].nextScene) {
                            renderScene(parentScene, indexToRender, false);
                    }
                    else if (sceneToRender) {
                        renderScene(sceneToRender, indexToRender, false);
                    } else {
                        renderScene('map', 0, false);
                    }
                });
                return true;
            }
            return false;
        }
        
        function startGame(event) {
            event.preventDefault();
            const nameInput = document.getElementById('name').value.trim();
            const phoneInput = document.getElementById('phone').value.trim();
            const tawjihiYearInput = document.getElementById('tawjihi-year').value.trim();
            const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
            if (nameInput.length < 5 || !nameRegex.test(nameInput)) {
                showModal('تنبيه بخصوص الاسم', 'هذا الاسم سيتم استخدامه في الشهادة، الرجاء كتابته بشكل صحيح (5 حروف على الأقل، وبدون أرقام أو رموز).', null);
                return;
            }
            const phoneRegex = /^05[9|6|4]\d{7}$/;
            if (!phoneRegex.test(phoneInput)) {
                showModal('خطأ في رقم الجوال', 'الرجاء إدخال رقم جوال صحيح يبدأ بـ 059 أو 056 أو 054.', null);
                return;
            }
            const currentYear = new Date().getFullYear();
            const tawjihiYear = parseInt(tawjihiYearInput);
            if (isNaN(tawjihiYear) || tawjihiYear < 2000 || tawjihiYear > currentYear + 1) {
                showModal('خطأ في سنة التوجيهي', 'الرجاء إدخال سنة توجيهي منطقية (مثال: 2024).', null);
                return;
            }
            const startButton = event.target.querySelector('.action-button');
            startButton.disabled = true;
            startButton.innerHTML = 'جاري التسجيل... <span class="spinner"></span>';

            registerPlayer(nameInput, phoneInput, tawjihiYearInput)
                .then(data => {
                    if (data.result === 'success' && data.uniqueId) {
                        gameState.playerName = nameInput;
                        gameState.playerPhone = phoneInput;
                        gameState.tawjihiYear = tawjihiYearInput;
                        gameState.uniquePlayerId = data.uniqueId;
                        saveGameState();
                        updatePlayerStats();
                        startScreen.classList.add('hidden');
                        document.getElementById('guide-selection-screen').classList.remove('hidden');
                    } else {
                        showModal('خطأ في التسجيل', 'حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.', null);
                        startButton.disabled = false;
                        startButton.innerHTML = 'ابدأ الرحلة!';
                    }
                })
                .catch(error => {
                    showModal('خطأ في الاتصال', 'فشل الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت.', null);
                    startButton.disabled = false;
                    startButton.innerHTML = 'ابدأ الرحلة!';
                });
        }

        function showEndScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            const endScene = document.getElementById('end-scene');
            const finalMessage = document.getElementById('final-message');
            finalMessage.textContent = `أحسنت يا ${gameState.playerName}! لقد أتممت رحلتك بنجاح وأظهرت معرفة ممتازة بالجامعة الإسلامية. رصيدك النهائي هو ${gameState.score} نقطة، ويمكنك الآن الحصول على شهادة المشاركة.`;
            endScene.classList.remove('hidden');
            if (gameState.uniquePlayerId) {
                updatePlayerScore(gameState.uniquePlayerId, gameState.score);
            } else {
                console.error("خطأ: لا يمكن تحديث النتيجة لعدم وجود رقم تعريفي.");
            }
        }

        function clearTimer() {
            if (questionTimer) {
                clearInterval(questionTimer);
                questionTimer = null;
            }
        }

        function handleTimeUp() {
            playSound(incorrectSound);

            const sceneId = gameState.currentScene;
            const sceneElement = document.getElementById(`${sceneId}-scene`);
            if (!sceneElement) return;

            const allOptionButtons = sceneElement.querySelectorAll('.option-btn');
            allOptionButtons.forEach(btn => btn.disabled = true);
            
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            const helpBtn = currentSceneEl.querySelector('#guide-help-btn');
            if (helpBtn) helpBtn.disabled = true;

            let sceneData = gameData[sceneId];
            if (Array.isArray(sceneData)) {
                sceneData = sceneData[gameState.currentSubQuestionIndex];
            }
            const correctAnswer = sceneData.correctAnswer;
            const correctButton = sceneElement.querySelector(`.option-btn[data-answer="${correctAnswer}"]`);
            if (correctButton) {
                correctButton.classList.add('correct');
            }

            const modalCallback = () => {
                if (Array.isArray(gameData[sceneId])) {
                    const nextQuestionIndex = gameState.currentSubQuestionIndex + 1;
                    if (nextQuestionIndex < gameData[sceneId].length) {
                        renderScene(sceneId, nextQuestionIndex);
                    } else {
                        const parentScene = sceneParentMap[sceneId];
                        if (parentScene) {
                            const siblingScenes = Object.values(gameData[parentScene].nextScene);
                            const allSiblingsCompleted = siblingScenes.every(siblingId => isStageCompleted(siblingId));
                            if (allSiblingsCompleted) {
                                showModal("إنجاز مذهل!", `لقد أكملت كل تحديات هذا القسم بنجاح. لنعد إلى الخريطة.`, () => renderScene('map'));
                            } else {
                                showModal("انتهت الأسئلة", `لقد أتممت هذا التحدي. يمكنك الآن تجربة النوع الآخر من الأسئلة أو العودة للخريطة.`, () => renderScene(parentScene));
                            }
                        } else {
                            showModal("إنجاز رائع!", `لقد أكملت جميع تحديات هذا القسم بنجاح. لنعد إلى الخريطة.`, () => renderScene('map'));
                        }
                    }
                } else {
                    renderScene('map');
                }
            };
            
            showModal("انتهى الوقت!", "للأسف، لقد نفد الوقت. الإجابة الصحيحة تم تحديدها. استعد للسؤال التالي.", modalCallback);
        }

        function startTimer() {
            clearTimer();
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            if (!currentSceneEl) return; 

            const timerContainer = currentSceneEl.querySelector('#timer-container');
            const timerDisplay = currentSceneEl.querySelector('#timer-display');
            if (!timerDisplay || !timerContainer) return;

            timeLeft = TIME_LIMIT;
            startTime = Date.now();
            timerDisplay.textContent = timeLeft;
            timerContainer.classList.remove('low-time');

            questionTimer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                if (timeLeft <= 5 && timeLeft > 0) {
                    timerContainer.classList.add('low-time');
                }
                if (timeLeft < 0) {
                    clearTimer();
                    handleTimeUp();
                }
            }, 1000);
        }

        function renderScene(sceneId, questionIndex = 0, pushState = true) {
            clearTimer();
            gameState.currentQuestionAttempts = 0;
            if (questionIndex === 0) stagePoints = 0;

            if (questionIndex === 0 && sceneId !== 'map' && guideMessages[sceneId]) {
                const messageSceneId = sceneParentMap[sceneId] || sceneId;
                if(guideMessages[messageSceneId] && guideMessages[messageSceneId][gameState.selectedGuide]) {
                    setTimeout(() => showGuideModal('رسالة من مرشدك', guideMessages[messageSceneId][gameState.selectedGuide]), 500);
                }
            }
            playSound(transitionSound);
            
            if (pushState) history.pushState({ scene: sceneId, index: questionIndex }, '');
            
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));

            if ((sceneId.includes('questions')) && questionIndex === 0 && !adShownThisSession) {
                const sceneData = gameData[sceneId];
                if (sceneData.length > 3) {
                    const minTrigger = 1; 
                    const maxTrigger = Math.min(sceneData.length - 2, 4); 
                    adTriggerQuestionIndex = Math.floor(Math.random() * (maxTrigger - minTrigger + 1)) + minTrigger;
                }
            }

            const sceneMappings = {
                'map': () => document.getElementById('map-scene').classList.remove('hidden'),
                'faculties-list': renderFacultiesListScene,
                'grants-info': renderGrantsInfoScene,
                'admission-info': renderAdmissionInfoScene,
                'exchange-info': renderExchangeInfoScene,
                'studentaffairs-info': renderStudentAffairsInfoScene,
                'player-profile': renderPlayerProfile,
                'stadium': renderStadiumGame,
            };

            if (sceneMappings[sceneId]) {
                sceneMappings[sceneId]();
                return;
            }

            const sceneElementId = `${sceneId}-scene`;
            const sceneElement = document.getElementById(sceneElementId);
            let sceneData = gameData[sceneId];

            if (!sceneData || !sceneElement) {
                console.error(`Scene data or element not found for: ${sceneId}`);
                showModal("خطأ", "حدث خطأ غير متوقع، سنعيدك للخريطة.", () => renderScene('map'));
                return;
            }

            gameState.currentScene = sceneId;
            if (Array.isArray(sceneData)) {
                gameState.currentSubQuestionIndex = questionIndex;
                sceneData = sceneData[questionIndex];
            } else {
                gameState.currentSubQuestionIndex = 0;
            }
            saveGameState();

            let progressInfoHTML = '';
            if (Array.isArray(gameData[sceneId])) {
                const totalQuestions = gameData[sceneId].length;
                const currentQuestionNumber = questionIndex + 1;
                const currentProgress = (currentQuestionNumber / totalQuestions) * 100;
                const progressBarHTML = `<div class="progress-bar-container"><div class="progress-bar" style="width: ${currentProgress}%"></div></div>`;
                const questionCounterHTML = `<div class="question-counter">السؤال ${currentQuestionNumber} من ${totalQuestions}</div>`;
                const timerHTML = `<div id="timer-container" class="timer-container"><span id="timer-display">${TIME_LIMIT}</span></div>`;
                progressInfoHTML = `<div class="progress-info">${progressBarHTML}${timerHTML}${questionCounterHTML}</div>`;
            }
            
            let optionsHTML = '';
            let delay = 0;
            let optionKeys = Object.keys(sceneData.options);

            if (sceneData.correctAnswer !== null) optionKeys = shuffleArray(optionKeys);

            for (const key of optionKeys) {
                optionsHTML += `<button class="option-btn" data-answer="${key}" style="animation-delay: ${delay}s">${sceneData.options[key]}</button>`;
                delay += 0.1;
            }
            
            let powerUpsHTML = '';
            if (sceneData.correctAnswer !== null) {
                const stageId = sceneParentMap[sceneId] || sceneId;
                if (!gameState.powerUps[stageId]) {
                    gameState.powerUps[stageId] = { fiftyFifty: 3, extraTime: 3, skip: 3 };
                }
                const stagePowerUps = gameState.powerUps[stageId];
                const isMCQ4 = Object.keys(sceneData.options).length === 4;
                powerUpsHTML = `
                    <div class="power-ups-container">
                        <button id="guide-help-btn" class="guide-help-button">💡 مساعدة المرشد (-0.5 نقطة)</button>
                        <button id="fifty-fifty-btn" class="power-up-btn" ${stagePowerUps.fiftyFifty > 0 && isMCQ4 ? '' : 'disabled'}>50/50 <span class="power-up-counter">${stagePowerUps.fiftyFifty}</span></button>
                        <button id="extra-time-btn" class="power-up-btn" ${stagePowerUps.extraTime > 0 ? '' : 'disabled'}>⏱️ +15 <span class="power-up-counter">${stagePowerUps.extraTime}</span></button>
                        <button id="skip-q-btn" class="power-up-btn" ${stagePowerUps.skip > 0 ? '' : 'disabled'}>⏭️ تخطي <span class="power-up-counter">${stagePowerUps.skip}</span></button>
                    </div>`;
            }

            sceneElement.innerHTML = `
                <img src="${sceneData.image}" alt="صورة مشهد ${sceneId}" class="scene-image" loading="lazy">
                <div class="scene-content">
                    ${progressInfoHTML}
                    <p class="scene-title">${sceneData.question}</p>
                    ${powerUpsHTML}
                    <div class="options-container">${optionsHTML}</div>
                </div>`;

            sceneElement.classList.remove('hidden');
            sceneElement.querySelector('.options-container').addEventListener('click', handleAnswer);
            
            const powerUpsContainer = sceneElement.querySelector('.power-ups-container');
            if (powerUpsContainer) {
                powerUpsContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.power-up-btn, .guide-help-button');
                    if (!button) return;
                    switch (button.id) {
                        case 'guide-help-btn': useGuideHelp(); break;
                        case 'fifty-fifty-btn': useFiftyFifty(); break;
                        case 'extra-time-btn': useExtraTime(); break;
                        case 'skip-q-btn': useSkipQuestion(); break;
                    }
                });
            }
            startTimer();
        }

        function renderStudentAffairsInfoScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            const sceneElement = document.getElementById('studentaffairs-info-scene');
            sceneElement.classList.remove('hidden');
            gameState.currentScene = 'studentaffairs-info';
            saveGameState();

            const container = document.getElementById('studentaffairs-info-container');
            container.innerHTML = `<nav class="tabs-nav"><button class="tab-btn active" data-tab="about">عن العمادة</button><button class="tab-btn" data-tab="services">الأقسام والخدمات</button><button class="tab-btn" data-tab="gallery">ألبوم الصور</button></nav><div class="tabs-content"><div id="tab-about" class="tab-pane active"><div class="info-scene-container"><p>أهلاً وسهلاً بكم في عمادة شئون الطلبة بالجامعة الإسلامية. تعد عمادة شؤون الطلبة من أهم العمادات بالجامعة المختصة بالطلبة، فهي  تعنى بتقديم الخدمات الطلابية، والتي تسهم في تنظيم الأنشطة اللامنهجية والأعمال التطوعية، وتساعد الطالب في إنجاز المعاملات وتسهيل عملية التسجيل والتسجيل للمنح الداخلية والخارجية والقروض الجامعية.</p><h3 class="info-section-title">تاريخ ومهام</h3><p>أنشئت عمادة شؤون الطلبة في عام 1981م. وقد أنيطت بها المهام التالية:</p><ul class="info-list"><li>دراسة مشكلات الطلبة الاقتصادية، ووضع الحلول لها من خلال قسم البحث الاجتماعي.</li><li>الإشراف على النشاط الثقافي والاجتماعي والرياضي والفني بالتنسيق مع مجالس الطلبة.</li><li>متابعة اجتماعيات مجالس الطلبة، وإرشادهم إلى طريق العمل السليم.</li><li>النظر في مشكلات الطلبة اليومية العامة والخاصة، وتنسيب الحلول الملائمة لها.</li><li>الإشراف على حسن استخدام مرافق الجامعة استخداماً سليماً.</li><li>مراقبة انتظام الدراسة، وبحث ظاهرة التغيب، وتنسيب الحلول الملائمة لها.</li></ul></div></div><div id="tab-services" class="tab-pane"><div class="info-scene-container"><div class="accordion-item"><div class="accordion-header">قسم البحث الاجتماعي "خدمات الطلبة"</div><div class="accordion-content"><p>يعد قسم البحث الاجتماعي البوابة الأساسية لمساعدة الطلبة ماليا بهدف إكمال المسيرة التعليمية. وبناءً عليه يتم الاستفادة من خدمات العمادة المتعلقة بالمنح الخارجية والقروض الجامعية.</p><strong>الخطوات المتبعة للاستفادة:</strong><ul class="info-list"><li>يتم توجيه الطلبة لتعبئة استمارة البحث الاجتماعي الكترونيا.</li><li>يقوم الطالب بإرفاق الأوراق الثبوتية الأصلية الكترونيا.</li><li>يقوم الطالب بإحضار الأوراق الثبوتية وتسلميها لموظفي البحث الاجتماعي، لتدقيقها.</li><li>يتم تصنيف حالات الطلبة وفق معايير خاصة تحدد الحالة الاجتماعية للطالب.</li><li>بناء على نتيجة البحث الاجتماعي لكل طالب يتم ترشيح الطلبة للمنح الخارجية.</li></ul></div></div><div class="accordion-item"><div class="accordion-header">الأنشطة اللامنهجية والعمل التطوعي</div><div class="accordion-content"><p>هي مجموعة من الفعاليات المتنوعة الثقافية – الفنية – التدريبية – العلمية والترويحية التي تهدف إلى تنمية شخصية الطالب الجامعي وتزويده بالمهارات والخبرات واستثمار اوقات الفراغ. أما العمل التطوعي فهو أحد المساقات التي تشرف عليها العمادة لتكليف الطلبة بأنشطة وفعاليات تطوعية تصقل مواهبهم.</p></div></div><div class="accordion-item"><div class="accordion-header">قسم النشاط الرياضي</div><div class="accordion-content"><p>لقد أولت عمادة شئون الطلبة الأنشطة الرياضية الفردية والجماعية اهتماما كبيرا لما لها من أثر في صقل وتهذيب شخصية الطالب. ومن أهدافه بث الروح الرياضية، تنمية مواهب الطلبة، غرس المفاهيم الصحيحة للتربية البدنية، نشر الوعي الرياضي، وإعداد المنتخبات لتمثيل الجامعة.</p></div></div><div class="accordion-item"><div class="accordion-header">وحدة التوجيه والارشاد</div><div class="accordion-content"><p>تقدم الوحدة الخدمات التالية للطلبة:</p><ul class="info-list"><li>إرشاد وتوجيه وتوعية.</li><li>استشارات.</li><li>ندوات ومحاضرات.</li><li>ورش عمل.</li><li>دورات ذات علاقة.</li></ul></div></div></div></div><div id="tab-gallery" class="tab-pane"><div class="info-scene-container"><div class="photo-gallery"><img src="https://i.imgur.com/uStyY1N.jpeg" alt="استقبال الطلبة" loading="lazy"><img src="https://i.imgur.com/vHqB3Tj.jpeg" alt="زيارة طلبة الثانوية" loading="lazy"><img src="https://i.imgur.com/1mYdPo3.jpeg" alt="فريق الدبكة" loading="lazy"><img src="https://i.imgur.com/QhXpBmg.jpeg" alt="زيارة الصالة الرياضية" loading="lazy"><img src="https://i.imgur.com/A6mJTOq.jpeg" alt="زيارة لرئيس الجامعة" loading="lazy"><img src="https://i.imgur.com/o1bFjHj.jpeg" alt="استقبال في الأيام الترفيهية" loading="lazy"><img src="https://i.imgur.com/L8JgY1g.jpeg" alt="فريق شئون الطلبة" loading="lazy"><img src="https://i.imgur.com/w2Y9w5E.jpeg" alt="ضيافة طلبة الثانوية" loading="lazy"></div></div></div></div>`;
            
            const tabsContainer = sceneElement.querySelector('.tabs-nav');
            const accordions = sceneElement.querySelectorAll('.accordion-item');

            tabsContainer.addEventListener('click', e => {
                if (e.target.classList.contains('tab-btn')) {
                    tabsContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    sceneElement.querySelector('.tab-pane.active').classList.remove('active');
                    const targetTab = e.target.dataset.tab;
                    sceneElement.querySelector(`#tab-${targetTab}`).classList.add('active');
                }
            });

            accordions.forEach(item => {
                const header = item.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    const content = item.querySelector('.accordion-content');
                    if (item.classList.toggle('active')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0px';
                    }
                });
            });

document.getElementById('start-studentaffairs-quiz-btn').onclick = () => {
    const stageId = 'studentaffairs';
    const subScenes = Object.values(gameData[stageId].nextScene);
    if (subScenes.every(id => gameState.stageScores[id] !== undefined)) {
        const totalScore = subScenes.reduce((acc, id) => acc + (gameState.stageScores[id] || 0), 0);
        const totalQuestions = subScenes.reduce((acc, id) => acc + gameData[id].length, 0);
        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك الإجمالية: ${totalScore} / ${totalQuestions}</strong>`, null);
    } else {
        renderScene(stageId);
    }
};        }

        function renderAdmissionInfoScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            const sceneElement = document.getElementById('admission-info-scene');
            sceneElement.classList.remove('hidden');
            gameState.currentScene = 'admission-info';
            saveGameState();
            const container = document.getElementById('admission-info-container');
            container.innerHTML = ''; 
            admissionInfoData.forEach(facultyData => {
                const card = document.createElement('div');
                card.className = 'admission-card';
                let specializationsHTML = '<ul>';
                facultyData.specializations.forEach(spec => {
                    const isNew = spec.name.includes('(جديد)');
                    specializationsHTML += `<li><span class="specialization">${spec.name.replace(' (جديد)', '')} ${isNew ? '<span class="score new-major">جديد</span>' : ''}</span><span class="score">${spec.score}</span></li>`;
                });
                specializationsHTML += '</ul>';
                card.innerHTML = `<h3>${facultyData.faculty}</h3>${specializationsHTML}`;
                container.appendChild(card);
            });
document.getElementById('start-admission-quiz-btn').onclick = () => {
    const stageId = 'admission';
    const subScenes = Object.values(gameData[stageId].nextScene);
    if (subScenes.every(id => gameState.stageScores[id] !== undefined)) {
        const totalScore = subScenes.reduce((acc, id) => acc + (gameState.stageScores[id] || 0), 0);
        const totalQuestions = subScenes.reduce((acc, id) => acc + gameData[id].length, 0);
        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك الإجمالية: ${totalScore} / ${totalQuestions}</strong>`, null);
    } else {
        renderScene(stageId);
    }
};        }

        function renderGrantsInfoScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            document.getElementById('grants-info-scene').classList.remove('hidden');
            gameState.currentScene = 'grants-info';
            saveGameState();
document.getElementById('start-grants-quiz-btn').onclick = () => {
    const stageId = 'grants';
    if (gameState.stageScores[stageId] !== undefined) {
        const score = gameState.stageScores[stageId];
        const total = gameData[stageId].length;
        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك في هذه المرحلة: ${score} / ${total}</strong>`, null);
    } else {
        renderScene(stageId);
    }
};        }
        
        function renderExchangeInfoScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            document.getElementById('exchange-info-scene').classList.remove('hidden');
            gameState.currentScene = 'exchange-info';
            saveGameState();
document.getElementById('start-exchange-quiz-btn').onclick = () => {
    const stageId = 'exchange';
    const subScenes = Object.values(gameData[stageId].nextScene);
    if (subScenes.every(id => gameState.stageScores[id] !== undefined)) {
        const totalScore = subScenes.reduce((acc, id) => acc + (gameState.stageScores[id] || 0), 0);
        const totalQuestions = subScenes.reduce((acc, id) => acc + gameData[id].length, 0);
        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك الإجمالية: ${totalScore} / ${totalQuestions}</strong>`, null);
    } else {
        renderScene(stageId);
    }
};        }
        
        function handleAnswer(event) {
            const targetButton = event.target.closest('.option-btn');
            if (!targetButton || targetButton.disabled) return;

            const sceneId = gameState.currentScene;
            let sceneData = gameData[sceneId];
            let questionId;

            if (Array.isArray(sceneData)) {
                sceneData = sceneData[gameState.currentSubQuestionIndex];
                questionId = sceneData.id;
            } else {
                questionId = sceneData.id || sceneId;
            }

            const selectedAnswer = targetButton.dataset.answer;

            if (sceneData.nextScene && sceneData.nextScene[selectedAnswer]) {
                const nextSceneId = sceneData.nextScene[selectedAnswer];
                // التحقق قبل الدخول للتحدي الفرعي
                if (gameState.stageScores[nextSceneId] !== undefined) {
                    const score = gameState.stageScores[nextSceneId];
                    const total = gameData[nextSceneId].length;
                    showModal("التحدي مكتمل", `لقد أكملت هذا التحدي مسبقاً. <br><strong>نتيجتك في هذه المرحلة: ${score} / ${total}</strong>`, null);
                } else {
                    renderScene(nextSceneId);
                }
                return;
            }

            clearTimer();
            gameState.currentQuestionAttempts++;
            saveGameState();

            const allOptionButtons = document.querySelectorAll(`#${sceneId}-scene .option-btn`);
            const helpBtn = document.getElementById('guide-help-btn');
            const isCorrect = selectedAnswer === sceneData.correctAnswer;
            
            const proceedToNextStep = () => {
                if ((sceneId.includes('questions')) && !adShownThisSession && gameState.currentSubQuestionIndex === adTriggerQuestionIndex) {
                    setTimeout(showAdModal, 500);
                }

                if (sceneId === 'gate') {
                    playWelcomeVideo();
                } else if (Array.isArray(gameData[sceneId])) {
                    const nextQuestionIndex = gameState.currentSubQuestionIndex + 1;
                    if (nextQuestionIndex >= gameData[sceneId].length) {
                        // حفظ النتيجة عند إكمال المرحلة للمرة الأولى
                        if (gameState.stageScores[sceneId] === undefined) {
                            gameState.stageScores[sceneId] = stagePoints;
                            saveGameState();
                        }
                        giveBadgesForStage(sceneId);
                    }
                    if (nextQuestionIndex < gameData[sceneId].length) {
                        renderScene(sceneId, nextQuestionIndex);
                    } else {
                        const parentScene = sceneParentMap[sceneId];
                        if (parentScene) {
                            const allSiblingsCompleted = Object.values(gameData[parentScene].nextScene).every(isStageCompleted);
                            if (allSiblingsCompleted) {
                                showModal("إنجاز مذهل!", `لقد أكملت كل تحديات هذا القسم بنجاح. لنعد إلى الخريطة.`, () => renderScene('map'));
                            } else {
                                showModal("رائع!", `لقد أتممت هذا التحدي. يمكنك الآن تجربة النوع الآخر من الأسئلة أو العودة للخريطة.`, () => renderScene(parentScene));
                            }
                        } else {
                            showModal("إنجاز رائع!", `لقد أكملت جميع تحديات هذا القسم بنجاح. لنعد إلى الخريطة.`, () => renderScene('map'));
                        }
                    }
                } else {
                    renderScene('map');
                }
            };

            if (isCorrect) {
                playSound(correctSound);
                targetButton.classList.add('correct');
                allOptionButtons.forEach(btn => btn.disabled = true);
                if (helpBtn) helpBtn.disabled = true;

                if (!gameState.answeredQuestions.has(questionId)) {
                    gameState.score += sceneData.points;
                    stagePoints += sceneData.points;
                    gameState.answeredQuestions.add(questionId);
                    updatePlayerStats();
                    updatePlayerScore(gameState.uniquePlayerId, gameState.score);
                    saveGameState();
                }

                let feedback = (sceneData.correctFeedback && (sceneData.correctFeedback[gameState.selectedGuide] || sceneData.correctFeedback.default)) || 'إجابة صحيحة!';
                showModal("إجابة صحيحة!", feedback, proceedToNextStep);

            } else {
                playSound(incorrectSound);
                targetButton.classList.add('incorrect');
                targetButton.disabled = true;

                if (gameState.currentQuestionAttempts < 2) {
                    showModal("محاولة خاطئة", "لديك فرصة أخرى للإجابة. ركّز جيداً!", null);
                } else {
                    allOptionButtons.forEach(btn => btn.disabled = true);
                    if (helpBtn) helpBtn.disabled = true;

                    const correctButton = document.querySelector(`#${sceneId}-scene .option-btn[data-answer="${sceneData.correctAnswer}"]`);
                    if (correctButton) {
                        correctButton.classList.add('correct');
                    }

                    let feedback = (sceneData.incorrectFeedback && (sceneData.incorrectFeedback[gameState.selectedGuide] || sceneData.incorrectFeedback.default)) || 'إجابة غير صحيحة.';
                    showModal("إجابة خاطئة", feedback + "<br>الإجابة الصحيحة تم تحديدها بالأخضر.", proceedToNextStep);
                }
            }
        }
        
        function giveBadgesForStage(stageId) {
            const totalPoints = gameData[stageId].length;

            if (stagePoints === totalPoints) {
                addBadge('perfect-score');
            }
            
            const mainStageId = sceneParentMap[stageId] || stageId;
            switch (mainStageId) {
                case 'library': addBadge('library-expert'); break;
                case 'faculties': addBadge('faculties-expert'); break;
                case 'grants': addBadge('grants-master'); break;
                case 'exchange': addBadge('exchange-master'); break;
                case 'studentaffairs': addBadge('student-affairs-master'); break;
                case 'admission': addBadge('admission-master'); break;
            }
            
            const completionTime = (Date.now() - startTime) / 1000;
            if (completionTime < 120 && totalPoints > 3) {
                 addBadge('speed-runner');
            }
        }

        function useGuideHelp() {
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            if (!currentSceneEl) return;
            const helpBtn = currentSceneEl.querySelector('#guide-help-btn');

            if (!helpBtn || helpBtn.disabled) return;

            if (gameState.score < 0.5) {
                showModal("رصيد غير كافٍ", "عذراً، لا تملك نصف نقطة لاستخدام المساعدة.", null);
                return;
            }

            helpBtn.disabled = true;
            gameState.score -= 0.5;
            updatePlayerStats();
            updatePlayerScore(gameState.uniquePlayerId, gameState.score);
            saveGameState();

            let sceneData = gameData[gameState.currentScene];
            if (Array.isArray(sceneData)) {
                sceneData = sceneData[gameState.currentSubQuestionIndex];
            }

            const hint = (sceneData.hint && (sceneData.hint[gameState.selectedGuide] || sceneData.hint.default)) || 'فكر جيداً، يمكنك فعلها!';
            showGuideModal("مساعدة من مرشدك", hint, false);
        }

        function useFiftyFifty() {
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            const btn = currentSceneEl.querySelector('#fifty-fifty-btn');
            if (!btn || btn.disabled) return;

            const stageId = sceneParentMap[gameState.currentScene] || gameState.currentScene;
            if (gameState.powerUps[stageId].fiftyFifty <= 0) return;

            gameState.powerUps[stageId].fiftyFifty--;
            saveGameState();
            btn.querySelector('.power-up-counter').textContent = gameState.powerUps[stageId].fiftyFifty;
            btn.disabled = true;

            let sceneData = gameData[gameState.currentScene];
            if (Array.isArray(sceneData)) {
                sceneData = sceneData[gameState.currentSubQuestionIndex];
            }
            
            const options = document.querySelectorAll(`#${gameState.currentScene}-scene .option-btn`);
            const wrongAnswers = [];
            options.forEach(opt => {
                if (opt.dataset.answer !== sceneData.correctAnswer) {
                    wrongAnswers.push(opt);
                }
            });

            shuffleArray(wrongAnswers).slice(0, 2).forEach(opt => {
                opt.disabled = true;
                opt.style.opacity = '0.5';
            });
        }

        function useExtraTime() {
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            const btn = currentSceneEl.querySelector('#extra-time-btn');   
            if (!btn || btn.disabled) return;

            const stageId = sceneParentMap[gameState.currentScene] || gameState.currentScene;
            if (gameState.powerUps[stageId].extraTime <= 0) return;

            gameState.powerUps[stageId].extraTime--;
            saveGameState();
            btn.querySelector('.power-up-counter').textContent = gameState.powerUps[stageId].extraTime;
            btn.disabled = true;
            
            timeLeft += 15;
            const timerDisplay = document.getElementById('timer-display');
            if(timerDisplay) timerDisplay.textContent = timeLeft;
        }

        function useSkipQuestion() {
            const currentSceneEl = document.getElementById(`${gameState.currentScene}-scene`);
            const btn = currentSceneEl.querySelector('#skip-q-btn');
            if (!btn || btn.disabled) return;

            const stageId = sceneParentMap[gameState.currentScene] || gameState.currentScene;
            if (gameState.powerUps[stageId].skip <= 0) return;
            
            if (gameState.score < 0.5) {
                showModal("رصيد غير كافٍ", "عذراً، لا تملك نصف نقطة لتخطي السؤال.", null);
                return;
            }

            gameState.powerUps[stageId].skip--;
            gameState.score -= 0.5;
            updatePlayerStats();
            updatePlayerScore(gameState.uniquePlayerId, gameState.score);
            saveGameState();
            clearTimer();
            
            const sceneId = gameState.currentScene;
            const nextQuestionIndex = gameState.currentSubQuestionIndex + 1;

            if (nextQuestionIndex < gameData[sceneId].length) {
                renderScene(sceneId, nextQuestionIndex);
            } else {
                showModal("انتهت الأسئلة", "لقد أنهيت هذه المرحلة.", () => renderScene('map'));
            }
        }

        function updatePlayerStats() {
            playerNameDisplay.textContent = gameState.playerName;
            playerScoreDisplay.innerHTML = `💰 ${gameState.score} نقطة`;
        }

        function showModal(title, text, callback) {
            modalTitle.textContent = title;
            modalText.innerHTML = text;
            modal.classList.remove('hidden');
            modalCloseBtn.onclick = () => {
                modal.classList.add('hidden');
                if (callback) callback();
            };
        }

        function endVideoAndProceed() {
            welcomeVideo.pause();
            welcomeVideo.currentTime = 0;
            videoOverlay.classList.add('hidden');
            renderScene('map');
        }

        function playWelcomeVideo() {
            videoOverlay.classList.remove('hidden');
            welcomeVideo.play();
            welcomeVideo.onended = endVideoAndProceed;
            skipVideoBtn.onclick = endVideoAndProceed;
        }

        function showAdModal() {
            adModal.classList.remove('hidden');
            adShownThisSession = true;
        }
        
        function isStageCompleted(stageId) {
            let stageData = gameData[stageId];
            if (!stageData) return false;
            if (stageId === 'stadium') {
                return gameState.answeredQuestions.has('stadium-game-completed');
            }
            if (stageId === 'faculties' || stageId === 'exchange' || stageId === 'admission' || stageId === 'studentaffairs') {
                const subScenes = Object.values(stageData.nextScene);
                return subScenes.every(s => isStageCompleted(s));
            }
            if (Array.isArray(stageData)) {
                return stageData.every(q => gameState.answeredQuestions.has(q.id));
            }
             if (stageData.id) {
                return gameState.answeredQuestions.has(stageData.id);
            }
            return false;
        }
        
        playerForm.addEventListener('submit', startGame);
document.getElementById('map-scene').addEventListener('click', (e) => {
            const button = e.target.closest('.option-btn');
            if (!button) return;
            const destination = button.dataset.destination;
            
            const mainDestinationId = destination.replace('-info', '').replace('-list', '');

            if (destination === 'stadium') {
                renderStadiumSelection();
                return;
            }

            // --- بداية الكود الجديد للتحقق ---
            const stageData = gameData[mainDestinationId];
            if (stageData) {
                if (Array.isArray(stageData)) { // للأسئلة المباشرة مثل المكتبة
                    if (gameState.stageScores[mainDestinationId] !== undefined) {
                        const score = gameState.stageScores[mainDestinationId];
                        const total = stageData.length;
                        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك في هذه المرحلة: ${score} / ${total}</strong>`, null);
                        return;
                    }
                } else if (stageData.nextScene) { // للمراحل التي تحتوي على قائمة تحديات
                    const subScenes = Object.values(stageData.nextScene);
                    if (subScenes.every(id => gameState.stageScores[id] !== undefined)) {
                        const totalScore = subScenes.reduce((acc, id) => acc + (gameState.stageScores[id] || 0), 0);
                        const totalQuestions = subScenes.reduce((acc, id) => acc + gameData[id].length, 0);
                        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك الإجمالية: ${totalScore} / ${totalQuestions}</strong>`, null);
                        return;
                    }
                }
            }
            // --- نهاية الكود الجديد للتحقق ---

            const destinationData = gameData[destination];

            if (destinationData && destinationData.isInfoScreen) {
                const sceneMappings = {
                    'grants-info': renderGrantsInfoScene,
                    'admission-info': renderAdmissionInfoScene,
                    'faculties-list': renderFacultiesListScene,
                    'exchange-info': renderExchangeInfoScene,
                    'studentaffairs-info': renderStudentAffairsInfoScene,
                };
                if(sceneMappings[destination]) sceneMappings[destination]();
                return;
            }
            
            if (destination === 'certificate') {
                const libraryComplete = isStageCompleted('library');
                const facultiesComplete = isStageCompleted('faculties');
                const exchangeComplete = isStageCompleted('exchange');
                const admissionComplete = isStageCompleted('admission');
                const studentAffairsComplete = isStageCompleted('studentaffairs');
                const allKeyStagesComplete = libraryComplete && facultiesComplete && exchangeComplete && admissionComplete && studentAffairsComplete;
                const scoreSufficient = gameState.score >= 50;
                if (allKeyStagesComplete && scoreSufficient) {
                    showEndScene();
                } else {
                    let message = "الطريق إلى الشهادة لم يكتمل بعد!<br><br>للحصول عليها، يجب عليك تحقيق شرطين:<br>";
                    message += `1. إكمال التحديات الرئيسية.<br>`;
                    message += `(${libraryComplete ? '✔️' : '❌'} المكتبة) | (${facultiesComplete ? '✔️' : '❌'} الكليات) | (${exchangeComplete ? '✔️' : '❌'} التبادل) | (${admissionComplete ? '✔️' : '❌'} القبول) | (${studentAffairsComplete ? '✔️' : '❌'} شؤون الطلبة)<br>`;
                    message += `2. الحصول على 50 نقطة على الأقل (رصيدك: ${gameState.score}). (${scoreSufficient ? '✔️' : '❌'})<br><br>استمر في رحلتك!`;
                    showModal("شروط الحصول على الشهادة", message, null);
                }
                return;
            }
            
            if (destinationData && destinationData.isUnderConstruction) {
                showModal("قيد الإنشاء!", "هذا الجزء من الجامعة سيتم افتتاحه قريباً في التحديثات القادمة للعبة.", null);
                return;
            }

            if (destinationData) renderScene(mainDestinationId);
            else showModal("خطأ", "لم يتم العثور على الوجهة المطلوبة.", null);
        });
        
        document.addEventListener('click', function(event) {
            if (event.target.closest('#show-register-btn')) {
                landingScreen.classList.add('hidden');
                startScreen.classList.remove('hidden');
            }
            if (event.target.closest('#logout-btn')) {
                event.preventDefault();
                showLogoutConfirmation();
            }
            if (event.target.closest('#reset-progress-btn')) {
                event.preventDefault();
                showLogoutConfirmation();
            }
            if (event.target.closest('#back-to-map-btn')) {
                event.preventDefault();
                renderScene('map');
            }
            if (event.target.closest('#profile-btn')) {
                event.preventDefault();
                renderPlayerProfile();
            }
        });

      adModal.addEventListener('click', (event) => {
            // يغلق النافذة عند الضغط على زر الإغلاق، أو زر التخطي، أو الخلفية
            if (event.target.closest('.close-ad-btn, #ad-skip-btn') || event.target.id === 'ad-modal') {
                adModal.classList.add('hidden');
            }
        });

        // إضافة وظيفة لزر "التفاصيل"
        document.getElementById('ad-details-btn').addEventListener('click', () => {
            adModal.classList.add('hidden'); // أولاً، أغلق نافذة الإعلان
            // ثانياً، اعرض صفحة الويب باستخدام الدالة الجديدة
            showWebsiteInIframe('https://www.iugaza.edu.ps/p29815/', 'إعلان كلية الهندسة');
        });
        
        document.getElementById('new-player-btn').addEventListener('click', performLogout);

        const logoutModal = document.getElementById('logout-confirm-modal');
        document.getElementById('confirm-logout-btn').addEventListener('click', performLogout);
        document.getElementById('cancel-logout-btn').addEventListener('click', () => {
            logoutModal.classList.add('hidden');
        });
        
        document.getElementById('profile-back-btn').addEventListener('click', () => {
            document.getElementById('player-profile-scene').classList.add('hidden');
            renderScene('map');
        });
        
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.scene) {
                const sceneMappings = {
                    'admission-info': renderAdmissionInfoScene,
                    'exchange-info': renderExchangeInfoScene,
                    'grants-info': renderGrantsInfoScene,
                    'faculties-list': renderFacultiesListScene,
                    'studentaffairs-info': renderStudentAffairsInfoScene,
                    'player-profile': renderPlayerProfile
                };
                if (sceneMappings[event.state.scene]) {
                    sceneMappings[event.state.scene]();
                } else {
                    renderScene(event.state.scene, event.state.index, false);
                }
            } else {
                if (gameState.uniquePlayerId) renderScene('map', 0, false);
                else location.reload();
            }
        });
        
        function populateFacultiesList() {
            const container = document.getElementById('faculties-grid-container');
            let content = '';
            collegesData.forEach(college => {
                content += `<div class="college-info-card" data-url="${college.url}" data-name="${college.name}"><h3>${college.emoji} ${college.name}</h3><p>${college.description}</p></div>`;
            });
            container.innerHTML = content;
        }

        function renderFacultiesListScene() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            document.getElementById('faculties-list-scene').classList.remove('hidden');
            gameState.currentScene = 'faculties-list';
            saveGameState();
        }
        function showWebsiteInIframe(url, title) {
            const websiteScene = document.getElementById('college-website-scene');
            websiteScene.innerHTML = `<div class="scene-content"><div class="website-view-header"><button id="back-to-last-scene-btn" class="action-button" style="width: auto; padding: 10px 20px;"><span class="btn-icon">➡️</span> رجوع</button></div><div class="loader-container" id="loader-container"><div class="loader"></div><p>جاري تحميل الصفحة...</p></div></div>`;
            
            document.getElementById('back-to-last-scene-btn').addEventListener('click', () => {
                websiteScene.classList.add('hidden');
                websiteScene.innerHTML = '';
                // يعيد اللاعب إلى آخر مشهد كان فيه قبل فتح الموقع
                const lastSceneId = gameState.currentScene;
                const sceneElement = document.getElementById(`${lastSceneId}-scene`);
                if(sceneElement) {
                    sceneElement.classList.remove('hidden');
                } else {
                    renderScene('map'); // كخيار احتياطي
                }
            });

            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            websiteScene.classList.remove('hidden');

            const iframe = document.createElement('iframe');
            iframe.id = 'college-website-iframe';
            iframe.src = url;
            iframe.title = title;
            iframe.onload = () => {
                const loaderContainer = document.getElementById('loader-container');
                if (loaderContainer) loaderContainer.remove();
                iframe.classList.add('loaded');
            };
            websiteScene.querySelector('.scene-content').appendChild(iframe);
        }
document.getElementById('faculties-grid-container').addEventListener('click', (e) => {
    const card = e.target.closest('.college-info-card');
    if (!card) return;
    
    const url = card.dataset.url;
    const name = card.dataset.name;

    if (name === 'كلية الاقتصاد والعلوم الإدارية') {
        window.location.href = 'economics.html';
    } else if (name === 'كلية الطب') { 
        window.location.href = 'medicine.html'; 
    } else if (name === 'كلية الهندسة') {
        window.location.href = 'engineering.html';
    } else if (name === 'كلية تكنولوجيا المعلومات') {
        window.location.href = 'it.html';
    } else if (name === 'كلية التمريض') {
        window.location.href = 'nursing.html';
    } else if (name === 'كلية العلوم الصحية') {
        window.location.href = 'health-sciences.html';
    } else if (name === 'كلية العلوم') {
        window.location.href = 'science.html';
    } else if (name === 'كلية الآداب') {
        window.location.href = 'arts.html';
    } else if (name === 'كلية الشريعة والقانون') {
        window.location.href = 'sharia.html';
    } else if (name === 'كلية أصول الدين') {
        window.location.href = 'osool.html';
    } else if (name === 'كلية التربية') { // <<<--- السطر الجديد
        window.location.href = 'education.html'; // <<<--- السطر الجديد
    } else {
        showWebsiteInIframe(url, name);
    }
});

        document.getElementById('proceed-to-faculties-quiz-btn').addEventListener('click', () => {
    const stageId = 'faculties';
    const subScenes = Object.values(gameData[stageId].nextScene);
    if (subScenes.every(id => gameState.stageScores[id] !== undefined)) {
        const totalScore = subScenes.reduce((acc, id) => acc + (gameState.stageScores[id] || 0), 0);
        const totalQuestions = subScenes.reduce((acc, id) => acc + gameData[id].length, 0);
        showModal("المرحلة مكتملة", `لقد أكملت هذه المرحلة مسبقاً. <br><strong>نتيجتك الإجمالية: ${totalScore} / ${totalQuestions}</strong>`, null);
    } else {
        renderScene(stageId);
    }
});
        function populateGuideSelection() {
            const container = document.querySelector('#guide-selection-screen .guides-container');
            container.innerHTML = ''; 
            allGuides.forEach(guide => {
                const cardHTML = `
                    <div class="guide-card" data-guide="${guide.id}">
                        <div class="guide-icon">${guide.emoji}</div>
                        <h3>${guide.name}</h3>
                        <span>${guide.college}</span>
                        <p>${guide.description}</p>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        }

        const guideSelectionScreen = document.getElementById('guide-selection-screen');
        const guidesContainer = guideSelectionScreen.querySelector('.guides-container');
        const confirmGuideBtn = document.getElementById('confirm-guide-btn');
        
        guidesContainer.addEventListener('click', (e) => {
            const selectedCard = e.target.closest('.guide-card');
            if (!selectedCard) return;
            guidesContainer.querySelectorAll('.guide-card').forEach(card => card.classList.remove('selected'));
            selectedCard.classList.add('selected');
            gameState.selectedGuide = selectedCard.dataset.guide;
            confirmGuideBtn.disabled = false;
        });

        confirmGuideBtn.addEventListener('click', () => {
            if (gameState.selectedGuide) {
                saveGameState();
                guideSelectionScreen.classList.add('hidden');
                gameSceneContainer.classList.remove('hidden');
                statusBar.classList.remove('hidden');
                showModal(`اختيار موفق!`, `مرشدك الأكاديمي سيكون بجانبك. لنبدأ الرحلة الآن!`, () => {
                    renderScene('gate');
                });
            }
        });
        
        function renderPlayerProfile() {
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            const profileScene = document.getElementById('player-profile-scene');
            profileScene.classList.remove('hidden');

            const profileName = document.getElementById('profile-name');
            const profileEmoji = document.getElementById('profile-emoji');
            const profileScore = document.getElementById('profile-score');
            const profileTawjihiYear = document.getElementById('profile-tawjihi-year');

            const selectedGuideInfo = allGuides.find(g => g.id === gameState.selectedGuide);
            profileName.textContent = gameState.playerName;
            profileEmoji.textContent = selectedGuideInfo ? selectedGuideInfo.emoji : '👤';
            profileScore.textContent = `${gameState.score} نقطة`;
            profileTawjihiYear.textContent = gameState.tawjihiYear;

            const badgesContainer = document.getElementById('badges-container');
            const noBadgesMsg = document.getElementById('no-badges-msg');
            badgesContainer.innerHTML = ''; 
            
            if (gameState.badges.length > 0) {
                noBadgesMsg.classList.add('hidden');
                gameState.badges.forEach(badgeId => {
                    const badgeInfo = badgesData.find(b => b.id === badgeId);
                    if (badgeInfo) {
                        const badgeCard = document.createElement('div');
                        badgeCard.className = 'badge-card';
                        badgeCard.innerHTML = `<span class="badge-icon">${badgeInfo.emoji}</span><p>${badgeInfo.name}</p>`;
                        badgesContainer.appendChild(badgeCard);
                    }
                });
            } else {
                noBadgesMsg.classList.remove('hidden');
            }
            gameState.currentScene = 'player-profile';
            saveGameState();
        }
    // ========== بداية كود لعبة الملعب ==========
            // ========== بداية كود لعبة الملعب ==========

        // --- الدالة الجديدة التي ستضيفها ---
        function renderStadiumSelection() {
            const sceneElement = document.getElementById('stadium-selection-scene');
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            sceneElement.classList.remove('hidden');
            gameState.currentScene = 'stadium-selection';
            saveGameState();

            sceneElement.innerHTML = `
                <div class="scene-content">
                    <h2 class="scene-title">🏟️ منطقة الألعاب</h2>
                    <p>أهلاً بك في منطقة الألعاب الترفيهية بالجامعة. اختر التحدي الذي تود خوضه!</p>
                    <div class="game-choices-container">
                        <div class="game-choice-card" data-game="penalties">
                            <span class="icon">⚽</span>
                            <h3>تحدي ركلات الترجيح</h3>
                            <p>اختبر دقتك في تسديد الكرات وحاول هزيمة الحارس.</p>
                        </div>
                        <div class="game-choice-card" data-game="memory">
                            <span class="icon">🧠</span>
                            <h3>تحدي الذاكرة</h3>
                            <p>قوّي ذاكرتك وابحث عن أزواج رموز الكليات المتشابهة.</p>
                        </div>
                    </div>
                    <button id="back-to-map-from-stadium" class="action-button secondary" style="max-width: 250px;">
                        <span class="btn-icon">🗺️</span> العودة إلى الخريطة
                    </button>
                </div>`;

            sceneElement.querySelector('.game-choices-container').addEventListener('click', (e) => {
                const selectedCard = e.target.closest('.game-choice-card');
                if (!selectedCard) return;

                const game = selectedCard.dataset.game;
                if (game === 'penalties') {
                    renderStadiumGame();
                } else if (game === 'memory') {
                    renderMemoryGame();
                }
            });
            
            sceneElement.querySelector('#back-to-map-from-stadium').addEventListener('click', () => renderScene('map'));
        }
        function renderStadiumGame() {
            const sceneElement = document.getElementById('stadium-scene');
            if (!sceneElement) {
                console.error("ERROR: Stadium scene element not found!");
                showModal("خطأ فني", "لم يتم العثور على عنصر اللعبة. الرجاء التأكد من عدم وجود أخطاء في ملف HTML.", () => renderScene('map'));
                return;
            }
            
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            sceneElement.classList.remove('hidden');
            gameState.currentScene = 'stadium';
            saveGameState();

            let playerScore = 0;
            let keeperScore = 0;
            let shotsTaken = 0;
            const totalShots = 5;

            sceneElement.innerHTML = `
                <div class="scene-content">
                    <div class="stadium-score-board">
                        <div id="stadium-player-score">أنت: 0</div>
                        <div id="stadium-keeper-score">الحارس: 0</div>
                    </div>
                    <div class="stadium-game-board" id="stadium-game-board">
                        <div class="stadium-goal" id="stadium-goal">
                            <div class="stadium-keeper" id="stadium-keeper">🧍‍♂️✋</div>
                        </div>
                        <div class="stadium-ball" id="stadium-ball">🏃‍♂️⚽</div>
                    </div>
                    <div class="stadium-controls">
                        <p class="stadium-instructions" id="stadium-instructions">انقر على المرمى للتسديد!</p>
                        <div class="stadium-shots-indicator" id="stadium-shots-indicator"></div>
                    </div>
                </div>`;

            const gameBoard = document.getElementById('stadium-game-board');
            const goal = document.getElementById('stadium-goal');
            const ball = document.getElementById('stadium-ball');
            const keeper = document.getElementById('stadium-keeper');
            const instructions = document.getElementById('stadium-instructions');
            const playerScoreDisplay = document.getElementById('stadium-player-score');
            const keeperScoreDisplay = document.getElementById('stadium-keeper-score');
            const shotsIndicator = document.getElementById('stadium-shots-indicator');
            
            for (let i = 0; i < totalShots; i++) {
                shotsIndicator.innerHTML += `<div class="shot-dot" id="shot-dot-${i}"></div>`;
            }

            const handleShot = (e) => {
                if (!ball || !keeper) return; // Safety check

                ball.textContent = '⚽'; 
                ball.style.fontSize = '25px'; 

                if (shotsTaken >= totalShots) return;
                goal.removeEventListener('click', handleShot);
                instructions.textContent = '...';

                const rect = goal.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const keeperPositions = [-80, 0, 80];
                const randomPos = keeperPositions[Math.floor(Math.random() * keeperPositions.length)];
                keeper.style.left = `calc(50% + ${randomPos}px)`;

                ball.style.bottom = `${(rect.height - y) + (gameBoard.clientHeight - rect.height)}px`;
                ball.style.left = `${(x / rect.width) * 100}%`;
                ball.style.transform = `translateX(-50%) scale(0.5)`;

                setTimeout(() => {
                    const goalThird = rect.width / 3;
                    const shotPosition = x < goalThird ? -80 : (x > goalThird * 2 ? 80 : 0);
                    
                    const dot = document.getElementById(`shot-dot-${shotsTaken}`);
                    if (shotPosition !== randomPos) {
                        playSound(correctSound);
                        playerScore++;
                        instructions.textContent = '⚽ هــــدف!';
                        dot.classList.add('goal');
                    } else {
                        playSound(incorrectSound);
                        keeperScore++;
                        instructions.textContent = '🧤 تصدى لها الحارس!';
                        dot.classList.add('saved');
                        keeper.textContent = '🧍‍♂️✋⚽';
                    }

                    shotsTaken++;
                    playerScoreDisplay.textContent = `أنت: ${playerScore}`;
                    keeperScoreDisplay.textContent = `الحارس: ${keeperScore}`;

                    if (shotsTaken >= totalShots) {
                        endStadiumGame();
                    } else {
                        resetShot();
                    }
                }, 600);
            };
            
            const resetShot = () => {
                setTimeout(() => {
                    if (!ball || !keeper) return; // Safety check
                    keeper.textContent = '🧍‍♂️✋';
                    ball.textContent = '🏃‍♂️⚽';
                    ball.style.fontSize = '35px';
                    ball.style.transition = 'none';
                    ball.style.bottom = '15px';
                    ball.style.left = '50%';
                    ball.style.transform = 'translateX(-50%) scale(1)';
                    keeper.style.left = '50%';

                    setTimeout(() => {
                        ball.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                        instructions.textContent = `التسديدة ${shotsTaken + 1}/${totalShots}. انقر على المرمى!`;
                        goal.addEventListener('click', handleShot);
                    }, 50);
                }, 1000);
            };

           const endStadiumGame = () => {
                const wasAlreadyCompleted = gameState.answeredQuestions.has('stadium-game-completed');
                
                // نسجل أن اللعبة اكتملت بغض النظر عن النتيجة
                gameState.answeredQuestions.add('stadium-game-completed');

                let title, message;
                if (playerScore > keeperScore) {
                    title = '🏆 فوز رائع!';
                    
                    // نتحقق إذا كانت هذه هي المرة الأولى للفوز
                    if (!wasAlreadyCompleted) {
                        message = `لقد فزت بنتيجة ${playerScore} - ${keeperScore}. تم إضافة 5 نقاط إلى رصيدك!`;
                        gameState.score += 5;
                        updatePlayerStats();
                        updatePlayerScore(gameState.uniquePlayerId, gameState.score);
                    } else {
                        message = `لقد فزت مجدداً بنتيجة ${playerScore} - ${keeperScore}. لعب رائع! (لا يتم إضافة نقاط جديدة للعب المتكرر).`;
                    }

                } else {
                    title = '🥅 محاولة جيدة!';
                    message = `انتهت المباراة بالتعادل أو الخسارة. حظاً أوفر في المرة القادمة!`;
                }
                
                saveGameState();
                
                setTimeout(() => {
showModal(title, message + "<br><br>يمكنك الآن تجربة لعبة أخرى أو العودة للخريطة.", () => renderStadiumSelection());                }, 1500);
            };
            goal.addEventListener('click', handleShot);
        }
        // ========== نهاية كود لعبة الملعب ==========

        // ========== بداية كود لعبة الذاكرة ==========
        // ========== بداية كود لعبة الذاكرة ==========
        function renderMemoryGame() {
            const sceneElement = document.getElementById('memory-game-scene');
            document.querySelectorAll('.game-stage').forEach(stage => stage.classList.add('hidden'));
            sceneElement.classList.remove('hidden');
            gameState.currentScene = 'memory-game';
            saveGameState();

            const cardEmojis = shuffleArray(collegesData).slice(0, 8).map(c => c.emoji);
            const gameCards = shuffleArray([...cardEmojis, ...cardEmojis]);

            let gridHTML = '';
            gameCards.forEach(emoji => {
                gridHTML += `
                    <div class="memory-card" data-emoji="${emoji}">
                        <div class="card-face card-front"></div>
                        <div class="card-face card-back">${emoji}</div>
                    </div>`;
            });

            sceneElement.innerHTML = `
                <div class="scene-content">
                    <h2 class="memory-game-title">تحدي الذاكرة!</h2>
                    <p style="text-align:center; margin-bottom: 20px;">استعد! سيتم عرض البطاقات لمدة 4 ثوانٍ...</p>
                    <div class="memory-grid">${gridHTML}</div>
                </div>`;
                
            const grid = sceneElement.querySelector('.memory-grid');
            const allCards = sceneElement.querySelectorAll('.memory-card');
            let flippedCards = [];
            let matchedPairs = 0;
            let lockBoard = true; // --- نبدأ واللوحة مقفلة

            // --- الكود الجديد يبدأ هنا ---

            // 1. عرض كل البطاقات فوراً عند بدء اللعبة
            allCards.forEach(card => card.classList.add('flipped'));

            // 2. بعد 4 ثوانٍ، يتم إخفاء جميع البطاقات
            setTimeout(() => {
                allCards.forEach(card => card.classList.remove('flipped'));
                
                // تحديث الرسالة
                sceneElement.querySelector('p').textContent = 'ابحث عن أزواج الرموز المتشابهة لكليات الجامعة.';

                // 3. ننتظر انتهاء حركة الإخفاء (600ms) ثم نسمح باللعب
                setTimeout(() => {
                    lockBoard = false;
                }, 600); // هذه المدة يجب أن تطابق مدة الانتقال في CSS
                
            }, 4000); // 4 ثوانٍ

            // --- الكود الجديد ينتهي هنا ---

            const handleCardClick = (e) => {
                const clickedCard = e.target.closest('.memory-card');
                // الآن هذا السطر سيمنع اللعب خلال فترة العرض الأولية
                if (lockBoard || !clickedCard || clickedCard.classList.contains('flipped')) return;

                clickedCard.classList.add('flipped');
                flippedCards.push(clickedCard);

                if (flippedCards.length === 2) {
                    lockBoard = true;
                    checkForMatch();
                }
            };

            const checkForMatch = () => {
                const [cardOne, cardTwo] = flippedCards;
                const isMatch = cardOne.dataset.emoji === cardTwo.dataset.emoji;

                if (isMatch) {
                    disableCards();
                } else {
                    unflipCards();
                }
            };
            
            const disableCards = () => {
                playSound(correctSound);
                flippedCards.forEach(card => {
                    card.classList.add('matched');
                });
                matchedPairs++;
                resetTurn();
                if (matchedPairs === cardEmojis.length) {
                    endMemoryGame();
                }
            };

            const unflipCards = () => {
                setTimeout(() => {
                    playSound(incorrectSound);
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                    resetTurn();
                }, 1000);
            };

            const resetTurn = () => {
                flippedCards = [];
                lockBoard = false;
            };

            const endMemoryGame = () => {
                setTimeout(() => {
showModal('🧠 ذاكرة قوية!', 'لقد أتممت تحدي الذاكرة بنجاح. أنت الآن عائد إلى منطقة الألعاب.', () => renderStadiumSelection());                }, 500);
            };
            
            grid.addEventListener('click', handleCardClick);
        }
        // ========== نهاية كود لعبة الذاكرة ==========
        // ========== نهاية كود لعبة الذاكرة ==========

        document.body.addEventListener('click', unlockAudio, { once: true });
        
        function getUrlsForNextScenes(sceneId, questionIndex = 0) {
            const urls = [];
            const sceneData = gameData[sceneId];
            if (Array.isArray(sceneData)) {
                for (let i = questionIndex + 1; i < Math.min(questionIndex + 3, sceneData.length); i++) {
                    if (sceneData[i] && sceneData[i].image) urls.push(sceneData[i].image);
                }
            } else if (sceneData && sceneData.nextScene) {
                const nextSceneIds = Object.values(sceneData.nextScene);
                nextSceneIds.forEach(id => {
                    const nextSceneData = gameData[id];
                    if (Array.isArray(nextSceneData) && nextSceneData[0] && nextSceneData[0].image) {
                        urls.push(nextSceneData[0].image);
                    }
                });
            }
            return urls;
        }

        preloadImage('assets/images/all_q.webp');
        preloadImage('assets/images/hares 1.webp');
        preloadImage('assets/images/library_question.webp');

        populateFacultiesList();
        populateGuideSelection();
        restoreGameSession();
    });