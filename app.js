const LANGUAGE_STORAGE_KEY = 'shipintel-language';
function getInitialLanguage() {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    if (requestedLanguage === 'ar' || requestedLanguage === 'en') return requestedLanguage;
    try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'ar';
    } catch (error) {
        console.warn('تعذر استرجاع اللغة المحفوظة؛ سيتم استخدام العربية.', error);
        return 'ar';
    }
}

let currentLang = getInitialLanguage();
let activeFilter = 'all';
let routeStatusFilter = 'all';
let routeSearchTerm = '';
let activeTrackingIndex = null;
let authMode = 'login';
let cloudUser = null;
let cloudProfile = null;
let cloudConfigured = false;
let localDemoMode = false;
let passwordRecoveryRequested = false;
let accessDenied = false;
const STORAGE_KEY = 'shipintel-shipments';
const LOCAL_DEMO_SESSION_KEY = 'shipintel-local-demo-session';

const translations = {
    ar: {
        pageTitle: 'ShipIntel AI | لوحة الشحنات',
        landingPageTitle: 'ShipIntel AI | تسجيل الدخول',
        directCall: 'اتصال مباشر',
        home: 'الرئيسية', landingEyebrow: 'ذكاء بحري، ورؤية أوضح',
        landingTitle: 'كل شحناتك،', landingTitleAccent: 'في مسار واضح.',
        landingDescription: 'تابع حركة الشحنات والحاويات من المغادرة حتى الوصول، وأدر تفاصيل رحلاتك من لوحة واحدة.',
        landingCta: 'تسجيل الدخول',
        landingFootnote: 'منصة واحدة لمتابعة عملياتك اللوجستية بثقة.',
        brandCaption: 'ذكاء للعمليات البحرية',
        mapNav: 'المسارات', pricingNav: 'الباقات', assistantNav: 'الدعم',
        whatsappContact: 'تواصل عبر واتساب',
        directContact: 'اتصال مباشر / طلب عرض سعر',
        whatsappMessage: 'السلام عليكم أبا عمار، أرغب في معرفة تفاصيل الأسعار وخيارات النسخة التجريبية لمنصة ShipIntel AI، وإمكانية استخدامها لمتابعة الشحنات والتخليص الجمركي في ميناء المكلا.',
        contactConfigurationError: 'تعذر إعداد روابط التواصل حاليًا. يرجى مراجعة إعدادات رقم التواصل.',
        authInviteOnly: 'دخول مخصص لموظفي التخليص والشحن المصرّح لهم. تُنشأ الحسابات بدعوة من مدير النظام.',
        authUnavailable: 'لوحة التشغيل مقفلة حتى إعداد خدمة الدخول الآمن. لا تستخدم وضعًا تجريبيًا على الموقع المنشور.',
        authNotAuthorized: 'هذا الحساب غير مخوّل لدخول لوحة التخليص. اطلب من مدير النظام اعتماد صلاحية موظف تخليص.',
        authGenericError: 'تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور أو اطلب المساعدة من مدير النظام.',
        authInvalidEmail: 'أدخل بريدًا إلكترونيًا صحيحًا.',
        authInvalidPassword: 'يجب ألا تقل كلمة المرور عن ٨ أحرف.',
        authExpiredError: 'انتهت صلاحية رابط الدخول. اطلب رابطًا جديدًا من مدير النظام.',
        authRateLimitError: 'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.',
        authNetworkError: 'تعذر الاتصال بخدمة الدخول. تحقق من اتصال الإنترنت ثم أعد المحاولة.',
        localDemoSignOutError: 'تعذر إنهاء جلسة العرض المحلية. أغلق علامة التبويب لإنهائها.',
        shipmentPermissionError: 'ليس لديك صلاحية تنفيذ هذا الإجراء.',
        shipmentDuplicateError: 'رقم البوليصة أو الحاوية مسجل مسبقًا.',
        planFree: 'نسخة تجريبية',
        planGrowthPrice: 'حسب احتياجات التشغيل',
        pricingDisclaimer: 'الخطط المعروضة تصورية للتعريف بالخدمة؛ اطلب عرض السعر عبر واتساب أو الاتصال المباشر.',
        landingMapEyebrow: 'رؤية تشغيلية أوضح',
        landingMapTitle: 'المسارات البحرية، في لمحة واحدة',
        landingMapDescription: 'تصوّر عالمي للممرات البحرية الرئيسية التي تربط آسيا والشرق الأوسط وأوروبا والأمريكتين.',
        operationsEyebrow: 'مركز العمليات البحرية',
        operationsTitle: 'لوحة عمليات المسارات',
        operationsDescription: 'تابع الرحلات المسجلة وحالاتها ومواعيد الوصول المتوقعة في عرض تشغيلي موحّد.',
        operationsLocalMode: 'بيانات السجلات الحالية',
        operationsNotLive: 'لا يوجد ربط بمواقع السفن الحية',
        operationsLastUpdated: 'آخر تحديث محلي',
        operationsTotal: 'إجمالي الرحلات', operationsAtSea: 'في عرض البحر',
        operationsCustoms: 'قيد التخليص', operationsArrived: 'وصلت الميناء',
        operationsTableTitle: 'جدول العمليات',
        operationsTableDescription: 'الرحلات مبنية على بيانات الشحنات المسجلة في لوحة ShipIntel.',
        operationsSearchPlaceholder: 'ابحث باسم السفينة أو الحاوية أو الرحلة',
        operationsFilterLabel: 'تصفية الرحلات حسب الحالة',
        operationsAtSeaFilter: '🌊 في عرض البحر',
        operationsCustomsFilter: '📋 قيد التخليص',
        operationsArrivedFilter: '⚓ وصلت الميناء',
        operationsVesselVoyage: 'السفينة / رقم الرحلة',
        operationsMapKicker: 'عرض تكتيكي',
        operationsMapTitle: 'خريطة الممرات',
        operationsMapNote: 'الخريطة تعرض الممرات التوضيحية ولا تمثل مواقع الرحلات المسجلة.',
        operationsVesselNotRecorded: 'اسم السفينة غير مسجل',
        operationsVoyageLabel: 'رحلة',
        operationsReferenceLabel: 'مرجع الشحنة',
        operationsStatusSea: '🌊 في عرض البحر',
        operationsStatusCustoms: '📋 قيد التخليص',
        operationsStatusArrived: '⚓ وصلت الميناء',
        operationsNoResults: 'لا توجد رحلات تطابق البحث أو التصفية.',
        operationsResultCount: '{count} رحلة',
        operationsSummary: 'ملخص الرحلات',
        mapLegend: 'مفتاح الخريطة',
        mapDemoLabel: 'تصوّر للممرات · ليس تتبعًا حيًا',
        mapAriaLabel: 'تصوّر عالمي لممرات الشحن البحري بين القارات',
        mapNetworkView: 'شبكة الممرات البحرية', mapNetworkStatus: 'نظرة على الشبكة',
        mapGlobalCorridors: 'ممرات التجارة العالمية', mapCorridorCount: 'ممرات رئيسية',
        mapWaypointCount: 'مراكز عبور',
        mapInteractionHint: 'انقر على السفن لعرض تفاصيلها، واختر مسارًا لإبرازه.',
        mapRouteAsiaEurope: 'آسيا · قناة السويس · أوروبا',
        mapRouteTranspacific: 'آسيا · المحيط الهادئ · أمريكا',
        mapRouteAtlantic: 'أمريكا · الأطلسي · أوروبا',
        mapRouteSouth: 'آسيا · المحيط الهندي · الجنوب',
        mapIllustrativeNote: 'المسارات والسفن المتحركة للعرض البصري فقط، وليست بيانات مواقع آنية.',
        mapCityShanghai: 'شنغهاي', mapCitySingapore: 'سنغافورة', mapCityJeddah: 'جدة',
        mapCityRotterdam: 'روتردام', mapCityNewYork: 'نيويورك', mapCityLosAngeles: 'لوس أنجلوس',
        mapRegionAmericas: 'الأمريكتان', mapRegionEurope: 'أوروبا',
        mapRegionMiddleEast: 'الشرق الأوسط', mapRegionAsia: 'آسيا',
        mapVesselNameAsia: 'السفينة التجريبية · المحيط الهندي',
        mapVesselNameAtlantic: 'السفينة التجريبية · الأطلسي',
        mapVesselAriaAsia: 'اعرض تفاصيل سفينة المحيط الهندي التجريبية',
        mapVesselAriaAtlantic: 'اعرض تفاصيل سفينة الأطلسي التجريبية',
        mapVesselDemo: 'سفينة توضيحية · حركة محاكاة',
        mapVesselRouteLabel: 'المسار', mapVesselSpeedLabel: 'السرعة المحاكاة',
        mapVesselEtaLabel: 'الوقت التقديري',
        mapVesselSpeedAsia: '18 عقدة · محاكاة', mapVesselEtaAsia: '4 أيام · تجريبي',
        mapVesselSpeedAtlantic: '16 عقدة · محاكاة', mapVesselEtaAtlantic: '6 أيام · تجريبي',
        mapVesselDataNote: 'هذه بيانات تجريبية للعرض فقط، وليست تتبعًا حيًا.',
        mapVesselClose: 'إغلاق تفاصيل السفينة',
        pricingEyebrow: 'حلول تشغيلية', pricingTitle: 'حلول تناسب أعمالك',
        pricingDescription: 'اختر الباقة المناسبة لاحتياجات متابعة الشحنات والتخليص.',
        planTrialEyebrow: 'ابدأ بدون التزام',
        planTrial: 'الباقة التجريبية',
        planTrialDescription: 'جرّب المنصة بكامل الوضوح ولمدة محدودة.',
        planTrialPrice: '$0', planTrialPriceUnit: 'مجاناً',
        planTrialDuration: '7 أيام كاملة',
        planTrialLimit: 'حد أقصى 50 شحنة',
        planTrialNoTerms: 'بلا شروط أو التزام مالي',
        planTrialNoCard: 'لا حاجة إلى بطاقة ائتمانية',
        planBasicEyebrow: 'الخيار الأساسي',
        planBasic: 'الباقة الأساسية',
        planBasicDescription: 'متابعة عملية لشحناتك مع دعم أساسي.',
        planBasicPrice: '$56', planBasicPriceUnit: 'شهرياً',
        planRecommended: 'الأكثر طلباً',
        planBasicDuration: 'اشتراك لمدة شهر',
        planBasicQueries: '1,500 استعلام شحنة',
        planBasicUpdates: 'تحديث آلي للشحنة قبل الشحن الجاري والتخليص وتخليص الجاهز للاستعلام',
        planBasicSupport: 'دعم فني أساسي',
        planPlusEyebrow: 'إمكانات موسّعة',
        planPlus: 'باقة بلس',
        planPlusDescription: 'سعة مفتوحة ومتابعة متقدمة لعملياتك.',
        planPlusPrice: '$149', planPlusPriceUnit: 'باقة بلس',
        planPlusQueries: 'استعلامات شحنات مفتوحة وغير محدودة بكميات ضخمة (بدون حد أقصى)',
        planPlusResponse: 'استجابة ذكية متقدمة',
        planPlusTracking: 'تتبع حركة الشحن',
        planPlusSupport: 'دعم فني على مدار الساعة',
        choosePlan: 'ابدأ الآن', contactUs: 'تواصل معنا',
        pricingDisclaimer: 'للاشتراك أو الاستفسار عن أي باقة، تواصل معنا عبر واتساب.',
        backToTop: 'العودة إلى الأعلى',
        landingNav: 'روابط الموقع',
        visualRoute: 'مسار الشحنة', visualVessel: 'سفينة شحن · في عرض البحر',
        visualOrigin: 'ميناء المغادرة', visualDestination: 'ميناء الوصول',
        visualArriving: 'الوصول المتوقع', visualOnTime: 'على المسار',
        mainMenu: 'القائمة الرئيسية', workspace: 'مساحة العمل', overview: 'نظرة عامة',
        shipments: 'تتبع الشحنات', trackingCenter: 'مركز متابعة الشحنات',
        localDataNote: 'وضع تجريبي محلي؛ لا تُزامَن البيانات مع السحابة قبل إعداد Supabase.',
        operationsCenter: 'مركز العمليات اللوجستية', dashboardTitle: 'لوحة متابعة الشحنات',
        dashboardIntro: 'نظرة واضحة على حركة شحناتك من المغادرة حتى الوصول.',
        currentUser: 'المستخدم الحالي', adminRole: 'مدير النظام', shipmentSummary: 'ملخص الشحنات',
        statsDescription: 'إحصاءات محدثة من قائمة الشحنات الحالية', totalShipments: 'إجمالي الشحنات',
        allRegistered: 'كل الشحنات المسجلة', inTransit: 'في الطريق البحري',
        shipmentsInTransit: 'شحنات قيد النقل', customsClearance: 'التخليص الجمركي',
        arrivalProcessing: 'الشحنات ضمن إجراءات الوصول', delivered: 'تم التسليم',
        completedShipments: 'شحنات مكتملة', trackShipment: 'تتبع شحنة',
        trackingInstructions: 'أدخل رقم البوليصة أو الحاوية لعرض آخر تفاصيل الشحنة.',
        searchPlaceholder: 'مثال: MSKU-982341 أو MSKU7382910', searchLabel: 'رقم بوليصة الشحن أو الحاوية',
        showTracking: 'عرض التتبع', recentShipments: 'الشحنات الأخيرة',
        manageShipments: 'إدارة تفاصيل الشحنات ومتابعة حالتها', exportCsv: 'تصدير التقرير',
        addShipment: '＋ إضافة شحنة جديدة', filterByStatus: 'تصفية حسب الحالة', all: 'الكل',
        inTransitShort: 'في الطريق', billOfLading: 'رقم البوليصة', containerNumber: 'رقم الحاوية',
        carrier: 'الخط الملاحي', originPort: 'ميناء المغادرة', destinationPort: 'ميناء الوصول',
        eta: 'الوصول المتوقع', status: 'الحالة', actions: 'الإجراءات',
        footerNote: 'ShipIntel AI · نموذج أولي ببيانات محلية، ولا يتصل حاليًا بمصادر تتبع شركات الشحن.',
        authTitle: 'تسجيل دخول الموظفين',
        authDescription: 'سجّل الدخول لعرض شحناتك المحفوظة بأمان.',
        authEmail: 'اسم المستخدم',
        authPassword: 'كلمة المرور (8 أحرف على الأقل)',
        authSubmit: 'تسجيل الدخول',
        authForgotPassword: 'نسيت كلمة المرور؟',
        authResetTitle: 'إعادة تعيين كلمة المرور',
        authResetDescription: 'اختر كلمة مرور جديدة لحسابك.',
        authResetSubmit: 'حفظ كلمة المرور الجديدة',
        authResetComplete: 'تم تحديث كلمة المرور.',
        authSignOut: 'تسجيل الخروج',
        authConfigMissing: 'إعدادات قاعدة البيانات غير مكتملة. أكمل خطوات الإعداد في README.md.',
        authCheckEmail: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.',
        authResetSent: 'إذا كان البريد مسجلًا، فستصلك رسالة لإعادة تعيين كلمة المرور.',
        authLoading: 'جارٍ تحميل الحساب والشحنات...',
        authRoleAdmin: 'مدير النظام',
        authRoleAgent: 'موظف تخليص',
        authRoleUser: 'مستخدم',
        cloudSaveError: 'تعذر حفظ الشحنة في قاعدة البيانات. تحقق من الاتصال والصلاحيات.',
        cloudDeleteError: 'تعذر حذف الشحنة من قاعدة البيانات. تحقق من الاتصال والصلاحيات.',
        cloudLoadError: 'تعذر تحميل الشحنات من قاعدة البيانات. أعد المحاولة أو تحقق من إعداد Supabase.',
        cloudReady: 'الشحنات محفوظة في قاعدة البيانات السحابية.',
        cloudFooterNote: 'قاعدة بيانات سحابية مفعّلة · لم يتم الربط بعد بمصادر تتبع شركات الشحن.',
        trackingDetails: 'تفاصيل التتبع', journeySummary: 'ملخص الشحنة ومحطات رحلتها',
        close: 'إغلاق', shipmentJourney: 'مسار الشحنة', enterShipmentDetails: 'أدخل بيانات الشحنة لتظهر في لوحة المتابعة.',
        saveShipment: 'حفظ الشحنة', cancel: 'إلغاء', track: 'تتبع', edit: 'تعديل',
        delete: 'حذف', confirmDelete: 'هل أنت متأكد من حذف هذه الشحنة؟',
        noResults: 'لا توجد شحنات تطابق البحث أو التصفية.',
        emptySearch: 'أدخل رقم البوليصة أو رقم الحاوية أولاً.',
        shipmentNotFound: 'لم يتم العثور على شحنة بهذا الرقم ضمن البيانات المسجلة.',
        duplicateShipment: 'رقم البوليصة ورقم الحاوية يجب أن يكونا فريدين لكل شحنة.',
        storageError: 'تعذر حفظ التغييرات في هذا المتصفح.',
        loadError: 'تعذر تحميل البيانات المحفوظة؛ يتم عرض بيانات تجريبية.',
        addTitle: 'إضافة شحنة', editTitle: 'تعديل الشحنة',
        billOfLadingValue: 'رقم البوليصة', containerValue: 'رقم الحاوية',
        carrierValue: 'الخط الملاحي', etaValue: 'موعد الوصول المتوقع',
        originValue: 'ميناء المغادرة', destinationValue: 'ميناء الوصول', statusValue: 'الحالة',
        seaStatus: 'في الطريق البحري', customsStatus: 'قيد التخليص الجمركي',
        deliveredStatus: 'تم التسليم', customsCleared: 'تم الفسح الجمركي',
        readyPickup: 'جاهز للاستلام', departedPort: 'مغادرة الميناء',
        inTransitStep: 'في عرض البحر', expectedArrival: 'الوصول المتوقع للميناء',
        arrivedPort: 'وصول الميناء', customsInspection: 'بدء التخليص الجمركي',
        loadedVessel: 'تحميل الحاوية', redSeaTransit: 'عبور البحر الأحمر',
        finalDelivery: 'الوصول النهائي', departedSalalah: 'مغادرة صلالة',
        arrivalMukalla: 'الوصول لميناء المكلا', registeredSystem: 'تسجيل الشحنة بالنظام',
        blPlaceholder: 'مثال: MSKU-982341', containerPlaceholder: 'مثال: MSKU7382910',
        originPlaceholder: 'شنغهاي، الصين', destinationPlaceholder: 'ميناء الوصول',
        csvHeaders: ['رقم البوليصة', 'رقم الحاوية', 'الخط الملاحي', 'ميناء المغادرة', 'ميناء الوصول', 'موعد الوصول', 'الحالة'],
        entryTitle: 'تسجيل الدخول',
        entrySubtitle: 'بوابة عمليات التخليص والشحن والدعم اللوجستي',
        entryBrandTagline: 'منصة الذكاء الاصطناعي المتقدمة لإدارة وتخليص الشحنات البحرية واللوجستية',
        copyrightNotice: 'جميع الحقوق محفوظة © 2026 ShipIntel AI. إحدى خدمات تيك زون للحلول التقنية (TechZone Solutions). لا يُسمح بنسخ أو استنساخ أو إعادة توزيع أي جزء من هذه المنصة أو برمجياتها دون إذن خطي مسبق.',
        entryUsername: 'اسم المستخدم',
        entryPassword: 'كلمة المرور',
        entryForgotPassword: 'نسيت كلمة المرور؟',
        entryLocalInvalid: 'بيانات الدخول المحلية غير صحيحة.',
        entrySessionError: 'تعذر بدء جلسة العرض المحلية في هذا المتصفح.',
        entryEmailInvalid: 'أدخل بريدًا إلكترونيًا صحيحًا.',
        entryPasswordInvalid: 'يجب ألا تقل كلمة المرور عن ٨ أحرف.',
        entryForgotEmail: 'أدخل بريدك الإلكتروني أولًا لإرسال رابط إعادة التعيين.',
        entryResetSent: 'إذا كان البريد مسجلًا، فسيصلك رابط إعادة تعيين كلمة المرور.',
        entryResetError: 'تعذر إرسال رابط إعادة التعيين. حاول مجددًا أو تواصل مع مدير النظام.',
        entryUnavailable: 'بوابة الدخول غير متاحة حتى إعداد خدمة المصادقة الآمنة.',
        entryServiceError: 'تعذر الاتصال بخدمة الدخول الآمن. تحقق من إعدادات النظام واتصال الإنترنت.',
        entryUnauthorized: 'هذا الحساب غير مخوّل لدخول لوحة التشغيل. اطلب اعتماد الصلاحية من مدير النظام.',
        entrySignInError: 'تعذر تسجيل الدخول. تحقق من البيانات أو تواصل مع مدير النظام.',
        entryLocalSessionError: 'تعذر التحقق من جلسة العرض المحلية في هذا المتصفح.',
        entryBrandCaption: 'MARITIME OPERATIONS INTELLIGENCE',
        entryReadoutTitle: 'ذكاء الشحن العالمي',
        entryReadoutCaption: 'رؤية · تخليص · تحكم',
        assistantTitle: 'مساعد ShipIntel AI',
        assistantLaunch: 'فتح مساعد ShipIntel AI',
        assistantDescription: 'مساعدة سريعة للشحنات والعمليات',
        assistantWelcome: 'مرحبًا، اسأل عن شحنة مسجلة أو عن استخدام اللوحة. هذا مساعد محلي يعتمد على بيانات اللوحة الحالية.',
        assistantInputLabel: 'اكتب سؤالك',
        assistantInputPlaceholder: 'اكتب رقم شحنة أو سؤالك...',
        assistantSend: 'إرسال السؤال',
        assistantClose: 'إغلاق المحادثة',
        assistantSupportAnswer: 'للدعم أو الاستفسارات، استخدم رابط «تواصل معنا» في القائمة الجانبية لبدء محادثة عبر واتساب.',
        assistantTrackingAnswer: 'للاستعلام عن شحنة، أرسل رقم البوليصة أو الحاوية المسجل في اللوحة. يعرض المساعد بيانات السجل الحالي فقط، ولا يتصل مباشرة بشركات الشحن.',
        assistantDefaultAnswer: 'أستطيع مساعدتك في العثور على شحنة مسجلة أو إرشادك إلى أدوات اللوحة. جرّب إدخال رقم بوليصة أو حاوية، أو اكتب «مساعدة».',
        assistantShipmentAnswer: 'الشحنة {bl} من {origin} إلى {destination}. الحالة: {status}. الوصول المتوقع: {eta}.',
        assistantShipmentDetailsAnswer: 'الشحنة {bl}\nالحالة: {status}\nالناقل: {carrier}\nالمسار: {origin} ← {destination}\nالوصول المتوقع: {eta}',
        unknown: 'غير محدد',
        languageButton: 'English', languageLabel: 'Switch language'
    },
    en: {
        pageTitle: 'ShipIntel AI | Shipment Dashboard',
        landingPageTitle: 'ShipIntel AI | Sign in',
        directCall: 'Direct call',
        home: 'Home', landingEyebrow: 'Maritime intelligence, clearer visibility',
        landingTitle: 'Every shipment,', landingTitleAccent: 'on a clear route.',
        landingDescription: 'Follow cargo and containers from departure to arrival, and manage every journey from one dashboard.',
        landingCta: 'Sign in',
        landingFootnote: 'One place to follow your logistics with confidence.',
        brandCaption: 'MARITIME OPERATIONS INTELLIGENCE',
        mapNav: 'Routes', pricingNav: 'Plans', assistantNav: 'Support',
        whatsappContact: 'Contact via WhatsApp',
        directContact: 'Call directly / Request a quote',
        whatsappMessage: 'Hello Aboamar, I would like to learn about ShipIntel AI pricing and trial options for shipment tracking and customs clearance at Mukalla Port.',
        contactConfigurationError: 'Contact links are unavailable. Please check the configured phone number.',
        authUnavailable: 'Sign-in is locked until secure authentication is configured. Do not use demo mode on a public deployment.',
        authNotAuthorized: 'This account is not authorized to access the operations dashboard. Ask your administrator to grant customs-agent access.',
        authGenericError: 'Could not sign in. Check your email and password or contact your administrator.',
        authInvalidEmail: 'Enter a valid email address.',
        authInvalidPassword: 'Password must be at least 8 characters.',
        authExpiredError: 'The sign-in link has expired. Ask your administrator for a new link.',
        authRateLimitError: 'Too many attempts. Wait a moment and try again.',
        authNetworkError: 'Could not connect to the sign-in service. Check your internet connection and try again.',
        localDemoSignOutError: 'Could not end the local demo session. Close this browser tab to end it.',
        shipmentPermissionError: 'You are not authorized to perform this action.',
        shipmentDuplicateError: 'The bill of lading or container number is already registered.',
        planFree: 'Trial package',
        planGrowthPrice: 'Based on operational needs',
        landingMapEyebrow: 'Operational visibility',
        landingMapTitle: 'Global routes, at a glance',
        landingMapDescription: 'A global visualization of major maritime corridors connecting Asia, the Middle East, Europe, and the Americas.',
        operationsEyebrow: 'Maritime operations center',
        operationsTitle: 'Route operations board',
        operationsDescription: 'Review registered voyages, statuses, and estimated arrivals in one operational view.',
        operationsLocalMode: 'Current registered records',
        operationsNotLive: 'No live vessel-position feed connected',
        operationsLastUpdated: 'Last local refresh',
        operationsTotal: 'Total voyages', operationsAtSea: 'At sea',
        operationsCustoms: 'In customs', operationsArrived: 'Arrived',
        operationsTableTitle: 'Voyage operations',
        operationsTableDescription: 'Voyages are based on shipment records saved in the ShipIntel dashboard.',
        operationsSearchPlaceholder: 'Search vessel, container, or voyage',
        operationsFilterLabel: 'Filter voyages by status',
        operationsAtSeaFilter: '🌊 At sea',
        operationsCustomsFilter: '📋 In customs',
        operationsArrivedFilter: '⚓ Arrived',
        operationsVesselVoyage: 'Vessel / voyage ID',
        operationsMapKicker: 'Tactical view',
        operationsMapTitle: 'Shipping corridors',
        operationsMapNote: 'Illustrative corridors only; this map does not show positions for registered voyages.',
        operationsVesselNotRecorded: 'Vessel name not recorded',
        operationsVoyageLabel: 'Voyage',
        operationsReferenceLabel: 'Shipment ref.',
        operationsStatusSea: '🌊 At sea',
        operationsStatusCustoms: '📋 In customs',
        operationsStatusArrived: '⚓ Arrived',
        operationsNoResults: 'No voyages match this search or filter.',
        operationsResultCount: '{count} voyages',
        operationsSummary: 'Voyage summary',
        mapLegend: 'Map legend',
        mapDemoLabel: 'Illustrative corridors · Not live tracking',
        mapAriaLabel: 'Global visualization of maritime shipping corridors between continents',
        mapNetworkView: 'Maritime corridor network', mapNetworkStatus: 'Network overview',
        mapGlobalCorridors: 'Global trade corridors', mapCorridorCount: 'Major corridors',
        mapWaypointCount: 'Transit hubs',
        mapInteractionHint: 'Select a vessel for details, or choose a route to highlight it.',
        mapRouteAsiaEurope: 'Asia · Suez Canal · Europe',
        mapRouteTranspacific: 'Asia · Pacific · Americas',
        mapRouteAtlantic: 'Americas · Atlantic · Europe',
        mapRouteSouth: 'Asia · Indian Ocean · Southern routes',
        mapIllustrativeNote: 'Routes and moving vessels are illustrative only and do not represent live positions.',
        mapCityShanghai: 'Shanghai', mapCitySingapore: 'Singapore', mapCityJeddah: 'Jeddah',
        mapCityRotterdam: 'Rotterdam', mapCityNewYork: 'New York', mapCityLosAngeles: 'Los Angeles',
        mapRegionAmericas: 'AMERICAS', mapRegionEurope: 'EUROPE',
        mapRegionMiddleEast: 'MIDDLE EAST', mapRegionAsia: 'ASIA',
        mapVesselNameAsia: 'Demo vessel · Indian Ocean',
        mapVesselNameAtlantic: 'Demo vessel · Atlantic',
        mapVesselAriaAsia: 'Show details for the demo Indian Ocean vessel',
        mapVesselAriaAtlantic: 'Show details for the demo Atlantic vessel',
        mapVesselDemo: 'Illustrative vessel · Simulated movement',
        mapVesselRouteLabel: 'Route', mapVesselSpeedLabel: 'Simulated speed',
        mapVesselEtaLabel: 'Estimated time',
        mapVesselSpeedAsia: '18 knots · simulated', mapVesselEtaAsia: '4 days · demo',
        mapVesselSpeedAtlantic: '16 knots · simulated', mapVesselEtaAtlantic: '6 days · demo',
        mapVesselDataNote: 'Demo information for display only; this is not live tracking.',
        mapVesselClose: 'Close vessel details',
        pricingEyebrow: 'Flexible plans', pricingTitle: 'Choose your starting point',
        pricingDescription: 'Choose the plan that fits your shipment tracking and customs needs.',
        planTrialEyebrow: 'Start with no commitment',
        planTrial: 'Trial Package',
        planTrialDescription: 'Explore the platform for a limited time.',
        planTrialPrice: '$0', planTrialPriceUnit: 'Free',
        planTrialDuration: '7 days',
        planTrialLimit: 'Up to 50 shipments',
        planTrialNoTerms: 'No terms or financial commitment',
        planTrialNoCard: 'No credit card required',
        planBasicEyebrow: 'Core plan',
        planBasic: 'Basic Package',
        planBasicDescription: 'Practical shipment visibility with essential support.',
        planBasicPrice: '$56', planBasicPriceUnit: 'per month',
        planRecommended: 'Most popular',
        planBasicDuration: 'One-month subscription',
        planBasicQueries: '1,500 shipment queries',
        planBasicUpdates: 'Automatic shipment updates before shipment, during transit, customs clearance, and ready-for-query clearance',
        planBasicSupport: 'Basic technical support',
        planPlusEyebrow: 'Expanded capabilities',
        planPlus: 'Plus Package',
        planPlusDescription: 'Open capacity and advanced visibility for your operations.',
        planPlusPrice: '$149', planPlusPriceUnit: 'Plus package',
        planPlusQueries: 'Open, unlimited shipment queries at high volume with no maximum limit',
        planPlusResponse: 'Advanced intelligent responses',
        planPlusTracking: 'Shipment movement tracking',
        planPlusSupport: '24/7 technical support',
        choosePlan: 'Get started', contactUs: 'Contact us',
        pricingDisclaimer: 'To subscribe or ask about a package, contact us via WhatsApp.',
        backToTop: 'Back to top',
        landingNav: 'Site navigation',
        visualRoute: 'Shipment route', visualVessel: 'Cargo vessel · at sea',
        visualOrigin: 'Origin port', visualDestination: 'Destination port',
        visualArriving: 'Estimated arrival', visualOnTime: 'On schedule',
        mainMenu: 'Main menu', workspace: 'Workspace', overview: 'Overview',
        shipments: 'Shipment tracking', trackingCenter: 'Shipment tracking center',
        localDataNote: 'Local demo mode; data will not sync to the cloud until Supabase is configured.',
        operationsCenter: 'Logistics operations center', dashboardTitle: 'Shipment dashboard',
        dashboardIntro: 'A clear view of your shipments from departure to arrival.',
        currentUser: 'Current user', adminRole: 'Administrator', shipmentSummary: 'Shipment summary',
        statsDescription: 'Live counts based on the current shipment list', totalShipments: 'Total shipments',
        allRegistered: 'All registered shipments', inTransit: 'In transit',
        shipmentsInTransit: 'Shipments on the move', customsClearance: 'Customs clearance',
        arrivalProcessing: 'Shipments going through arrival processing', delivered: 'Delivered',
        completedShipments: 'Completed shipments', trackShipment: 'Track a shipment',
        trackingInstructions: 'Enter a bill of lading or container number to see shipment details.',
        searchPlaceholder: 'Example: MSKU-982341 or MSKU7382910', searchLabel: 'Bill of lading or container number',
        showTracking: 'Track shipment', recentShipments: 'Recent shipments',
        manageShipments: 'Manage shipment details and track their status', exportCsv: 'Export report',
        addShipment: '＋ Add new shipment', filterByStatus: 'Filter by status', all: 'All',
        inTransitShort: 'In transit', billOfLading: 'Bill of lading', containerNumber: 'Container number',
        carrier: 'Carrier', originPort: 'Origin port', destinationPort: 'Destination port',
        eta: 'Estimated arrival', status: 'Status', actions: 'Actions',
        footerNote: 'ShipIntel AI · Local-data prototype; not connected to shipping carrier tracking services.',
        authTitle: 'Employee sign in',
        authDescription: 'Sign in to securely view your saved shipments.',
        authInviteOnly: 'Access is limited to authorized customs and shipping staff. Accounts are created by system administrator invitation.',
        authEmail: 'Username / email',
        authPassword: 'Password (at least 8 characters)',
        authSubmit: 'Sign in',
        authForgotPassword: 'Forgot password?',
        authResetTitle: 'Reset your password',
        authResetDescription: 'Choose a new password for your account.',
        authResetSubmit: 'Save new password',
        authResetComplete: 'Your password has been updated.',
        authRoleAgent: 'Customs agent',
        authSignOut: 'Sign out',
        authConfigMissing: 'Database settings are incomplete. Follow the setup steps in README.md.',
        authCheckEmail: 'Account created. Check your email to confirm it, then sign in.',
        authResetSent: 'If the address is registered, a password reset email will arrive.',
        authLoading: 'Loading your account and shipments...',
        authRoleAdmin: 'Administrator',
        authRoleUser: 'User',
        cloudSaveError: 'Could not save the shipment to the database. Check the connection and permissions.',
        cloudDeleteError: 'Could not delete the shipment from the database. Check the connection and permissions.',
        cloudLoadError: 'Could not load shipments from the database. Retry or check the Supabase setup.',
        cloudReady: 'Shipments are saved in the cloud database.',
        cloudFooterNote: 'Cloud database enabled · shipping carrier tracking APIs are not connected.',
        trackingDetails: 'Tracking details', journeySummary: 'Shipment summary and journey milestones',
        close: 'Close', shipmentJourney: 'Shipment journey', enterShipmentDetails: 'Enter shipment details to add it to the dashboard.',
        saveShipment: 'Save shipment', cancel: 'Cancel', track: 'Track', edit: 'Edit',
        delete: 'Delete', confirmDelete: 'Are you sure you want to delete this shipment?',
        noResults: 'No shipments match your search or filter.',
        emptySearch: 'Enter a bill of lading or container number first.',
        shipmentNotFound: 'No shipment with that number was found in the current records.',
        duplicateShipment: 'Bill of lading and container numbers must be unique.',
        storageError: 'Changes could not be saved in this browser.',
        loadError: 'Saved data could not be loaded; sample data is being shown.',
        addTitle: 'Add shipment', editTitle: 'Edit shipment',
        billOfLadingValue: 'Bill of lading', containerValue: 'Container number',
        carrierValue: 'Carrier', etaValue: 'Estimated arrival',
        originValue: 'Origin port', destinationValue: 'Destination port', statusValue: 'Status',
        seaStatus: 'In transit', customsStatus: 'Customs clearance',
        deliveredStatus: 'Delivered', customsCleared: 'Customs cleared',
        readyPickup: 'Ready for pickup', departedPort: 'Departed port',
        inTransitStep: 'In transit', expectedArrival: 'Expected port arrival',
        arrivedPort: 'Arrived at port', customsInspection: 'Customs inspection started',
        loadedVessel: 'Loaded on vessel', redSeaTransit: 'Red Sea transit',
        finalDelivery: 'Final delivery', departedSalalah: 'Departed Salalah',
        arrivalMukalla: 'Arrival at Mukalla Port', registeredSystem: 'Shipment registered',
        blPlaceholder: 'Example: MSKU-982341', containerPlaceholder: 'Example: MSKU7382910',
        originPlaceholder: 'Shanghai, China', destinationPlaceholder: 'Destination port',
        csvHeaders: ['Bill of lading', 'Container number', 'Carrier', 'Origin port', 'Destination port', 'ETA', 'Status'],
        entryTitle: 'Sign in',
        entrySubtitle: 'Customs, shipping, and logistics support operations portal',
        entryBrandTagline: 'Advanced AI platform for managing and clearing maritime and logistics shipments',
        copyrightNotice: 'Copyright © 2026 ShipIntel AI. A TechZone Solutions service. No part of this platform or its software may be copied, reproduced, or redistributed without prior written permission.',
        entryUsername: 'Username',
        entryPassword: 'Password',
        entryForgotPassword: 'Forgot password?',
        entryLocalInvalid: 'The local demo credentials are incorrect.',
        entrySessionError: 'Could not start a local demo session in this browser.',
        entryEmailInvalid: 'Enter a valid email address.',
        entryPasswordInvalid: 'Password must be at least 8 characters.',
        entryForgotEmail: 'Enter your email first to receive a reset link.',
        entryResetSent: 'If the email is registered, a password reset link will be sent.',
        entryResetError: 'Could not send the reset link. Try again or contact your administrator.',
        entryUnavailable: 'Sign-in is unavailable until secure authentication is configured.',
        entryServiceError: 'Could not connect to secure sign-in. Check system settings and your internet connection.',
        entryUnauthorized: 'This account is not authorized to access the operations dashboard. Ask an administrator to grant access.',
        entrySignInError: 'Could not sign in. Check your credentials or contact your administrator.',
        entryLocalSessionError: 'Could not verify the local demo session in this browser.',
        entryBrandCaption: 'MARITIME OPERATIONS INTELLIGENCE',
        entryReadoutTitle: 'GLOBAL SHIPPING INTELLIGENCE',
        entryReadoutCaption: 'VISIBILITY · CLEARANCE · CONTROL',
        assistantTitle: 'ShipIntel AI assistant',
        assistantDescription: 'Quick help with shipments and operations',
        assistantWelcome: 'Hello. Ask about a saved shipment or how to use the dashboard. This local assistant uses the current dashboard records.',
        assistantInputLabel: 'Type your question',
        assistantInputPlaceholder: 'Enter a shipment number or ask a question...',
        assistantSend: 'Send question',
        assistantClose: 'Close chat',
        assistantSupportAnswer: 'For support, use Contact in the sidebar to start a WhatsApp conversation.',
        assistantTrackingAnswer: 'To look up a shipment, enter its saved bill of lading or container number. The assistant only shows current records and does not connect to carriers.',
        assistantDefaultAnswer: 'I can help find a saved shipment or guide you through the dashboard. Try a bill of lading, container number, or ask for help.',
        assistantShipmentAnswer: 'Shipment {bl} from {origin} to {destination}. Status: {status}. Estimated arrival: {eta}.',
        assistantShipmentDetailsAnswer: 'Shipment {bl}\nStatus: {status}\nCarrier: {carrier}\nRoute: {origin} → {destination}\nEstimated arrival: {eta}',
        unknown: 'Not specified',
        assistantLaunch: 'Open ShipIntel AI assistant',
        languageButton: 'العربية', languageLabel: 'Switch language'
    }
};

