let currentLang = 'ar';
let activeFilter = 'all';
let activeTrackingIndex = null;
let authMode = 'login';
let cloudUser = null;
let cloudProfile = null;
let cloudConfigured = false;
let passwordRecoveryRequested = false;
const STORAGE_KEY = 'shipintel-shipments';
const LANGUAGE_STORAGE_KEY = 'shipintel-language';

const translations = {
    ar: {
        pageTitle: 'ShipIntel AI | لوحة تتبع الشحنات',
        landingPageTitle: 'ShipIntel AI | منصة تتبع الشحنات',
        home: 'الرئيسية', landingEyebrow: 'ذكاء بحري، ورؤية أوضح',
        landingTitle: 'كل شحناتك،', landingTitleAccent: 'في مسار واضح.',
        landingDescription: 'تابع حركة الشحنات والحاويات من المغادرة حتى الوصول، وأدر تفاصيل رحلاتك من لوحة واحدة.',
        landingCta: 'ابدأ الآن', landingFootnote: 'منصة واحدة لمتابعة عملياتك اللوجستية بثقة.',
        brandCaption: 'ذكاء للعمليات البحرية',
        mapNav: 'المسارات', pricingNav: 'الباقات',
        landingMapEyebrow: 'رؤية تشغيلية أوضح',
        landingMapTitle: 'المسارات البحرية، في لمحة واحدة',
        landingMapDescription: 'تصوّر توضيحي لمسارات الشحن ونقاط العبور ومؤشرات الوصول، ضمن تجربة موحّدة لإدارة العمليات.',
        mapDemoLabel: 'خريطة توضيحية · بيانات تجريبية',
        mapAriaLabel: 'خريطة توضيحية لمسار بحري',
        mapOriginShanghai: 'شنغهاي', mapStopSingapore: 'سنغافورة',
        mapStopJeddah: 'جدة', mapDestinationAden: 'عدن',
        mapActiveRoute: 'مسار نشط', mapVesselCount: 'سفن قيد المتابعة',
        pricingEyebrow: 'خطط مرنة', pricingTitle: 'اختر نقطة انطلاقك',
        pricingDescription: 'باقات مقترحة لمراحل مختلفة من نمو عملياتك اللوجستية.',
        planStarter: 'الاستكشاف', planGrowth: 'النمو', planEnterprise: 'المؤسسات',
        planStarterDescription: 'ابدأ بتنظيم شحناتك في لوحة واحدة.',
        planGrowthDescription: 'أدوات متابعة إضافية للفرق النامية.',
        planEnterpriseDescription: 'حلول مخصصة للعمليات واسعة النطاق.',
        planFree: 'مجانًا', planMonth: '/ شهريًا', planQuote: 'حسب الطلب',
        planDemoFeature: 'إدارة الشحنات يدويًا', planBasicTracking: 'بحث وتتبع من البيانات المسجلة',
        planCsvFeature: 'تصدير تقارير CSV', planTeamFeature: 'مساحة عمل للفريق',
        planAnalyticsFeature: 'تحليلات تشغيلية متقدمة', planSupportFeature: 'دعم وتكاملات مخصصة',
        choosePlan: 'ابدأ الآن', contactUs: 'تواصل معنا',
        pricingDisclaimer: 'هذه الباقات والأسعار استرشادية لعرض الفكرة فقط؛ لا توجد حاليًا اشتراكات أو مدفوعات مفعّلة.',
        backToTop: 'العودة إلى الأعلى',
        landingNav: 'روابط الموقع',
        visualRoute: 'مسار الشحنة', visualVessel: 'سفينة شحن · في عرض البحر',
        visualOrigin: 'ميناء المغادرة', visualDestination: 'ميناء الوصول',
        visualArriving: 'الوصول المتوقع', visualOnTime: 'على المسار',
        mainMenu: 'القائمة الرئيسية', workspace: 'مساحة العمل', overview: 'نظرة عامة',
        shipments: 'الشحنات', trackingCenter: 'مركز متابعة الشحنات',
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
        authTitle: 'تسجيل الدخول إلى ShipIntel AI',
        authDescription: 'سجّل الدخول لعرض شحناتك المحفوظة بأمان.',
        authName: 'الاسم',
        authEmail: 'البريد الإلكتروني',
        authPassword: 'كلمة المرور (8 أحرف على الأقل)',
        authSubmit: 'تسجيل الدخول',
        authRegister: 'إنشاء حساب جديد',
        authSwitchLogin: 'لديك حساب؟ تسجيل الدخول',
        authSwitchRegister: 'ليس لديك حساب؟ إنشاء حساب',
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
        languageButton: 'English', languageLabel: 'Switch language'
    },
    en: {
        pageTitle: 'ShipIntel AI | Shipment Dashboard',
        landingPageTitle: 'ShipIntel AI | Shipment Platform',
        home: 'Home', landingEyebrow: 'Maritime intelligence, clearer visibility',
        landingTitle: 'Every shipment,', landingTitleAccent: 'on a clear route.',
        landingDescription: 'Follow cargo and containers from departure to arrival, and manage every journey from one dashboard.',
        landingCta: 'Get started', landingFootnote: 'One place to follow your logistics with confidence.',
        brandCaption: 'MARITIME OPERATIONS INTELLIGENCE',
        mapNav: 'Routes', pricingNav: 'Plans',
        landingMapEyebrow: 'Operational visibility',
        landingMapTitle: 'Global routes, at a glance',
        landingMapDescription: 'A demonstrative view of shipping lanes, transit points, and arrival signals—all within one operations experience.',
        mapDemoLabel: 'Illustrative map · Sample data',
        mapAriaLabel: 'Illustrative map of a maritime route',
        mapOriginShanghai: 'Shanghai', mapStopSingapore: 'Singapore',
        mapStopJeddah: 'Jeddah', mapDestinationAden: 'Aden',
        mapActiveRoute: 'Active route', mapVesselCount: 'Vessels monitored',
        pricingEyebrow: 'Flexible plans', pricingTitle: 'Choose your starting point',
        pricingDescription: 'Suggested plans for different stages of your logistics operations.',
        planStarter: 'Explorer', planGrowth: 'Growth', planEnterprise: 'Enterprise',
        planStarterDescription: 'Start organizing shipments in one place.',
        planGrowthDescription: 'More visibility tools for growing teams.',
        planEnterpriseDescription: 'Tailored solutions for large-scale operations.',
        planFree: 'Free', planMonth: '/ month', planQuote: 'Custom',
        planDemoFeature: 'Manual shipment management', planBasicTracking: 'Search and track saved records',
        planCsvFeature: 'CSV report export', planTeamFeature: 'Team workspace',
        planAnalyticsFeature: 'Advanced operational analytics', planSupportFeature: 'Dedicated support and integrations',
        choosePlan: 'Get started', contactUs: 'Contact us',
        pricingDisclaimer: 'Plans and prices are illustrative only; subscriptions and payments are not currently available.',
        backToTop: 'Back to top',
        landingNav: 'Site navigation',
        visualRoute: 'Shipment route', visualVessel: 'Cargo vessel · at sea',
        visualOrigin: 'Origin port', visualDestination: 'Destination port',
        visualArriving: 'Estimated arrival', visualOnTime: 'On schedule',
        mainMenu: 'Main menu', workspace: 'Workspace', overview: 'Overview',
        shipments: 'Shipments', trackingCenter: 'Shipment tracking center',
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
        authTitle: 'Sign in to ShipIntel AI',
        authDescription: 'Sign in to securely view your saved shipments.',
        authName: 'Name',
        authEmail: 'Email address',
        authPassword: 'Password (at least 8 characters)',
        authSubmit: 'Sign in',
        authRegister: 'Create account',
        authSwitchLogin: 'Already have an account? Sign in',
        authSwitchRegister: "Don't have an account? Create one",
        authForgotPassword: 'Forgot password?',
        authResetTitle: 'Reset your password',
        authResetDescription: 'Choose a new password for your account.',
        authResetSubmit: 'Save new password',
        authResetComplete: 'Your password has been updated.',
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
        languageButton: 'العربية', languageLabel: 'تغيير اللغة'
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

    document.querySelectorAll('.language-toggle').forEach(languageButton => {
        languageButton.textContent = t('languageButton');
        languageButton.setAttribute('aria-label', t('languageLabel'));
    });
    updateAuthMode();
    updateSessionLabels();
    if (isDashboard) {
        document.getElementById('addModalTitle').textContent =
            Number.parseInt(document.getElementById('editIndex').value, 10) >= 0 ? t('editTitle') : t('addTitle');
        renderFilteredShipments();
        if (activeTrackingIndex !== null) openTrackingModal(activeTrackingIndex);
    }
}

function updateAuthMode() {
    const nameField = document.getElementById('authNameField');
    const submit = document.getElementById('authSubmit');
    const switchMode = document.getElementById('authModeToggle');
    const forgotPassword = document.getElementById('authForgotPassword');
    const title = document.getElementById('authTitle');
    const description = document.getElementById('authDescription');
    const registering = authMode === 'register';
    const resetting = authMode === 'reset';
    if (!nameField || !submit || !switchMode) return;
    nameField.hidden = !registering;
    nameField.querySelector('input').required = registering;
    submit.textContent = resetting ? t('authResetSubmit') : registering ? t('authRegister') : t('authSubmit');
    switchMode.textContent = registering ? t('authSwitchLogin') : t('authSwitchRegister');
    switchMode.hidden = resetting;
    if (forgotPassword) forgotPassword.hidden = registering || resetting;
    if (title) title.textContent = resetting ? t('authResetTitle') : t('authTitle');
    if (description) description.textContent = resetting ? t('authResetDescription') : t('authDescription');
    document.getElementById('authPassword').autocomplete = resetting ? 'new-password' : 'current-password';
}

function updateSessionLabels() {
    const identity = document.getElementById('currentUserName');
    const role = document.getElementById('currentUserRole');
    const signOutButton = document.getElementById('signOutButton');
    if (!identity || !role || !signOutButton) return;
    if (cloudUser && cloudProfile) {
        identity.textContent = cloudProfile.display_name || cloudUser.email || '';
        role.textContent = cloudProfile.role === 'admin' ? t('authRoleAdmin') : t('authRoleUser');
        signOutButton.hidden = false;
    } else {
        identity.textContent = '';
        role.textContent = '';
        signOutButton.hidden = true;
    }
    const status = document.getElementById('cloudStatus');
    const footer = document.getElementById('footerStatus');
    if (status) status.textContent = cloudConfigured && cloudUser ? t('cloudReady') : t('localDataNote');
    if (footer) footer.textContent = cloudConfigured && cloudUser ? t('cloudFooterNote') : t('footerNote');
}

function showAuthFeedback(message, isError = false) {
    const feedback = document.getElementById('authFeedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle('error', isError);
}

async function loadAuthenticatedDashboard(user) {
    if (!user || !window.shipIntelBackend) return;
    const authGate = document.getElementById('authGate');
    const appShell = document.getElementById('appShell');
    showAuthFeedback(t('authLoading'));
    try {
        cloudProfile = await window.shipIntelBackend.getProfile();
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
        showAuthFeedback(`${t('cloudLoadError')} ${error.message}`, true);
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
    showAuthFeedback('');
}

async function submitAuthForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = document.getElementById('authSubmit');
    submitButton.disabled = true;
    showAuthFeedback('');
    try {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        const backend = window.shipIntelBackend;
        if (authMode === 'reset') {
            const { error } = await backend.updatePassword(password);
            if (error) throw error;
            passwordRecoveryRequested = false;
            authMode = 'login';
            updateAuthMode();
            await loadAuthenticatedDashboard(cloudUser);
            document.getElementById('cloudStatus').textContent = t('authResetComplete');
            form.reset();
        } else if (authMode === 'register') {
            const fullName = document.getElementById('authName').value.trim();
            const { data, error } = await backend.signUp(email, password, fullName);
            if (error) throw error;
            if (data.session) {
                showAuthFeedback(t('authLoading'));
            } else {
                form.reset();
                authMode = 'login';
                updateAuthMode();
                showAuthFeedback(t('authCheckEmail'));
            }
        } else {
            const { error } = await backend.signIn(email, password);
            if (error) throw error;
            showAuthFeedback(t('authLoading'));
        }
    } catch (error) {
        console.error('فشلت عملية المصادقة.', error);
        showAuthFeedback(error.message, true);
    } finally {
        submitButton.disabled = false;
    }
}

async function sendPasswordReset() {
    const email = document.getElementById('authEmail').value.trim();
    if (!email) {
        showAuthFeedback(t('authEmail'), true);
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
        showAuthFeedback(error.message, true);
    }
}

async function signOut() {
    try {
        const { error } = await window.shipIntelBackend.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('تعذر تسجيل الخروج من Supabase.', error);
        document.getElementById('cloudStatus').textContent = error.message;
    }
}

async function initializeDashboardBackend() {
    const authGate = document.getElementById('authGate');
    const appShell = document.getElementById('appShell');
    const backend = window.shipIntelBackend;
    cloudConfigured = Boolean(backend && backend.configured);

    if (!cloudConfigured) {
        authGate.hidden = true;
        appShell.hidden = false;
        updateSessionLabels();
        loadShipments();
        renderFilteredShipments();
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
        showAuthFeedback(`${t('cloudLoadError')} ${error.message}`, true);
        document.getElementById('authSubmit').disabled = true;
        document.getElementById('authModeToggle').disabled = true;
    }
}

function passLanguage(event) {
    event.currentTarget.href = `dashboard.html?lang=${currentLang}`;
}

function passLanguageToLanding(event) {
    event.currentTarget.href = `index.html?lang=${currentLang}`;
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLang);
    } catch (error) {
        console.error('تعذر حفظ تفضيل اللغة.', error);
    }
    applyLanguage();
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
    const query = input.value.trim().toLowerCase().replace(/[\s-]/g, '');
    if (!query) {
        feedback.textContent = t('emptySearch');
        input.focus();
        return;
    }

    const index = shipments.findIndex(s =>
        [s.bl, s.container].some(value => String(value).toLowerCase().replace(/[\s-]/g, '') === query)
    );
    if (index < 0) {
        feedback.textContent = t('shipmentNotFound');
        runFilter();
        return;
    }

    feedback.textContent = '';
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
    if (timeline) {
        timeline.innerHTML = (s.timeline || []).map(step => `
            <div class="timeline-step ${step.done ? 'completed' : ''}">
                <div class="timeline-title-text">${escapeHtml(currentLang === 'ar' ? step.titleAr : (timelineTranslations[step.titleAr] || step.titleEn))}</div>
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
        document.getElementById('searchFeedback').textContent = '';
    } catch (error) {
        console.error('تعذر حفظ الشحنة.', error);
        document.getElementById('searchFeedback').textContent = cloudConfigured
            ? `${t('cloudSaveError')} ${error.message}`
            : t('storageError');
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
            document.getElementById('searchFeedback').textContent = '';
        } catch (error) {
            console.error('تعذر حذف الشحنة.', error);
            document.getElementById('searchFeedback').textContent = cloudConfigured
                ? `${t('cloudDeleteError')} ${error.message}`
                : t('storageError');
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
        document.getElementById("searchFeedback").textContent = '';
    } catch (error) {
        console.error('تعذر حفظ الشحنات في التخزين المحلي.', error);
        document.getElementById("searchFeedback").textContent = t('storageError');
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
        document.getElementById("searchFeedback").textContent = t('loadError');
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
    try {
        const requestedLanguage = new URLSearchParams(location.search).get('lang');
        const savedLanguage = requestedLanguage || localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'ar' || savedLanguage === 'en') currentLang = savedLanguage;
        if (requestedLanguage === 'ar' || requestedLanguage === 'en') {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, requestedLanguage);
        }
    } catch (error) {
        console.error('تعذر قراءة تفضيل اللغة المحفوظ.', error);
    }
    applyLanguage();
    if (!document.getElementById('shipmentsTable')) return;

    document.getElementById("searchInput").addEventListener("input", () => {
        document.getElementById("searchFeedback").textContent = '';
        runFilter();
    });
    document.getElementById("trackingSearchForm").addEventListener("submit", event => {
        event.preventDefault();
        trackShipmentAction();
    });
    document.getElementById("addShipmentForm").addEventListener("submit", saveShipment);
    document.getElementById('authForm').addEventListener('submit', submitAuthForm);
    document.getElementById('authModeToggle').addEventListener('click', () => {
        authMode = authMode === 'login' ? 'register' : 'login';
        showAuthFeedback('');
        updateAuthMode();
    });
    document.getElementById('authForgotPassword').addEventListener('click', sendPasswordReset);
    document.getElementById('signOutButton').addEventListener('click', signOut);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeTrackingModal();
            closeAddModal();
        }
    });
    void initializeDashboardBackend();
});