const locationTranslations = {
    'شنغهاي (الصين)': 'Shanghai (China)',
    'عدن / المكلا': 'Aden / Mukalla',
    'جبل علي (دبي)': 'Jebel Ali (Dubai)',
    'جدة الإسلامي': 'Jeddah Islamic Port',
    'إسطنبول (تركيا)': 'Istanbul (Turkey)',
    'الحديدة / المكلا': 'Hodeidah / Mukalla',
    'صلالة (عمان)': 'Salalah (Oman)',
    'المكلا': 'Mukalla'
};

function t(key) {
    return translations[currentLang][key] || translations.ar[key] || key;
}

function setLanguage(language) {
    if (language !== 'ar' && language !== 'en') return;
    currentLang = language;
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        console.error('تعذر حفظ اللغة المفضلة.', error);
    }
    applyLanguage();
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        window.history.replaceState(window.history.state, '', url);
    } catch (error) {
        console.error('تعذر تحديث لغة رابط الصفحة.', error);
    }
}

function initializeLanguageToggle() {
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
        button.addEventListener('click', () => setLanguage(currentLang === 'ar' ? 'en' : 'ar'));
    });
}

function formatTranslation(template, values = {}) {
    return template.replace(/\{(\w+)\}/g, (placeholder, key) => values[key] ?? placeholder);
}

function resolveAssistantValues(values) {
    const resolved = { ...values };
    if (resolved.statusCode) resolved.status = getStatusTextForStatus(resolved.statusCode, currentLang);
    if (resolved.etaDate) resolved.eta = formatShipmentDate(resolved.etaDate);
    if ('carrier' in resolved && !resolved.carrier) resolved.carrier = t('unknown');
    if (resolved.originRaw) {
        resolved.origin = currentLang === 'en'
            ? (locationTranslations[resolved.originRaw] || resolved.originRaw)
            : resolved.originRaw;
    }
    if (resolved.destinationRaw) {
        resolved.destination = currentLang === 'en'
            ? (locationTranslations[resolved.destinationRaw] || resolved.destinationRaw)
            : resolved.destinationRaw;
    }
    return resolved;
}

function setLocalizedText(element, message, isError = false) {
    if (!element) return;
    const key = message
        ? Object.keys(translations[currentLang]).find(candidate => translations[currentLang][candidate] === message)
        : null;
    if (key) element.dataset.i18nKey = key;
    else delete element.dataset.i18nKey;
    delete element.dataset.i18nValues;
    element.textContent = message;
    element.classList.toggle('error', isError);
}

function applyLanguage() {
    const isDashboard = Boolean(document.getElementById('shipmentsTable'));
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.title = t(isDashboard ? 'pageTitle' : 'landingPageTitle');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-svg-i18n]').forEach(element => {
        element.textContent = t(element.dataset.svgI18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const values = element.dataset.i18nValues
            ? resolveAssistantValues(JSON.parse(element.dataset.i18nValues))
            : {};
        element.textContent = formatTranslation(t(element.dataset.i18nKey), values);
    });

    updateAuthMode();
    updateSessionLabels();
    if (isDashboard) {
        document.getElementById('addModalTitle').textContent =
            Number.parseInt(document.getElementById('editIndex').value, 10) >= 0 ? t('editTitle') : t('addTitle');
        renderFilteredShipments();
        if (activeTrackingIndex !== null) openTrackingModal(activeTrackingIndex);
        initializeContactLinks();
    }
}

function updateAuthMode() {
    const submit = document.getElementById('authSubmit');
    const forgotPassword = document.getElementById('authForgotPassword');
    const title = document.getElementById('authTitle');
    const description = document.getElementById('authDescription');
    const resetting = authMode === 'reset';
    if (!submit) return;
    submit.textContent = resetting ? t('authResetSubmit') : t('authSubmit');
    if (forgotPassword) forgotPassword.hidden = resetting;
    if (title) title.textContent = resetting ? t('authResetTitle') : t('authTitle');
    if (description) description.textContent = resetting ? t('authResetDescription') : t('authDescription');
    const password = document.getElementById('authPassword');
    if (password) password.autocomplete = resetting ? 'new-password' : 'current-password';
}

function localizeAuthError(error, fallbackKey = 'authGenericError') {
    const code = String(error?.code || '').toLowerCase();
    const message = String(error?.message || '').toLowerCase();
    if (code.includes('expired') || message.includes('expired') || message.includes('invalid token')) {
        return t('authExpiredError');
    }
    if (code.includes('rate') || message.includes('too many') || message.includes('rate limit')) {
        return t('authRateLimitError');
    }
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
        return t('authNetworkError');
    }
    return t(fallbackKey);
}

function localizeShipmentError(error, fallbackKey) {
    const code = String(error?.code || '');
    if (code === '23505') return t('shipmentDuplicateError');
    if (code === '42501' || code === 'PGRST301') return t('shipmentPermissionError');
    if (String(error?.message || '').toLowerCase().includes('fetch')) return t('authNetworkError');
    return t(fallbackKey);
}

function updateSessionLabels() {
    const identity = document.getElementById('currentUserName');
    const role = document.getElementById('currentUserRole');
    const signOutButton = document.getElementById('signOutButton');
    const sidebarSignOutButton = document.getElementById('sidebarSignOutButton');
    if (!signOutButton) return;
    if (localDemoMode) {
        if (identity) identity.textContent = 'admin';
        if (role) role.textContent = t('authRoleAdmin');
        signOutButton.hidden = false;
        if (sidebarSignOutButton) sidebarSignOutButton.hidden = false;
    } else if (cloudUser && cloudProfile) {
        if (identity) identity.textContent = cloudProfile.display_name || cloudUser.email || '';
        if (role) role.textContent = cloudProfile.role === 'admin'
            ? t('authRoleAdmin')
            : cloudProfile.role === 'customs_agent' ? t('authRoleAgent') : t('authRoleUser');
        signOutButton.hidden = false;
        if (sidebarSignOutButton) sidebarSignOutButton.hidden = false;
    } else {
        if (identity) identity.textContent = '';
        if (role) role.textContent = '';
        signOutButton.hidden = true;
        if (sidebarSignOutButton) sidebarSignOutButton.hidden = true;
    }
    const status = document.getElementById('cloudStatus');
    const footer = document.getElementById('footerStatus');
    if (status) setLocalizedText(status, cloudConfigured && cloudUser ? t('cloudReady') : t('localDataNote'));
    if (footer) setLocalizedText(footer, cloudConfigured && cloudUser ? t('cloudFooterNote') : t('footerNote'));
}

function showAuthFeedback(message, isError = false) {
    const feedback = document.getElementById('authFeedback');
    if (!feedback) return;
    setLocalizedText(feedback, message, isError);
}

async function loadAuthenticatedDashboard(user) {
    if (!user || !window.shipIntelBackend) return;
    const authGate = document.getElementById('authGate');
    const appShell = document.getElementById('appShell');
    cloudUser = null;
    cloudProfile = null;
    shipments = [];
    authGate.hidden = false;
    appShell.hidden = true;
    updateSessionLabels();
    showAuthFeedback(t('authLoading'));
    try {
        const profile = await window.shipIntelBackend.getProfile(user.id);
        if (!['admin', 'customs_agent'].includes(profile.role)) {
            accessDenied = true;
            cloudUser = null;
            cloudProfile = null;
            shipments = [];
            authGate.hidden = false;
            appShell.hidden = true;
            updateSessionLabels();
            showAuthFeedback(t('authNotAuthorized'), true);
            try {
                const { error } = await window.shipIntelBackend.signOut();
                if (error) console.error('تعذر إنهاء جلسة حساب غير مخوّل.', error);
            } catch (error) {
                console.error('تعذر إنهاء جلسة حساب غير مخوّل.', error);
            }
            return;
        }
        accessDenied = false;
        cloudProfile = profile;
        shipments = await window.shipIntelBackend.getShipments();
        cloudUser = user;
        updateSessionLabels();
        renderFilteredShipments();
        authGate.hidden = true;
        appShell.hidden = false;
    } catch (error) {
        console.error('تعذر تحميل بيانات حساب Supabase.', error);
        authGate.hidden = false;
        appShell.hidden = true;
        showAuthFeedback(localizeAuthError(error, 'cloudLoadError'), true);
    }
}

async function handleAuthStateChange(user, event) {
    if (!cloudConfigured) return;
    if (event === 'INITIAL_SESSION' && !passwordRecoveryRequested) return;
    if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;
    if (event === 'PASSWORD_RECOVERY' || (event === 'INITIAL_SESSION' && passwordRecoveryRequested)) {
        cloudUser = user;
        authMode = 'reset';
        document.getElementById('appShell').hidden = true;
        document.getElementById('authGate').hidden = false;
        updateAuthMode();
        showAuthFeedback('');
        return;
    }
    if (user) {
        await loadAuthenticatedDashboard(user);
        return;
    }
    cloudUser = null;
    cloudProfile = null;
    shipments = [];
    updateSessionLabels();
    document.getElementById('appShell').hidden = true;
    document.getElementById('authGate').hidden = false;
    showAuthFeedback(accessDenied ? t('authNotAuthorized') : '', accessDenied);
}

async function submitAuthForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = document.getElementById('authSubmit');
    const emailInput = document.getElementById('authEmail');
    const passwordInput = document.getElementById('authPassword');
    if (!emailInput.value.trim() || !emailInput.validity.valid) {
        showAuthFeedback(t('authInvalidEmail'), true);
        emailInput.focus();
        return;
    }
    if (passwordInput.value.length < 8) {
        showAuthFeedback(t('authInvalidPassword'), true);
        passwordInput.focus();
        return;
    }
    submitButton.disabled = true;
    showAuthFeedback('');
    try {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const backend = window.shipIntelBackend;
        if (authMode === 'reset') {
            const { error } = await backend.updatePassword(password);
            if (error) throw error;
            passwordRecoveryRequested = false;
            authMode = 'login';
            updateAuthMode();
            await loadAuthenticatedDashboard(cloudUser);
            setLocalizedText(document.getElementById('cloudStatus'), t('authResetComplete'));
            form.reset();
        } else {
            const { error } = await backend.signIn(email, password);
            if (error) throw error;
            showAuthFeedback(t('authLoading'));
        }
    } catch (error) {
        console.error('فشلت عملية المصادقة.', error);
        showAuthFeedback(localizeAuthError(error), true);
    } finally {
        submitButton.disabled = false;
    }
}

async function sendPasswordReset() {
    const email = document.getElementById('authEmail').value.trim();
    if (!email || !document.getElementById('authEmail').validity.valid) {
        showAuthFeedback(t('authInvalidEmail'), true);
        document.getElementById('authEmail').focus();
        return;
    }
    try {
        const redirectTo = new URL('dashboard.html', window.location.href).href;
        const { error } = await window.shipIntelBackend.resetPassword(email, redirectTo);
        if (error) throw error;
        showAuthFeedback(t('authResetSent'));
    } catch (error) {
        console.error('تعذر إرسال رابط إعادة تعيين كلمة المرور.', error);
        showAuthFeedback(localizeAuthError(error), true);
    }
}

async function signOut() {
    if (localDemoMode) {
        try {
            sessionStorage.removeItem(LOCAL_DEMO_SESSION_KEY);
            window.location.replace('index.html');
        } catch (error) {
            console.error('تعذر إنهاء جلسة العرض المحلية.', error);
            setLocalizedText(document.getElementById('cloudStatus'), t('localDemoSignOutError'));
        }
        return;
    }
    try {
        const { error } = await window.shipIntelBackend.signOut();
        if (error) throw error;
        cloudUser = null;
        cloudProfile = null;
        shipments = [];
        window.location.replace('index.html');
    } catch (error) {
        console.error('تعذر تسجيل الخروج من Supabase.', error);
        setLocalizedText(document.getElementById('cloudStatus'), localizeAuthError(error));
    }
}

async function initializeDashboardBackend() {
    const authGate = document.getElementById('authGate');
    const appShell = document.getElementById('appShell');
    const backend = window.shipIntelBackend;
    cloudConfigured = Boolean(backend && backend.configured);

    if (!cloudConfigured) {
        const localHost = location.protocol === 'file:' ||
            ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
        if (localHost) {
            let localDemoSession;
            try {
                localDemoSession = sessionStorage.getItem(LOCAL_DEMO_SESSION_KEY);
            } catch (error) {
                console.error('تعذر التحقق من جلسة العرض المحلية.', error);
                showAuthFeedback(t('entryLocalSessionError'), true);
                return;
            }
            if (localDemoSession === 'admin') {
                localDemoMode = true;
                loadShipments();
                updateSessionLabels();
                renderFilteredShipments();
                authGate.hidden = true;
                appShell.hidden = false;
                return;
            }
            window.location.replace('index.html');
            return;
        }
        appShell.hidden = true;
        authGate.hidden = false;
        showAuthFeedback(t('authUnavailable'), true);
        document.getElementById('authSubmit').disabled = true;
        document.getElementById('authForgotPassword').disabled = true;
        return;
    }

    appShell.hidden = true;
    authGate.hidden = false;
    passwordRecoveryRequested = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    backend.onAuthStateChange((user, event) => {
        void handleAuthStateChange(user, event);
    });
    try {
        const result = await backend.initialize();
        if (result.user && passwordRecoveryRequested) {
            cloudUser = result.user;
            authMode = 'reset';
            updateAuthMode();
        } else if (result.user) {
            await loadAuthenticatedDashboard(result.user);
        } else {
            showAuthFeedback('');
        }
    } catch (error) {
        console.error('تعذر تهيئة خدمة Supabase.', error);
        showAuthFeedback(localizeAuthError(error, 'cloudLoadError'), true);
        document.getElementById('authSubmit').disabled = true;
        document.getElementById('authForgotPassword').disabled = true;
    }
}

function passLanguageToLanding(event) {
    event.currentTarget.href = `index.html?lang=${currentLang}`;
}

function passLanguage(event) {
    event.currentTarget.href = `dashboard.html?lang=${currentLang}`;
}

function initializeContactLinks() {
    const phone = String(window.SHIPINTEL_CONTACT_CONFIG?.whatsappPhone || '').replace(/\D/g, '');
    const validPhone = /^\d{10,15}$/.test(phone);
    const message = encodeURIComponent(t('whatsappMessage'));
    document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
        if (!validPhone) {
            link.removeAttribute('href');
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
            return;
        }
        link.href = link.hasAttribute('data-whatsapp-direct')
            ? `https://wa.me/${phone}`
            : `https://wa.me/${phone}?text=${message}`;
    });
    document.querySelectorAll('[data-phone-link]').forEach(link => {
        if (!validPhone) {
            link.removeAttribute('href');
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
            return;
        }
        link.href = `tel:+${phone}`;
    });
    const note = document.getElementById('contactConfigurationNote');
    if (note) note.hidden = validPhone;
}

function setAssistantOpen(open) {
    const panel = document.getElementById('assistantPanel');
    const launcher = document.getElementById('assistantLauncher');
    if (!panel || !launcher) return;
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('assistantInput').focus();
    else launcher.focus();
}

function answerAssistantQuestion(question) {
    const normalizedQuestion = normalizeTrackingId(question);
    const shipment = shipments.find(item =>
        [item.bl, item.container].some(identifier =>
            normalizedQuestion.includes(normalizeTrackingId(identifier))
        )
    );
    if (shipment) {
        return {
            key: 'assistantShipmentDetailsAnswer',
            values: {
                bl: shipment.bl,
                statusCode: shipment.status,
                carrier: shipment.carrier || '',
                originRaw: shipment.origin,
                destinationRaw: shipment.dest,
                etaDate: shipment.eta
            }
        };
    }

    const normalizedText = String(question).toLowerCase();
    if (/مساعدة|دعم|تواصل|واتساب|support|help|contact/.test(normalizedText)) {
        return { key: 'assistantSupportAnswer' };
    }
    if (/تتبع|شحن|بوليصة|حاوية|shipment|track|container|bill/.test(normalizedText)) {
        return { key: 'assistantTrackingAnswer' };
    }
    return { key: 'assistantDefaultAnswer' };
}

function addAssistantMessage(text, type, translationKey = '', values = {}) {
    const messages = document.getElementById('assistantMessages');
    const message = document.createElement('p');
    message.className = `assistant-message assistant-message-${type}`;
    if (translationKey) {
        message.dataset.i18nKey = translationKey;
        message.dataset.i18nValues = JSON.stringify(values);
        message.textContent = formatTranslation(t(translationKey), resolveAssistantValues(values));
    } else {
        message.textContent = text;
    }
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function submitAssistantMessage(event) {
    event.preventDefault();
    const input = document.getElementById('assistantInput');
    const question = input.value.trim();
    if (!question) return;
    addAssistantMessage(question, 'user');
    input.value = '';
    const response = answerAssistantQuestion(question);
    addAssistantMessage('', 'bot', response.key, response.values);
    input.focus();
}

function initializeRouteMap() {
    const map = document.querySelector('.global-route-map');
    const details = document.getElementById('mapVesselDetails');
    const closeButton = document.getElementById('mapVesselClose');
    if (!map || !details || !closeButton) return;

    const routeButtons = Array.from(document.querySelectorAll('[data-map-route-toggle]'));
    let selectedVessel = null;

    function selectRoute(routeKey) {
        const selected = routeKey && routeButtons.find(button => button.dataset.mapRouteToggle === routeKey);
        const routeName = selected?.dataset.mapRouteToggle || null;
        map.classList.toggle('has-active-route', Boolean(routeName));
        map.querySelectorAll('[data-map-route]').forEach(route => {
            route.classList.toggle('is-active', route.dataset.mapRoute === routeName);
        });
        routeButtons.forEach(button => {
            const active = button === selected;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    function closeDetails() {
        details.hidden = true;
        if (selectedVessel) {
            selectedVessel.classList.remove('is-selected');
            selectedVessel.setAttribute('aria-pressed', 'false');
            selectedVessel.focus();
            selectedVessel = null;
        }
    }

    function showDetails(vessel) {
        if (selectedVessel === vessel && !details.hidden) {
            closeDetails();
            return;
        }
        if (selectedVessel) {
            selectedVessel.classList.remove('is-selected');
            selectedVessel.setAttribute('aria-pressed', 'false');
        }
        selectedVessel = vessel;
        selectedVessel.classList.add('is-selected');
        selectedVessel.setAttribute('aria-pressed', 'true');
        document.getElementById('mapVesselName').textContent = t(vessel.dataset.vesselName);
        document.getElementById('mapVesselRoute').textContent = t(vessel.dataset.vesselRoute);
        document.getElementById('mapVesselSpeed').textContent = t(vessel.dataset.vesselSpeed);
        document.getElementById('mapVesselEta').textContent = t(vessel.dataset.vesselEta);
        details.hidden = false;
        selectRoute(vessel.dataset.vesselRoute === 'mapRouteAtlantic' ? 'atlantic' : 'asia-europe');
        closeButton.focus();
    }

    routeButtons.forEach(button => {
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
            const routeKey = button.classList.contains('is-active') ? null : button.dataset.mapRouteToggle;
            selectRoute(routeKey);
        });
    });
    map.addEventListener('click', event => {
        const vessel = event.target.closest('[data-map-vessel]');
        if (vessel) showDetails(vessel);
    });
    map.addEventListener('keydown', event => {
        const vessel = event.target.closest('[data-map-vessel]');
        if (vessel && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            showDetails(vessel);
        }
    });
    closeButton.addEventListener('click', closeDetails);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !details.hidden) closeDetails();
    });

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
        if (motionPreference.matches) map.pauseAnimations();
        else map.unpauseAnimations();
    };
    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);
}

function initializeRouteOperations() {
    const searchInput = document.getElementById('routesSearchInput');
    const tbody = document.getElementById('routesOperationsTable');
    if (!searchInput || !tbody) return;

    searchInput.addEventListener('input', () => {
        routeSearchTerm = searchInput.value;
        renderRoutesBoard();
    });
    document.querySelectorAll('[data-route-status-filter]').forEach(button => {
        button.addEventListener('click', () => {
            routeStatusFilter = button.dataset.routeStatusFilter;
            document.querySelectorAll('[data-route-status-filter]').forEach(filterButton => {
                const active = filterButton === button;
                filterButton.classList.toggle('is-active', active);
                filterButton.setAttribute('aria-pressed', String(active));
            });
            renderRoutesBoard();
        });
    });
    tbody.addEventListener('click', event => {
        const row = event.target.closest('[data-route-shipment-index]');
        if (row) openTrackingModal(Number.parseInt(row.dataset.routeShipmentIndex, 10));
    });
    tbody.addEventListener('keydown', event => {
        const row = event.target.closest('[data-route-shipment-index]');
        if (row && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openTrackingModal(Number.parseInt(row.dataset.routeShipmentIndex, 10));
        }
    });
}

function initializeDashboardViews() {
    const views = Array.from(document.querySelectorAll('[data-dashboard-view]'));
    const links = Array.from(document.querySelectorAll('[data-dashboard-view-link]'));
    if (!views.length || !links.length) return;

    function showView(name, updateHash) {
        const activeView = views.find(view => view.dataset.dashboardView === name);
        if (!activeView) return false;
        views.forEach(view => {
            view.hidden = view !== activeView;
        });
        links.forEach(link => {
            const active = link.dataset.dashboardViewLink === name;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        if (updateHash && window.location.hash !== `#${activeView.id}`) {
            window.history.replaceState(null, '', `#${activeView.id}`);
        }
        return true;
    }

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            showView(link.dataset.dashboardViewLink, true);
        });
    });
    window.addEventListener('hashchange', () => {
        const view = views.find(candidate =>
            candidate.id === window.location.hash.slice(1) ||
            candidate.dataset.dashboardView === window.location.hash.slice(1)
        );
        showView(view ? view.dataset.dashboardView : 'overview', false);
    });

    const initialHash = window.location.hash.slice(1);
    const initialView = views.find(view =>
        view.id === initialHash || view.dataset.dashboardView === initialHash
    );
    showView(initialView ? initialView.dataset.dashboardView : 'overview', true);
}

let shipments = [
    {
        bl: "MSKU-982341",
        container: "MSKU7382910",
        carrier: "Maersk Line",
        origin: "شنغهاي (الصين)",
        dest: "عدن / المكلا",
        eta: "2026-11-02",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "مغادرة الميناء", titleEn: "Departed Port", date: "2026-10-15", done: true },
            { titleAr: "في عرض البحر", titleEn: "In Transit", date: "2026-10-20", done: true },
            { titleAr: "الوصول المتوقع للميناء", titleEn: "Expected Arrival", date: "2026-11-02", done: false }
        ]
    },
    {
        bl: "CMAU-441029",
        container: "CMAU1029384",
        carrier: "CMA CGM",
        origin: "جبل علي (دبي)",
        dest: "جدة الإسلامي",
        eta: "2026-10-24",
        status: "customs",
        statusTextAr: "تم الفسح الجمركي",
        statusTextEn: "Customs Cleared",
        timeline: [
            { titleAr: "وصول الميناء", titleEn: "Arrived Port", date: "2026-10-21", done: true },
            { titleAr: "بدء التخليص الجمركي", titleEn: "Customs Inspection", date: "2026-10-22", done: true },
            { titleAr: "جاهز للاستلام", titleEn: "Ready for Pickup", date: "2026-10-24", done: false }
        ]
    },
    {
        bl: "HLCU-109283",
        container: "HLCU5562019",
        carrier: "Hapag-Lloyd",
        origin: "إسطنبول (تركيا)",
        dest: "الحديدة / المكلا",
        eta: "2026-11-10",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "تحميل الحاوية", titleEn: "Loaded on Vessel", date: "2026-10-18", done: true },
            { titleAr: "عبور البحر الأحمر", titleEn: "Red Sea Transit", date: "2026-10-28", done: false },
            { titleAr: "الوصول النهائي", titleEn: "Final Delivery", date: "2026-11-10", done: false }
        ]
    },
    {
        bl: "MSCU-883019",
        container: "MSCU9940123",
        carrier: "MSC",
        origin: "صلالة (عمان)",
        dest: "المكلا",
        eta: "2026-10-29",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "مغادرة صلالة", titleEn: "Departed Salalah", date: "2026-10-22", done: true },
            { titleAr: "الوصول لميناء المكلا", titleEn: "Arrival Mukalla Port", date: "2026-10-29", done: false }
        ]
    }
];

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function getStatusText(shipment) {
    if (shipment.status === 'delivered') {
        return t('deliveredStatus');
    }
    if (shipment.status === 'customs') {
        return currentLang === 'ar'
            ? (shipment.statusAr || shipment.statusTextAr || t('customsStatus'))
            : (shipment.statusEn || shipment.statusTextEn || t('customsStatus'));
    }
    return t('seaStatus');
}

function normalizeTrackingId(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[\s-]/g, '');
}

function findShipmentIndex(trackingId, records = shipments) {
    const query = normalizeTrackingId(trackingId);
    if (!query) return -1;
    return records.findIndex(shipment =>
        [shipment.bl, shipment.container].some(value => normalizeTrackingId(value) === query)
    );
}

function getTimelineStepTitle(step) {
    const timelineTranslations = {
        "مغادرة الميناء": t('departedPort'),
        "في عرض البحر": t('inTransitStep'),
        "الوصول المتوقع للميناء": t('expectedArrival'),
        "وصول الميناء": t('arrivedPort'),
        "بدء التخليص الجمركي": t('customsInspection'),
        "جاهز للاستلام": t('readyPickup'),
        "تحميل الحاوية": t('loadedVessel'),
        "عبور البحر الأحمر": t('redSeaTransit'),
        "الوصول النهائي": t('finalDelivery'),
        "مغادرة صلالة": t('departedSalalah'),
        "الوصول لميناء المكلا": t('arrivalMukalla'),
        "تسجيل الشحنة بالنظام": t('registeredSystem')
    };
    return currentLang === 'ar'
        ? step.titleAr
        : (timelineTranslations[step.titleAr] || step.titleEn);
}

function formatShipmentDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(currentLang === 'ar' ? 'ar' : 'en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function updateStats() {
    document.getElementById("totalCount").textContent = shipments.length;
    document.getElementById("seaCount").textContent = shipments.filter(s => s.status === 'sea').length;
    document.getElementById("customsCount").textContent = shipments.filter(s => s.status === 'customs').length;
    document.getElementById("deliveredCount").textContent = shipments.filter(s => s.status === 'delivered').length;
}

function renderTable(data = shipments) {
    const tbody = document.getElementById("shipmentsTable");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td class="empty-cell" colspan="8">${escapeHtml(t('noResults'))}</td></tr>`;
        updateStats();
        return;
    }

    data.forEach(s => {
        const index = shipments.indexOf(s);
        const badgeClass = s.status === 'delivered' ? 'badge-delivered' : s.status === 'customs' ? 'badge-customs' : 'badge-sea';
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="shipment-id">${escapeHtml(s.bl)}</td>
            <td class="container-id">${escapeHtml(s.container)}</td>
            <td class="carrier-tag">${escapeHtml(s.carrier)}</td>
            <td>${escapeHtml(currentLang === 'en' ? (locationTranslations[s.origin] || s.origin) : s.origin)}</td>
            <td>${escapeHtml(currentLang === 'en' ? (locationTranslations[s.dest] || s.dest) : s.dest)}</td>
            <td>${escapeHtml(s.eta)}</td>
            <td><span class="badge ${badgeClass}">${escapeHtml(getStatusText(s))}</span></td>
            <td>
                <div class="row-actions">
                    <button class="row-btn track" onclick="openTrackingModal(${index})" type="button">${escapeHtml(t('track'))}</button>
                    <button class="row-btn" onclick="openEditModal(${index})" type="button">${escapeHtml(t('edit'))}</button>
                    <button class="row-btn delete" onclick="deleteShipment(${index})" type="button">${escapeHtml(t('delete'))}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateStats();
}

function renderRoutesBoard() {
    const tbody = document.getElementById('routesOperationsTable');
    if (!tbody) return;

    const records = shipments.map((shipment, index) => ({ shipment, index }));
    const search = routeSearchTerm.toLocaleLowerCase(currentLang === 'ar' ? 'ar' : 'en').trim();
    const filtered = records.filter(({ shipment }) => {
        const statusMatches = routeStatusFilter === 'all' || shipment.status === routeStatusFilter;
        const searchable = [
            shipment.vesselName,
            shipment.voyageId,
            shipment.bl,
            shipment.container,
            shipment.carrier,
            shipment.origin,
            shipment.dest,
            locationTranslations[shipment.origin],
            locationTranslations[shipment.dest]
        ].filter(Boolean).join(' ').toLocaleLowerCase(currentLang === 'ar' ? 'ar' : 'en');
        return statusMatches && searchable.includes(search);
    });

    document.getElementById('routesTotalCount').textContent = shipments.length;
    document.getElementById('routesSeaCount').textContent = shipments.filter(({ status }) => status === 'sea').length;
    document.getElementById('routesCustomsCount').textContent = shipments.filter(({ status }) => status === 'customs').length;
    document.getElementById('routesArrivedCount').textContent = shipments.filter(({ status }) => status === 'delivered').length;
    document.getElementById('routesResultCount').textContent =
        t('operationsResultCount').replace('{count}', new Intl.NumberFormat(currentLang === 'ar' ? 'ar' : 'en').format(filtered.length));
    document.getElementById('routesLastUpdated').textContent = new Intl.DateTimeFormat(currentLang === 'ar' ? 'ar' : 'en', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date());

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td class="operations-empty" colspan="5">${escapeHtml(t('operationsNoResults'))}</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(({ shipment, index }) => {
        const statusKey = shipment.status === 'customs'
            ? 'operationsStatusCustoms'
            : shipment.status === 'delivered' ? 'operationsStatusArrived' : 'operationsStatusSea';
        const vesselName = shipment.vesselName || t('operationsVesselNotRecorded');
        const voyageId = shipment.voyageId || shipment.bl;
        const voyageLabel = shipment.voyageId ? t('operationsVoyageLabel') : t('operationsReferenceLabel');
        const origin = currentLang === 'en'
            ? (locationTranslations[shipment.origin] || shipment.origin)
            : shipment.origin;
        const destination = currentLang === 'en'
            ? (locationTranslations[shipment.dest] || shipment.dest)
            : shipment.dest;
        return `
            <tr class="operations-row" data-route-shipment-index="${index}" tabindex="0" aria-label="${escapeHtml(`${vesselName}, ${voyageLabel} ${voyageId}`)}">
                <td><div class="operations-vessel">${escapeHtml(vesselName)}</div><div class="operations-voyage">${escapeHtml(voyageLabel)} ${escapeHtml(voyageId)}</div><div class="operations-carrier">${escapeHtml(shipment.carrier || '')}</div><span class="operations-container">${escapeHtml(shipment.container || '')}</span></td>
                <td><span class="operations-port">${escapeHtml(origin || '—')}</span></td>
                <td><span class="operations-port">${escapeHtml(destination || '—')}</span></td>
                <td><span class="operations-badge operations-badge-${escapeHtml(shipment.status)}">${escapeHtml(t(statusKey))}</span></td>
                <td><span class="operations-eta">${escapeHtml(formatShipmentDate(shipment.eta))}</span></td>
            </tr>
        `;
    }).join('');
}

function renderFilteredShipments() {
    const searchInput = document.getElementById("searchInput");
    const value = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = shipments.filter(s => {
        const matchesStatus = activeFilter === 'all' || s.status === activeFilter;
        const searchable = [
            s.bl, s.container, s.carrier, s.origin, s.dest,
            locationTranslations[s.origin], locationTranslations[s.dest]
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        return matchesStatus && searchable.includes(value);
    });
    renderTable(filtered);
    renderRoutesBoard();
}

function setFilter(type) {
    activeFilter = type;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    if (type === 'all') document.getElementById("filterAll")?.classList.add("active");
    if (type === 'sea') document.getElementById("filterSea")?.classList.add("active");
    if (type === 'customs') document.getElementById("filterCustoms")?.classList.add("active");
    if (type === 'delivered') document.getElementById("filterDelivered")?.classList.add("active");
    renderFilteredShipments();
}

function runFilter() {
    renderFilteredShipments();
}

function trackShipmentAction() {
    const input = document.getElementById("searchInput");
    const feedback = document.getElementById("searchFeedback");
    const query = normalizeTrackingId(input.value);
    if (!query) {
        setLocalizedText(feedback, t('emptySearch'));
        input.focus();
        return;
    }

    const index = findShipmentIndex(query);
    if (index < 0) {
        setLocalizedText(feedback, t('shipmentNotFound'));
        runFilter();
        return;
    }

    setLocalizedText(feedback, '');
    openTrackingModal(index);
}

function openTrackingModal(index) {
    const s = shipments[index];
    if (!s) return;
    activeTrackingIndex = index;
    const modal = document.getElementById("trackingModal");
    const details = document.getElementById("modalDetails");
    const timeline = document.getElementById("modalTimeline");

    if (!modal) return;

    if (details) {
        details.innerHTML = `
            <div class="detail-item"><span>${escapeHtml(t('billOfLadingValue'))}</span><strong>${escapeHtml(s.bl)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('containerValue'))}</span><strong>${escapeHtml(s.container)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('carrierValue'))}</span><strong>${escapeHtml(s.carrier)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('etaValue'))}</span><strong>${escapeHtml(s.eta)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('originValue'))}</span><strong>${escapeHtml(currentLang === 'en' ? (locationTranslations[s.origin] || s.origin) : s.origin)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('destinationValue'))}</span><strong>${escapeHtml(currentLang === 'en' ? (locationTranslations[s.dest] || s.dest) : s.dest)}</strong></div>
            <div class="detail-item"><span>${escapeHtml(t('statusValue'))}</span><strong>${escapeHtml(getStatusText(s))}</strong></div>
        `;
    }

    if (timeline) {
        timeline.innerHTML = (s.timeline || []).map(step => `
            <div class="timeline-step ${step.done ? 'completed' : ''}">
                <div class="timeline-title-text">${escapeHtml(getTimelineStepTitle(step))}</div>
                <div class="timeline-desc">${escapeHtml(step.date)}</div>
            </div>
        `).join("");
    }

    modal.classList.add("open");
}

function closeTrackingModal() {
    const modal = document.getElementById("trackingModal");
    if (modal) modal.classList.remove("open");
    activeTrackingIndex = null;
}

function openAddModal() {
    const form = document.getElementById("addShipmentForm");
    if (form) form.reset();
    const editIdx = document.getElementById("editIndex");
    if (editIdx) editIdx.value = "-1";
    document.getElementById("addModalTitle").textContent = t('addTitle');
    const modal = document.getElementById("addModal");
    if (modal) modal.classList.add("open");
}

function openEditModal(index) {
    const s = shipments[index];
    if (!s) return;
    const editIdx = document.getElementById("editIndex");
    if (editIdx) editIdx.value = index;
    if (document.getElementById("fBL")) document.getElementById("fBL").value = s.bl;
    if (document.getElementById("fCont")) document.getElementById("fCont").value = s.container;
    if (document.getElementById("fCarrier")) document.getElementById("fCarrier").value = s.carrier || "Maersk Line";
    if (document.getElementById("fETA")) document.getElementById("fETA").value = s.eta;
    if (document.getElementById("fOrigin")) document.getElementById("fOrigin").value = s.origin;
    if (document.getElementById("fDest")) document.getElementById("fDest").value = s.dest;
    if (document.getElementById("fStatus")) document.getElementById("fStatus").value = s.status;
    document.getElementById("addModalTitle").textContent = t('editTitle');
    const modal = document.getElementById("addModal");
    if (modal) modal.classList.add("open");
}

function closeAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.classList.remove("open");
}

async function saveShipment(e) {
    e.preventDefault();
    const editIdx = Number.parseInt(document.getElementById("editIndex").value, 10);
    const stVal = document.getElementById("fStatus").value;
    const bl = document.getElementById("fBL").value.trim();
    const container = document.getElementById("fCont").value.trim();
    const duplicate = shipments.some((shipment, index) =>
        index !== editIdx && (
            shipment.bl.toLowerCase() === bl.toLowerCase() ||
            shipment.container.toLowerCase() === container.toLowerCase()
        )
    );
    if (duplicate) {
        alert(t('duplicateShipment'));
        return;
    }

    const existingShipment = editIdx >= 0 ? shipments[editIdx] : null;
    const newShipment = {
        bl,
        container,
        carrier: document.getElementById("fCarrier").value.trim(),
        eta: document.getElementById("fETA").value,
        origin: document.getElementById("fOrigin").value.trim(),
        dest: document.getElementById("fDest").value.trim(),
        status: stVal,
        statusTextAr: getStatusTextForStatus(stVal),
        statusTextEn: getStatusTextForStatus(stVal, 'en'),
        timeline: existingShipment?.timeline || [
            { titleAr: "تسجيل الشحنة بالنظام", titleEn: "Registered in System", date: new Date().toISOString().split('T')[0], done: true }
        ]
    };

    try {
        if (cloudConfigured) {
            const savedShipment = await window.shipIntelBackend.saveShipment({
                ...newShipment,
                id: existingShipment ? existingShipment.id : undefined
            });
            if (editIdx >= 0) {
                shipments[editIdx] = savedShipment;
            } else {
                shipments.unshift(savedShipment);
            }
        } else {
            if (editIdx >= 0) {
                shipments[editIdx] = newShipment;
            } else {
                shipments.unshift(newShipment);
            }
            persistShipments();
        }
        closeAddModal();
        renderFilteredShipments();
        setLocalizedText(document.getElementById('searchFeedback'), '');
    } catch (error) {
        console.error('تعذر حفظ الشحنة.', error);
        setLocalizedText(document.getElementById('searchFeedback'), cloudConfigured
            ? localizeShipmentError(error, 'cloudSaveError')
            : t('storageError'));
    }
}

async function deleteShipment(index) {
    if (confirm(t('confirmDelete'))) {
        try {
            if (cloudConfigured) {
                await window.shipIntelBackend.deleteShipment(shipments[index].id);
            }
            shipments.splice(index, 1);
            if (!cloudConfigured) persistShipments();
            renderFilteredShipments();
            setLocalizedText(document.getElementById('searchFeedback'), '');
        } catch (error) {
            console.error('تعذر حذف الشحنة.', error);
            setLocalizedText(document.getElementById('searchFeedback'), cloudConfigured
                ? localizeShipmentError(error, 'cloudDeleteError')
                : t('storageError'));
        }
    }
}

function getStatusTextForStatus(status, language = 'ar') {
    if (status === 'delivered') return language === 'ar' ? 'تم التسليم' : 'Delivered';
    if (status === 'customs') return language === 'ar' ? 'قيد التخليص الجمركي' : 'Customs clearance';
    return language === 'ar' ? 'في الطريق البحري' : 'In transit';
}

function persistShipments() {
    if (cloudConfigured) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
        setLocalizedText(document.getElementById('searchFeedback'), '');
    } catch (error) {
        console.error('تعذر حفظ الشحنات في التخزين المحلي.', error);
        setLocalizedText(document.getElementById('searchFeedback'), t('storageError'));
    }
}

function loadShipments() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return;
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) throw new TypeError('بيانات الشحنات المحفوظة ليست قائمة صالحة.');
        shipments = parsed;
    } catch (error) {
        console.error('تعذر قراءة الشحنات المحفوظة؛ سيتم عرض البيانات التجريبية.', error);
        setLocalizedText(document.getElementById('searchFeedback'), t('loadError'));
    }
}

function exportShipmentsToCSV() {
    let csv = "\uFEFF" + translations[currentLang].csvHeaders.join(',') + "\n";
    shipments.forEach(s => {
        const origin = currentLang === 'en' ? (locationTranslations[s.origin] || s.origin) : s.origin;
        const destination = currentLang === 'en' ? (locationTranslations[s.dest] || s.dest) : s.dest;
        csv += [s.bl, s.container, s.carrier || '', origin, destination, s.eta, getStatusText(s)]
            .map(value => `"${String(value ?? '').replace(/"/g, '""')}"`)
            .join(',') + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Shipments_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

window.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    initializeLanguageToggle();
    initializeContactLinks();
    if (!document.getElementById('shipmentsTable')) return;

    initializeDashboardViews();
    initializeRouteMap();
    initializeRouteOperations();
    document.getElementById("searchInput").addEventListener("input", () => {
        setLocalizedText(document.getElementById('searchFeedback'), '');
        runFilter();
    });
    document.getElementById("trackingSearchForm").addEventListener("submit", event => {
        event.preventDefault();
        trackShipmentAction();
    });
    document.getElementById("addShipmentForm").addEventListener("submit", saveShipment);
    document.getElementById('authForm').addEventListener('submit', submitAuthForm);
    document.getElementById('authForgotPassword').addEventListener('click', sendPasswordReset);
    document.getElementById('signOutButton').addEventListener('click', signOut);
    document.getElementById('sidebarSignOutButton').addEventListener('click', signOut);
    document.getElementById('assistantLauncher').addEventListener('click', () => {
        const isOpen = document.getElementById('assistantLauncher').getAttribute('aria-expanded') === 'true';
        setAssistantOpen(!isOpen);
    });
    document.getElementById('assistantClose').addEventListener('click', () => setAssistantOpen(false));
    document.getElementById('assistantForm').addEventListener('submit', submitAssistantMessage);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeTrackingModal();
            closeAddModal();
            if (!document.getElementById('assistantPanel').hidden) setAssistantOpen(false);
        }
    });
    void initializeDashboardBackend();
});