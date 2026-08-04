export type AppLanguage = 'ko' | 'en' | 'de';

export type TranslationParams = Record<
  string,
  string | number
>;

const en = {
  'common.back': 'Back',
  'common.done': 'Done',
  'navigation.calendar': 'Calendar',
  'navigation.home': 'Home',
  'navigation.myPlants': 'My plants',
  'navigation.addPlant': 'Add plant',
  'navigation.profile': 'Profile',
  'profile.title': 'Profile',
  'profile.description':
    'Choose how your name appears in Poti.',
  'profile.nicknameLabel': 'Nickname',
  'profile.nicknamePlaceholder': 'For example, Jinnie',
  'profile.nicknameHelp':
    'Use up to {{maximum}} characters.',
  'profile.characterCount': '{{current}}/{{maximum}}',
  'profile.save': 'Save nickname',
  'profile.saving': 'Saving...',
  'profile.saved': 'Nickname saved.',
  'profile.loadError':
    'Your profile could not be loaded.',
  'profile.saveError':
    'Your nickname could not be saved. Please try again.',
  'profile.nicknameRequired': 'Enter a nickname.',
  'profile.nicknameTooLong':
    'Use no more than {{maximum}} characters.',
  'profile.guestTitle': 'Guest account',
  'profile.guestNotice':
    'Your nickname and plant records belong to this guest account. If the app is deleted or you change devices, you may lose access to them.',
  'profile.protectedTitle': 'Protected account',
  'profile.protectedNotice':
    'Your nickname and plant records remain linked to your current account.',
  'myPlants.emptyTitle': 'No plants yet',
  'myPlants.emptyDescription':
    'Add your first plant and start caring for it with Poti.',
  'myPlants.temperature': 'Temperature',
  'myPlants.humidity': 'Humidity',
  'myPlants.petSafe': 'Pet safe',
  'myPlants.petToxic': 'Toxic to pets',
  'plantDetail.title': 'Plant details',
  'plantDetail.loading': 'Loading plant details...',
  'plantDetail.loadError':
    'Could not load this plant. Please try again.',
  'plantDetail.notFound': 'Plant not found.',
  'plantDetail.watering': 'Watering',
  'plantDetail.wateringEveryDays':
    'Every {{days}} days',
  'plantDetail.currentStatus': 'Current status',
  'plantDetail.lastWatering': 'Last watered',
  'plantDetail.nextWatering': 'Next watering',
  'plantDetail.neverWatered': 'Not watered yet',
  'plantDetail.dueToday': 'Water today',
  'plantDetail.overdueOneDay': '1 day overdue',
  'plantDetail.overdueDays': '{{days}} days overdue',
  'plantDetail.dueInOneDay': 'In 1 day',
  'plantDetail.dueInDays': 'In {{days}} days',
  'plantDetail.temperature': 'Ideal temperature',
  'plantDetail.humidity': 'Ideal humidity',
  'plantDetail.petSafety': 'Pet safety',
  'plantDetail.petSafe': 'Safe',
  'plantDetail.petToxic': 'Toxic',
  'plantDetail.noInformation': 'No information',
  'plantDetail.historyTitle': 'Recent watering',
  'plantDetail.historyEmpty':
    'No watering records yet.',
  'plantDetail.today': 'Today',
  'plantDetail.edit': 'Edit plant',
  'plantDetail.delete': 'Delete plant',
  'plantDetail.deleteConfirmTitle': 'Delete {{name}}?',
  'plantDetail.deleteConfirmDescription':
    'This plant will no longer appear on the home screen or watering list.',
  'plantDetail.deleteAction': 'Delete',
  'plantDetail.deleting': 'Deleting...',
  'plantDetail.cancel': 'Cancel',
  'plantDetail.deleteError':
    'Could not delete this plant. Please try again.',
  'editPlant.eyebrow': 'EDIT PLANT',
  'editPlant.title': 'Edit plant',
  'editPlant.description':
    'Update its name and watering schedule.',
  'editPlant.loading': 'Loading plant details...',
  'editPlant.loadError':
    'Could not load this plant. Please try again.',
  'editPlant.saveError':
    'Could not save your changes. Please try again.',
  'editPlant.basicInfo': 'Basic information',
  'editPlant.customName': 'Custom name',
  'editPlant.changeType': 'Change plant type',
  'editPlant.closeTypeChange': 'Close plant type search',
  'editPlant.lastWateredTitle': 'Last watered',
  'editPlant.lastWateredDescription':
    'Choose the most recent date you watered this plant.',
  'editPlant.noWateringRecord': 'No watering record',
  'editPlant.clearWateringRecord':
    'Clear watering record',
  'editPlant.save': 'Save changes',
  'editPlant.saving': 'Saving...',
  'location.title': 'Location',
  'location.description':
    'Choose where you keep this plant.',
  'location.selectAccessibility': 'Choose plant location',
  'location.loading': 'Loading locations...',
  'location.unset': 'No location',
  'location.sheetTitle': 'Plant location',
  'location.closeAccessibility': 'Close location picker',
  'location.selectNamed': 'Select {{name}}',
  'location.deleteNamed': 'Delete {{name}}',
  'location.delete': 'Delete',
  'location.newNamePlaceholder': 'New location name',
  'location.add': 'Add',
  'location.addNew': '+ Add new location',
  'location.loadError': 'Could not load locations.',
  'location.nameRequired': 'Enter a location name.',
  'location.duplicateError':
    'A location with this name already exists.',
  'location.addError': 'Could not add the location.',
  'location.deleteError': 'Could not delete the location.',
  'location.default.livingRoom': 'Living room',
  'location.default.bedroom': 'Bedroom',
  'location.default.kitchen': 'Kitchen',
  'location.default.bathroom': 'Bathroom',
  'location.default.balcony': 'Balcony',
  'location.default.study': 'Study',
  'location.default.entryway': 'Entryway',
  'location.default.outdoors': 'Outdoors',
  'onboarding.skip': 'Skip',
  'onboarding.next': 'Next',
  'onboarding.start': 'Start using Poti',
  'onboarding.settingsTitle': 'View feature tour again',
  'onboarding.settingsDescription':
    'See the introduction to Poti again.',
  'onboarding.todayTitle': 'Plant care today',
  'onboarding.todayDescription':
    'See which plants need care today and record watering with a single tap.',
  'onboarding.plantsTitle': 'Add and manage plants',
  'onboarding.plantsDescription':
    'Add plants and manage their details and care schedules.',
  'auth.loading': 'Preparing your plant space...',
  'auth.createError': 'Could not create your plant space',
  'auth.connectionError':
    'Check your internet connection and try again.',
  'auth.retry': 'Try again',
  'auth.genericError':
    'Something went wrong while signing in. Please try again.',
  'notification.testBody':
    'Notifications are working correctly!',
  'addPlant.eyebrow': 'NEW PLANT',
  'addPlant.title': 'Add plant',
  'addPlant.selectSpecies': 'What kind of plant is it?',
  'addPlant.selectSpeciesDescription':
    'Choose a popular plant or search by name and scientific name.',
  'addPlant.featuredPlants': 'Popular plants',
  'addPlant.search': 'Search plants',
  'addPlant.searchPlaceholder':
    'Search name, scientific name, or cultivar',
  'addPlant.catalogLoading':
    'Loading the plant catalog...',
  'addPlant.searching': 'Searching...',
  'addPlant.noSearchResults':
    'No matching plants found.',
  'addPlant.selectedPlant': 'Selected plant',
  'addPlant.nicknameLabel':
    'What would you like to call this plant?',
  'addPlant.nicknameDescription':
    'Add a name or nickname that is easy to recognize.',
  'addPlant.nicknamePlaceholder': 'For example, Sprout',
  'addPlant.nicknameAutoHint':
    'Leave it blank and Poti will choose a name for you.',
  'addPlant.characterCount': '{{current}}/{{maximum}}',
  'addPlant.wateringTitle':
    'How often should it be watered?',
  'addPlant.wateringDescription':
    'Use the recommended schedule or set your own interval.',
  'addPlant.wateringAutomatic': 'Automatic recommendation',
  'addPlant.wateringRecommended':
    'Water every {{days}} days.',
  'addPlant.wateringRecommendedOne': 'Water every day.',
  'addPlant.wateringSelectPlant':
    'Choose a plant type to see its recommended schedule.',
  'addPlant.wateringManual': 'Set manually',
  'addPlant.wateringManualDescription':
    'Enter a watering interval that suits your environment.',
  'addPlant.wateringDaysQuestion':
    'How many days between watering?',
  'addPlant.wateringDaysUnit': 'days',
  'addPlant.save': 'Add plant',
  'addPlant.saving': 'Saving...',
  'addPlant.errors.catalogLoad':
    'The new plant catalog could not be loaded. The previous list is still available.',
  'addPlant.errors.search':
    'Search failed. Please try again shortly.',
  'addPlant.errors.speciesRequired':
    'Please choose a plant type first.',
  'addPlant.errors.automaticUnavailable':
    'Choose a plant with a recommendation or set the interval manually.',
  'addPlant.errors.wateringDaysRequired':
    'Enter the number of days.',
  'addPlant.errors.invalidWateringDays':
    'Enter a whole number from 1 to 365.',
  'addPlant.errors.save':
    'The plant could not be saved. Please try again shortly.',
  'home.settingsLabel': 'Open settings',
  'home.settingsHint': 'Change the theme and language.',
  'home.greeting': 'Everything is growing well today',
  'home.namedGreeting': '{{nickname}}’s plants',
  'home.greetingSubtitle':
    'See which plants need water and record their care.',
  'home.statisticsLoading': 'Loading care statistics...',
  'home.statisticsError':
    'Care statistics could not be loaded.',
  'home.plantsLoading': 'Loading your plants...',
  'home.plantsError':
    'Your plants could not be loaded. Please try again shortly.',
  'home.todayCare': 'Plants to care for today',
  'home.noPlantsDueTitle': 'Everything is fine today',
  'home.noPlantsDueDescription':
    'No plants need to be watered right now.',
  'home.waitingForWater': 'Waiting for water',
  'home.waterToday': 'Water today',
  'home.wateringDueToday': 'Watering day is today',
  'home.wateringLate': 'Watering is overdue',
  'home.wateringOneDayLate': '1 day overdue',
  'home.wateringDaysLate': '{{days}} days overdue',
  'home.remainingPlants':
    '{{count}} plants still need care today',
  'home.waterAccessibility': 'Water {{name}}',
  'home.recordingWatering': 'Recording...',
  'home.watered': '💧 Watered',
  'home.progress':
    'Plant {{current}} of {{total}} today',
  'home.myPlants': 'My plants',
  'home.plantCountOne': '1 plant',
  'home.plantCount': '{{count}} plants',
  'home.openPlant': 'Open details for {{name}}',
  'home.addPlantAccessibility': 'Add a new plant',
  'home.addPlant': 'Add plant',
  'home.newPot': 'New pot',
  'home.waterTodayShort': 'Water today',
  'home.waterTomorrow': 'Water tomorrow',
  'home.wateringDaysRemaining': '{{days}} days left',
  'home.undo': 'Undo',
  'home.wateredMessage': '{{name}} was watered.',
  'home.wateringError':
    'Watering could not be recorded. Please try again.',
  'home.undoError': 'Undo failed.',
  'home.statisticsActivePlants': '🌱 Plants in care',
  'home.statisticsStreak': '🔥 Care streak',
  'home.statisticsStreakValueOne': '1 day',
  'home.statisticsStreakValue': '{{count}} days',
  'home.statisticsMonthlyWatering':
    '💧 Waterings this month',
  'home.statisticsMonthlyWateringValueOne':
    '1 time',
  'home.statisticsMonthlyWateringValue':
    '{{count}} times',
  'home.calendar.managedPlantOne':
    '🌱 Caring for 1 plant',
  'home.calendar.managedPlants':
    '🌱 Caring for {{count}} plants',
  'home.calendar.wateringDue': 'Watering due',
  'home.calendar.watered': 'Watered',
  'home.calendar.today': 'Today',
  'home.calendar.previousMonth': 'Previous month',
  'home.calendar.nextMonth': 'Next month',
  'home.calendar.returnToday':
    'Return to this month',
  'home.calendar.loading':
    'Loading your care calendar...',
  'home.calendar.error':
    'The care calendar could not be loaded.',
  'home.careToday.water': 'Water plant',
  'home.careToday.watered': 'Watered ✓',
  'home.careToday.complete':
    "Today's plant care is complete.",
  'settings.title': 'Settings',
  'settings.back': 'Return home',
  'settings.theme.title': 'Theme',
  'settings.theme.description':
    'Choose how Poti looks.',
  'settings.theme.system': 'System setting',
  'settings.theme.systemDescription':
    'Match your device’s light or dark appearance.',
  'settings.theme.default': 'Forest',
  'settings.theme.defaultDescription':
    'Calm, leafy greens.',
  'settings.theme.cream': 'Cream',
  'settings.theme.creamDescription':
    'Warm and softly neutral.',
  'settings.theme.terracotta': 'Terracotta',
  'settings.theme.terracottaDescription':
    'Warm, grounded clay tones.',
  'settings.theme.darkNight': 'Dark Night',
  'settings.theme.darkNightDescription':
    'A restful deep forest for low light.',
  'settings.theme.pastelGarden':
    'Pastel Garden',
  'settings.theme.pastelGardenDescription':
    'Soft mint, powder blue, and blush pink.',
  'settings.language.title': 'Language',
  'settings.language.description':
    'Choose the language you want to use.',
  'settings.language.notice':
    'On first install, Poti follows your device language. Devices set to languages other than Korean or German start in English, and you can change it here at any time.',
  'settings.account.title': 'Account',
  'settings.account.description':
    'Choose how your plant data is kept.',
  'settings.account.guest': 'Using as a guest',
  'settings.account.protected':
    'Protected with Apple',
  'settings.account.idChecking': 'Checking',
  'settings.account.guestNotice':
    'Guest data is linked only to this device. If you delete the app, change devices, or sign out, you may not be able to access your existing plant records again.',
  'settings.account.appleUnavailable':
    'Connect with Apple is available on supported iOS devices.',
  'settings.account.connecting':
    'Connecting your Apple account...',
  'settings.account.protectedNotice':
    'If you reinstall the app or move to another iPhone, sign in with the same Apple account to access your plant records again.',
  'settings.deleteAccount.sectionTitle': 'Danger zone',
  'settings.deleteAccount.sectionDescription':
    'Permanently delete this account and all plant data linked to it.',
  'settings.deleteAccount.action': 'Delete account and all data',
  'settings.deleteAccount.deleting': 'Deleting account...',
  'settings.deleteAccount.firstTitle': 'Delete your account and data?',
  'settings.deleteAccount.firstDescription':
    'Your plants and all care records will be permanently deleted. This cannot be undone.',
  'settings.deleteAccount.finalTitle': 'Are you sure?',
  'settings.deleteAccount.finalDescription':
    'Your data cannot be recovered after deletion.',
  'settings.deleteAccount.cancel': 'Cancel',
  'settings.deleteAccount.continue': 'Continue',
  'settings.deleteAccount.permanentAction': 'Delete permanently',
  'settings.deleteAccount.error':
    'Your account could not be deleted. You are still signed in. Please try again.',
} as const;

export type TranslationKey = keyof typeof en;

const ko = {
  'common.back': '뒤로',
  'common.done': '완료',
  'navigation.calendar': '캘린더',
  'navigation.home': '홈',
  'navigation.myPlants': '내 식물',
  'navigation.addPlant': '식물 등록',
  'navigation.profile': '마이페이지',
  'profile.title': '마이페이지',
  'profile.description':
    '포티에서 사용할 이름을 설정해보세요.',
  'profile.nicknameLabel': '닉네임',
  'profile.nicknamePlaceholder': '예: 지니',
  'profile.nicknameHelp':
    '최대 {{maximum}}자까지 입력할 수 있어요.',
  'profile.characterCount': '{{current}}/{{maximum}}',
  'profile.save': '닉네임 저장',
  'profile.saving': '저장 중...',
  'profile.saved': '닉네임을 저장했어요.',
  'profile.loadError':
    '프로필을 불러오지 못했어요.',
  'profile.saveError':
    '닉네임을 저장하지 못했어요. 다시 시도해주세요.',
  'profile.nicknameRequired': '닉네임을 입력해주세요.',
  'profile.nicknameTooLong':
    '닉네임은 {{maximum}}자 이내로 입력해주세요.',
  'profile.guestTitle': '게스트로 사용 중',
  'profile.guestNotice':
    '닉네임과 식물 기록은 현재 게스트 계정에 연결돼요. 앱을 삭제하거나 기기를 변경하면 기존 기록에 접근하지 못할 수 있어요.',
  'profile.protectedTitle': '보호된 계정',
  'profile.protectedNotice':
    '닉네임과 식물 기록은 현재 계정에 안전하게 연결돼요.',
  'myPlants.emptyTitle': '아직 등록한 식물이 없어요',
  'myPlants.emptyDescription':
    '첫 식물을 등록하고 포티와 함께 돌봄을 시작해보세요.',
  'myPlants.temperature': '적정 온도',
  'myPlants.humidity': '적정 습도',
  'myPlants.petSafe': '반려동물 안전',
  'myPlants.petToxic': '반려동물 독성 있음',
  'plantDetail.title': '식물 정보',
  'plantDetail.loading': '식물 정보를 불러오고 있어요...',
  'plantDetail.loadError':
    '식물 정보를 불러오지 못했어요. 다시 시도해주세요.',
  'plantDetail.notFound': '식물 정보를 찾을 수 없어요.',
  'plantDetail.watering': '물주기',
  'plantDetail.wateringEveryDays': '{{days}}일마다',
  'plantDetail.currentStatus': '현재 상태',
  'plantDetail.lastWatering': '마지막 물주기',
  'plantDetail.nextWatering': '다음 물주기',
  'plantDetail.neverWatered': '아직 없음',
  'plantDetail.dueToday': '오늘 물 주는 날',
  'plantDetail.overdueOneDay': '1일 지났어요',
  'plantDetail.overdueDays': '{{days}}일 지났어요',
  'plantDetail.dueInOneDay': '1일 후',
  'plantDetail.dueInDays': '{{days}}일 후',
  'plantDetail.temperature': '적정 온도',
  'plantDetail.humidity': '적정 습도',
  'plantDetail.petSafety': '반려동물 안전성',
  'plantDetail.petSafe': '안전',
  'plantDetail.petToxic': '독성 있음',
  'plantDetail.noInformation': '정보 없음',
  'plantDetail.historyTitle': '최근 물 준 기록',
  'plantDetail.historyEmpty': '아직 물 준 기록이 없어요.',
  'plantDetail.today': '오늘',
  'plantDetail.edit': '정보 수정',
  'plantDetail.delete': '식물 삭제',
  'plantDetail.deleteConfirmTitle': '{{name}}, 삭제할까요?',
  'plantDetail.deleteConfirmDescription':
    '삭제하면 홈 화면과 물주기 목록에서 더 이상 표시되지 않아요.',
  'plantDetail.deleteAction': '삭제하기',
  'plantDetail.deleting': '삭제하고 있어요...',
  'plantDetail.cancel': '취소',
  'plantDetail.deleteError':
    '식물을 삭제하지 못했어요. 다시 시도해주세요.',
  'editPlant.eyebrow': '식물 수정',
  'editPlant.title': '식물 정보 수정',
  'editPlant.description':
    '이름과 물주기 설정을 변경할 수 있어요.',
  'editPlant.loading': '식물 정보를 불러오고 있어요...',
  'editPlant.loadError':
    '식물 정보를 불러오지 못했어요. 다시 시도해주세요.',
  'editPlant.saveError':
    '수정 내용을 저장하지 못했어요. 다시 시도해주세요.',
  'editPlant.basicInfo': '기본 정보',
  'editPlant.customName': '사용자 지정 이름',
  'editPlant.changeType': '종류 변경',
  'editPlant.closeTypeChange': '종류 변경 닫기',
  'editPlant.lastWateredTitle': '마지막으로 물 준 날짜',
  'editPlant.lastWateredDescription':
    '이 식물에 마지막으로 물을 준 날짜를 선택해주세요.',
  'editPlant.noWateringRecord': '아직 기록 없음',
  'editPlant.clearWateringRecord':
    '물 준 기록 없음으로 설정',
  'editPlant.save': '수정 내용 저장',
  'editPlant.saving': '저장하고 있어요...',
  'location.title': '위치',
  'location.description':
    '식물을 두는 장소를 선택할 수 있어요.',
  'location.selectAccessibility': '식물 위치 선택',
  'location.loading': '위치를 불러오는 중...',
  'location.unset': '위치 미지정',
  'location.sheetTitle': '식물 위치',
  'location.closeAccessibility': '위치 선택 닫기',
  'location.selectNamed': '{{name}} 선택',
  'location.deleteNamed': '{{name}} 삭제',
  'location.delete': '삭제',
  'location.newNamePlaceholder': '새 위치 이름',
  'location.add': '추가',
  'location.addNew': '+ 새 위치 추가',
  'location.loadError': '위치 목록을 불러오지 못했어요.',
  'location.nameRequired': '위치 이름을 입력해주세요.',
  'location.duplicateError':
    '이미 같은 이름의 위치가 있어요.',
  'location.addError': '새 위치를 추가하지 못했어요.',
  'location.deleteError': '위치를 삭제하지 못했어요.',
  'location.default.livingRoom': '거실',
  'location.default.bedroom': '침실',
  'location.default.kitchen': '주방',
  'location.default.bathroom': '욕실',
  'location.default.balcony': '발코니',
  'location.default.study': '서재',
  'location.default.entryway': '현관',
  'location.default.outdoors': '야외',
  'onboarding.skip': '건너뛰기',
  'onboarding.next': '다음',
  'onboarding.start': '포티 시작하기',
  'onboarding.settingsTitle': '온보딩 다시 보기',
  'onboarding.settingsDescription':
    '처음 보는 Poti 사용 안내를 다시 확인합니다.',
  'onboarding.todayTitle': '오늘의 식물 관리',
  'onboarding.todayDescription':
    '오늘 관리할 식물을 확인하고 한 번의 탭으로 물주기를 기록해요.',
  'onboarding.plantsTitle': '식물 추가 및 관리',
  'onboarding.plantsDescription':
    '식물을 추가하고 정보와 관리 일정을 확인해요.',
  'auth.loading': '나만의 식물 공간을 준비하고 있어요...',
  'auth.createError': '사용자 공간을 만들지 못했어요',
  'auth.connectionError':
    '인터넷 연결을 확인하고 다시 시도해주세요.',
  'auth.retry': '다시 시도',
  'auth.genericError':
    '로그인 중 문제가 발생했어요. 다시 시도해주세요.',
  'notification.testBody':
    '알림 기능이 정상적으로 연결되었어요!',
  'addPlant.eyebrow': '새 식물',
  'addPlant.title': '식물 등록',
  'addPlant.selectSpecies': '어떤 식물인가요?',
  'addPlant.selectSpeciesDescription':
    '자주 찾는 식물을 고르거나 이름과 학명으로 검색해보세요.',
  'addPlant.featuredPlants': '자주 찾는 식물',
  'addPlant.search': '식물 검색',
  'addPlant.searchPlaceholder':
    '이름, 학명 또는 품종 검색',
  'addPlant.catalogLoading':
    '식물 카탈로그를 불러오고 있어요...',
  'addPlant.searching': '검색하고 있어요...',
  'addPlant.noSearchResults':
    '일치하는 식물을 찾지 못했어요.',
  'addPlant.selectedPlant': '선택한 식물',
  'addPlant.nicknameLabel':
    '이 식물을 뭐라고 부를까요?',
  'addPlant.nicknameDescription':
    '구분하기 쉬운 이름이나 애칭을 입력해주세요.',
  'addPlant.nicknamePlaceholder': '예: 초록이',
  'addPlant.nicknameAutoHint':
    '이름을 입력하지 않으면 자동으로 정해드려요.',
  'addPlant.characterCount': '{{current}}/{{maximum}}',
  'addPlant.wateringTitle':
    '물을 얼마나 자주 줄까요?',
  'addPlant.wateringDescription':
    '추천 주기를 사용하거나 직접 물주기 간격을 설정할 수 있어요.',
  'addPlant.wateringAutomatic': '자동 추천',
  'addPlant.wateringRecommended':
    '{{days}}일마다 물주기를 추천해요.',
  'addPlant.wateringRecommendedOne':
    '매일 물주기를 추천해요.',
  'addPlant.wateringSelectPlant':
    '식물 종류를 선택하면 추천 주기가 표시돼요.',
  'addPlant.wateringManual': '직접 설정',
  'addPlant.wateringManualDescription':
    '내 환경에 맞는 물주기 간격을 입력할게요.',
  'addPlant.wateringDaysQuestion':
    '며칠마다 물을 줄까요?',
  'addPlant.wateringDaysUnit': '일마다',
  'addPlant.save': '식물 등록하기',
  'addPlant.saving': '저장하고 있어요...',
  'addPlant.errors.catalogLoad':
    '새 식물 목록을 불러오지 못했습니다. 기존 식물 목록을 사용할 수 있어요.',
  'addPlant.errors.search':
    '검색하지 못했습니다. 잠시 후 다시 시도해주세요.',
  'addPlant.errors.speciesRequired':
    '먼저 식물을 선택해주세요.',
  'addPlant.errors.automaticUnavailable':
    '추천 주기가 있는 식물을 선택하거나 직접 설정해주세요.',
  'addPlant.errors.wateringDaysRequired':
    '며칠마다 줄지 입력해주세요.',
  'addPlant.errors.invalidWateringDays':
    '1부터 365 사이의 정수를 입력해주세요.',
  'addPlant.errors.save':
    '식물을 등록하지 못했어요. 잠시 후 다시 시도해주세요.',
  'home.settingsLabel': '환경설정 열기',
  'home.settingsHint': '테마와 언어를 설정합니다.',
  'home.greeting': '오늘도 잘 자라고 있어요',
  'home.namedGreeting': '{{nickname}}님의 식물',
  'home.greetingSubtitle':
    '물이 필요한 식물을 확인하고 바로 기록하세요.',
  'home.statisticsLoading':
    '관리 통계를 불러오고 있어요...',
  'home.statisticsError':
    '통계를 불러오지 못했습니다.',
  'home.plantsLoading': '내 식물을 불러오고 있어요...',
  'home.plantsError':
    '식물 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
  'home.todayCare': '오늘 돌볼 식물',
  'home.noPlantsDueTitle': '오늘은 모두 괜찮아요',
  'home.noPlantsDueDescription':
    '지금 바로 물을 줘야 하는 식물이 없어요.',
  'home.waitingForWater': '물을 기다리고 있어요',
  'home.waterToday': '오늘 물을 주세요',
  'home.wateringDueToday': '오늘 물 주는 날',
  'home.wateringLate': '물주기가 늦었어요',
  'home.wateringOneDayLate': '하루 늦었어요',
  'home.wateringDaysLate': '{{days}}일 늦었어요',
  'home.remainingPlants':
    '오늘 돌볼 식물이 {{count}}개 있어요',
  'home.waterAccessibility': '{{name}}에게 물주기',
  'home.recordingWatering': '기록하고 있어요...',
  'home.watered': '💧 물 줬어요',
  'home.progress':
    '오늘 {{total}}개 중 {{current}}번째',
  'home.myPlants': '내 식물',
  'home.plantCountOne': '1개',
  'home.plantCount': '{{count}}개',
  'home.openPlant': '{{name}} 상세 정보 열기',
  'home.addPlantAccessibility': '새 식물 추가',
  'home.addPlant': '식물 추가',
  'home.newPot': '새 화분',
  'home.waterTodayShort': '오늘 물 주세요',
  'home.waterTomorrow': '내일 물 주는 날',
  'home.wateringDaysRemaining': '{{days}}일 남았어요',
  'home.undo': '실행 취소',
  'home.wateredMessage': '{{name}}에게 물을 줬어요.',
  'home.wateringError':
    '물주기를 기록하지 못했어요. 다시 시도해주세요.',
  'home.undoError': '실행 취소에 실패했어요.',
  'home.statisticsActivePlants':
    '🌱 관리 중인 식물',
  'home.statisticsStreak': '🔥 연속 관리',
  'home.statisticsStreakValueOne': '1일',
  'home.statisticsStreakValue': '{{count}}일',
  'home.statisticsMonthlyWatering':
    '💧 이번 달 물주기',
  'home.statisticsMonthlyWateringValueOne':
    '1회',
  'home.statisticsMonthlyWateringValue':
    '{{count}}회',
  'home.calendar.managedPlantOne':
    '🌱 1개의 식물을 관리 중이에요',
  'home.calendar.managedPlants':
    '🌱 {{count}}개의 식물을 관리 중이에요',
  'home.calendar.wateringDue': '물 줄 날',
  'home.calendar.watered': '물 준 날',
  'home.calendar.today': '오늘',
  'home.calendar.previousMonth': '이전 달',
  'home.calendar.nextMonth': '다음 달',
  'home.calendar.returnToday': '이번 달로 돌아가기',
  'home.calendar.loading':
    '관리 달력을 불러오고 있어요...',
  'home.calendar.error':
    '관리 달력을 불러오지 못했어요.',
  'home.careToday.water': '물 주기',
  'home.careToday.watered': '물 줬어요 ✓',
  'home.careToday.complete':
    '오늘의 식물 돌봄을 모두 마쳤어요.',
  'settings.title': '환경설정',
  'settings.back': '홈으로 돌아가기',
  'settings.theme.title': '테마',
  'settings.theme.description':
    'Poti의 화면 분위기를 선택하세요.',
  'settings.theme.system': '시스템 설정',
  'settings.theme.systemDescription':
    '기기의 밝은 화면과 어두운 화면 설정을 따릅니다.',
  'settings.theme.default': '포레스트',
  'settings.theme.defaultDescription':
    '차분한 숲의 초록',
  'settings.theme.cream': '크림',
  'settings.theme.creamDescription':
    '따뜻하고 부드러운 크림',
  'settings.theme.terracotta': '테라코타',
  'settings.theme.terracottaDescription':
    '따뜻하고 차분한 구운 점토색',
  'settings.theme.darkNight': '어두운 밤',
  'settings.theme.darkNightDescription':
    '낮은 조명에 편안한 깊은 숲',
  'settings.theme.pastelGarden': '파스텔 정원',
  'settings.theme.pastelGardenDescription':
    '부드러운 민트와 파우더 블루, 핑크',
  'settings.language.title': '언어',
  'settings.language.description':
    '사용할 언어를 선택하세요.',
  'settings.language.notice':
    '처음 설치할 때는 기기 언어를 따릅니다. 한국어와 독일어 외의 기기 언어는 영어로 시작하며, 여기서 언제든 변경할 수 있습니다.',
  'settings.account.title': '계정',
  'settings.account.description':
    '내 식물 데이터를 보관하는 방법을 선택하세요.',
  'settings.account.guest': '게스트로 사용 중',
  'settings.account.protected':
    'Apple 계정으로 보호됨',
  'settings.account.idChecking': '확인 중',
  'settings.account.guestNotice':
    '게스트 데이터는 이 기기에만 연결됩니다. 앱을 삭제하거나 기기를 바꾸거나 로그아웃하면 기존 식물 기록에 다시 접근하지 못할 수 있습니다.',
  'settings.account.appleUnavailable':
    'Apple 계정 연결은 지원되는 iOS 기기에서 사용할 수 있습니다.',
  'settings.account.connecting':
    'Apple 계정을 연결하고 있어요...',
  'settings.account.protectedNotice':
    '앱을 다시 설치하거나 다른 iPhone으로 바꾸어도 같은 Apple 계정으로 로그인하면 식물 기록에 다시 접근할 수 있습니다.',
  'settings.deleteAccount.sectionTitle': '위험 작업',
  'settings.deleteAccount.sectionDescription':
    '이 계정과 연결된 모든 식물 데이터를 영구적으로 삭제합니다.',
  'settings.deleteAccount.action': '계정 및 전체 데이터 삭제',
  'settings.deleteAccount.deleting': '계정을 삭제하고 있어요...',
  'settings.deleteAccount.firstTitle': '계정과 데이터를 삭제할까요?',
  'settings.deleteAccount.firstDescription':
    '등록한 식물과 모든 관리 기록이 영구적으로 삭제되며 되돌릴 수 없습니다.',
  'settings.deleteAccount.finalTitle': '정말 삭제할까요?',
  'settings.deleteAccount.finalDescription':
    '삭제 후에는 데이터를 복구할 수 없습니다.',
  'settings.deleteAccount.cancel': '취소',
  'settings.deleteAccount.continue': '계속',
  'settings.deleteAccount.permanentAction': '영구 삭제',
  'settings.deleteAccount.error':
    '계정을 삭제하지 못했어요. 로그인 상태는 유지됩니다. 다시 시도해주세요.',
} satisfies Record<TranslationKey, string>;

const de = {
  'common.back': 'Zurück',
  'common.done': 'Fertig',
  'navigation.calendar': 'Kalender',
  'navigation.home': 'Start',
  'navigation.myPlants': 'Meine Pflanzen',
  'navigation.addPlant': 'Pflanze hinzufügen',
  'navigation.profile': 'Profil',
  'profile.title': 'Profil',
  'profile.description':
    'Lege fest, wie dein Name in Poti angezeigt wird.',
  'profile.nicknameLabel': 'Spitzname',
  'profile.nicknamePlaceholder': 'Zum Beispiel Jinnie',
  'profile.nicknameHelp':
    'Bis zu {{maximum}} Zeichen.',
  'profile.characterCount': '{{current}}/{{maximum}}',
  'profile.save': 'Spitzname speichern',
  'profile.saving': 'Wird gespeichert...',
  'profile.saved': 'Spitzname gespeichert.',
  'profile.loadError':
    'Dein Profil konnte nicht geladen werden.',
  'profile.saveError':
    'Dein Spitzname konnte nicht gespeichert werden. Bitte versuche es erneut.',
  'profile.nicknameRequired':
    'Gib einen Spitznamen ein.',
  'profile.nicknameTooLong':
    'Verwende höchstens {{maximum}} Zeichen.',
  'profile.guestTitle': 'Gastkonto',
  'profile.guestNotice':
    'Dein Spitzname und deine Pflanzendaten gehören zu diesem Gastkonto. Wenn du die App löschst oder das Gerät wechselst, kannst du den Zugriff darauf verlieren.',
  'profile.protectedTitle': 'Geschütztes Konto',
  'profile.protectedNotice':
    'Dein Spitzname und deine Pflanzendaten bleiben mit deinem aktuellen Konto verknüpft.',
  'myPlants.emptyTitle': 'Noch keine Pflanzen',
  'myPlants.emptyDescription':
    'Füge deine erste Pflanze hinzu und beginne die Pflege mit Poti.',
  'myPlants.temperature': 'Temperatur',
  'myPlants.humidity': 'Luftfeuchtigkeit',
  'myPlants.petSafe': 'Haustiersicher',
  'myPlants.petToxic': 'Giftig für Haustiere',
  'plantDetail.title': 'Pflanzendetails',
  'plantDetail.loading': 'Pflanzendaten werden geladen...',
  'plantDetail.loadError':
    'Die Pflanze konnte nicht geladen werden. Bitte versuche es erneut.',
  'plantDetail.notFound': 'Pflanze nicht gefunden.',
  'plantDetail.watering': 'Gießrhythmus',
  'plantDetail.wateringEveryDays':
    'Alle {{days}} Tage',
  'plantDetail.currentStatus': 'Status',
  'plantDetail.lastWatering': 'Zuletzt gegossen',
  'plantDetail.nextWatering': 'Nächstes Gießen',
  'plantDetail.neverWatered': 'Noch nicht gegossen',
  'plantDetail.dueToday': 'Heute gießen',
  'plantDetail.overdueOneDay': '1 Tag überfällig',
  'plantDetail.overdueDays':
    '{{days}} Tage überfällig',
  'plantDetail.dueInOneDay': 'In 1 Tag',
  'plantDetail.dueInDays': 'In {{days}} Tagen',
  'plantDetail.temperature': 'Idealtemperatur',
  'plantDetail.humidity': 'Ideale Luftfeuchtigkeit',
  'plantDetail.petSafety': 'Haustiersicherheit',
  'plantDetail.petSafe': 'Haustiersicher',
  'plantDetail.petToxic': 'Giftig',
  'plantDetail.noInformation': 'Keine Angabe',
  'plantDetail.historyTitle': 'Letzte Gießvorgänge',
  'plantDetail.historyEmpty':
    'Noch keine Gießvorgänge.',
  'plantDetail.today': 'Heute',
  'plantDetail.edit': 'Pflanze bearbeiten',
  'plantDetail.delete': 'Pflanze löschen',
  'plantDetail.deleteConfirmTitle': '{{name}} löschen?',
  'plantDetail.deleteConfirmDescription':
    'Die Pflanze wird nicht mehr auf der Startseite oder in der Gießliste angezeigt.',
  'plantDetail.deleteAction': 'Löschen',
  'plantDetail.deleting': 'Wird gelöscht...',
  'plantDetail.cancel': 'Abbrechen',
  'plantDetail.deleteError':
    'Die Pflanze konnte nicht gelöscht werden. Bitte versuche es erneut.',
  'editPlant.eyebrow': 'PFLANZE BEARBEITEN',
  'editPlant.title': 'Pflanze bearbeiten',
  'editPlant.description':
    'Ändere den Namen und den Gießrhythmus.',
  'editPlant.loading': 'Pflanzendaten werden geladen...',
  'editPlant.loadError':
    'Die Pflanze konnte nicht geladen werden. Bitte versuche es erneut.',
  'editPlant.saveError':
    'Die Änderungen konnten nicht gespeichert werden. Bitte versuche es erneut.',
  'editPlant.basicInfo': 'Grunddaten',
  'editPlant.customName': 'Eigener Name',
  'editPlant.changeType': 'Pflanzenart ändern',
  'editPlant.closeTypeChange': 'Pflanzensuche schließen',
  'editPlant.lastWateredTitle': 'Zuletzt gegossen',
  'editPlant.lastWateredDescription':
    'Wähle aus, wann du diese Pflanze zuletzt gegossen hast.',
  'editPlant.noWateringRecord': 'Noch kein Gießeintrag',
  'editPlant.clearWateringRecord': 'Gießeintrag entfernen',
  'editPlant.save': 'Änderungen speichern',
  'editPlant.saving': 'Wird gespeichert...',
  'location.title': 'Standort',
  'location.description':
    'Wähle aus, wo diese Pflanze steht.',
  'location.selectAccessibility': 'Pflanzenstandort auswählen',
  'location.loading': 'Standorte werden geladen...',
  'location.unset': 'Kein Standort',
  'location.sheetTitle': 'Pflanzenstandort',
  'location.closeAccessibility': 'Standortauswahl schließen',
  'location.selectNamed': '{{name}} auswählen',
  'location.deleteNamed': '{{name}} löschen',
  'location.delete': 'Löschen',
  'location.newNamePlaceholder': 'Neuer Standort',
  'location.add': 'Hinzufügen',
  'location.addNew': '+ Neuen Standort hinzufügen',
  'location.loadError':
    'Standorte konnten nicht geladen werden.',
  'location.nameRequired': 'Gib einen Standortnamen ein.',
  'location.duplicateError':
    'Ein Standort mit diesem Namen existiert bereits.',
  'location.addError':
    'Der Standort konnte nicht hinzugefügt werden.',
  'location.deleteError':
    'Der Standort konnte nicht gelöscht werden.',
  'location.default.livingRoom': 'Wohnzimmer',
  'location.default.bedroom': 'Schlafzimmer',
  'location.default.kitchen': 'Küche',
  'location.default.bathroom': 'Badezimmer',
  'location.default.balcony': 'Balkon',
  'location.default.study': 'Arbeitszimmer',
  'location.default.entryway': 'Flur',
  'location.default.outdoors': 'Draußen',
  'onboarding.skip': 'Überspringen',
  'onboarding.next': 'Weiter',
  'onboarding.start': 'Poti starten',
  'onboarding.settingsTitle': 'Einführung erneut ansehen',
  'onboarding.settingsDescription':
    'Sieh dir die Einführung in Poti noch einmal an.',
  'onboarding.todayTitle': 'Heutige Pflanzenpflege',
  'onboarding.todayDescription':
    'Sieh, welche Pflanzen heute Pflege brauchen, und halte das Gießen mit nur einem Tippen fest.',
  'onboarding.plantsTitle': 'Pflanzen hinzufügen und verwalten',
  'onboarding.plantsDescription':
    'Füge Pflanzen hinzu und verwalte ihre Informationen und Pflegepläne.',
  'auth.loading': 'Dein Pflanzenbereich wird vorbereitet...',
  'auth.createError':
    'Dein Pflanzenbereich konnte nicht erstellt werden',
  'auth.connectionError':
    'Prüfe deine Internetverbindung und versuche es erneut.',
  'auth.retry': 'Erneut versuchen',
  'auth.genericError':
    'Bei der Anmeldung ist etwas schiefgelaufen. Bitte versuche es erneut.',
  'notification.testBody':
    'Benachrichtigungen funktionieren einwandfrei!',
  'addPlant.eyebrow': 'NEUE PFLANZE',
  'addPlant.title': 'Pflanze hinzufügen',
  'addPlant.selectSpecies': 'Welche Pflanze ist es?',
  'addPlant.selectSpeciesDescription':
    'Wähle eine beliebte Pflanze oder suche nach Name und botanischem Namen.',
  'addPlant.featuredPlants': 'Beliebte Pflanzen',
  'addPlant.search': 'Pflanze suchen',
  'addPlant.searchPlaceholder':
    'Name, botanischen Namen oder Sorte suchen',
  'addPlant.catalogLoading':
    'Pflanzenkatalog wird geladen...',
  'addPlant.searching': 'Suche läuft...',
  'addPlant.noSearchResults':
    'Keine passende Pflanze gefunden.',
  'addPlant.selectedPlant': 'Ausgewählte Pflanze',
  'addPlant.nicknameLabel':
    'Wie möchtest du diese Pflanze nennen?',
  'addPlant.nicknameDescription':
    'Gib ihr einen leicht erkennbaren Namen oder Spitznamen.',
  'addPlant.nicknamePlaceholder': 'Zum Beispiel: Spross',
  'addPlant.nicknameAutoHint':
    'Wenn du das Feld leer lässt, wählt Poti einen Namen.',
  'addPlant.characterCount': '{{current}}/{{maximum}}',
  'addPlant.wateringTitle':
    'Wie oft soll sie gegossen werden?',
  'addPlant.wateringDescription':
    'Nutze den empfohlenen Rhythmus oder lege ein eigenes Intervall fest.',
  'addPlant.wateringAutomatic': 'Automatische Empfehlung',
  'addPlant.wateringRecommended':
    'Alle {{days}} Tage gießen.',
  'addPlant.wateringRecommendedOne': 'Einmal täglich gießen.',
  'addPlant.wateringSelectPlant':
    'Wähle eine Pflanzenart, um den empfohlenen Rhythmus zu sehen.',
  'addPlant.wateringManual': 'Selbst festlegen',
  'addPlant.wateringManualDescription':
    'Gib ein Gießintervall passend zu deiner Umgebung ein.',
  'addPlant.wateringDaysQuestion':
    'Nach wie vielen Tagen wieder gießen?',
  'addPlant.wateringDaysUnit': 'Tage',
  'addPlant.save': 'Pflanze hinzufügen',
  'addPlant.saving': 'Wird gespeichert...',
  'addPlant.errors.catalogLoad':
    'Der neue Pflanzenkatalog konnte nicht geladen werden. Die bisherige Liste ist verfügbar.',
  'addPlant.errors.search':
    'Die Suche ist fehlgeschlagen. Bitte versuche es später erneut.',
  'addPlant.errors.speciesRequired':
    'Bitte wähle zuerst eine Pflanze aus.',
  'addPlant.errors.automaticUnavailable':
    'Wähle eine Pflanze mit Empfehlung oder lege das Intervall selbst fest.',
  'addPlant.errors.wateringDaysRequired':
    'Gib die Anzahl der Tage ein.',
  'addPlant.errors.invalidWateringDays':
    'Gib eine ganze Zahl von 1 bis 365 ein.',
  'addPlant.errors.save':
    'Die Pflanze konnte nicht gespeichert werden. Bitte versuche es später erneut.',
  'home.settingsLabel': 'Einstellungen öffnen',
  'home.settingsHint':
    'Darstellung und Sprache ändern.',
  'home.greeting': 'Heute wächst alles gut',
  'home.namedGreeting': 'Pflanzen von {{nickname}}',
  'home.greetingSubtitle':
    'Sieh nach, welche Pflanzen Wasser brauchen, und halte die Pflege fest.',
  'home.statisticsLoading':
    'Pflegestatistik wird geladen...',
  'home.statisticsError':
    'Die Pflegestatistik konnte nicht geladen werden.',
  'home.plantsLoading':
    'Deine Pflanzen werden geladen...',
  'home.plantsError':
    'Deine Pflanzen konnten nicht geladen werden. Bitte versuche es später erneut.',
  'home.todayCare': 'Heute zu pflegende Pflanzen',
  'home.noPlantsDueTitle': 'Heute ist alles in Ordnung',
  'home.noPlantsDueDescription':
    'Im Moment muss keine Pflanze gegossen werden.',
  'home.waitingForWater': 'Wartet auf Wasser',
  'home.waterToday': 'Heute gießen',
  'home.wateringDueToday': 'Heute ist Gießtag',
  'home.wateringLate': 'Gießen ist überfällig',
  'home.wateringOneDayLate': '1 Tag überfällig',
  'home.wateringDaysLate':
    '{{days}} Tage überfällig',
  'home.remainingPlants':
    'Heute brauchen noch {{count}} Pflanzen Pflege',
  'home.waterAccessibility': '{{name}} gießen',
  'home.recordingWatering':
    'Wird gespeichert...',
  'home.watered': '💧 Gegossen',
  'home.progress':
    'Heute Pflanze {{current}} von {{total}}',
  'home.myPlants': 'Meine Pflanzen',
  'home.plantCountOne': '1 Pflanze',
  'home.plantCount': '{{count}} Pflanzen',
  'home.openPlant': 'Details für {{name}} öffnen',
  'home.addPlantAccessibility':
    'Neue Pflanze hinzufügen',
  'home.addPlant': 'Pflanze hinzufügen',
  'home.newPot': 'Neuer Topf',
  'home.waterTodayShort': 'Heute gießen',
  'home.waterTomorrow': 'Morgen gießen',
  'home.wateringDaysRemaining':
    'Noch {{days}} Tage',
  'home.undo': 'Rückgängig',
  'home.wateredMessage': '{{name}} wurde gegossen.',
  'home.wateringError':
    'Das Gießen konnte nicht gespeichert werden. Bitte versuche es erneut.',
  'home.undoError':
    'Rückgängig machen fehlgeschlagen.',
  'home.statisticsActivePlants':
    '🌱 Pflanzen in Pflege',
  'home.statisticsStreak': '🔥 Pflegeserie',
  'home.statisticsStreakValueOne': '1 Tag',
  'home.statisticsStreakValue': '{{count}} Tage',
  'home.statisticsMonthlyWatering':
    '💧 Gießvorgänge diesen Monat',
  'home.statisticsMonthlyWateringValueOne':
    '1 Mal',
  'home.statisticsMonthlyWateringValue':
    '{{count}} Mal',
  'home.calendar.managedPlantOne':
    '🌱 1 Pflanze in Pflege',
  'home.calendar.managedPlants':
    '🌱 {{count}} Pflanzen in Pflege',
  'home.calendar.wateringDue': 'Gießtag',
  'home.calendar.watered': 'Gegossen',
  'home.calendar.today': 'Heute',
  'home.calendar.previousMonth':
    'Vorheriger Monat',
  'home.calendar.nextMonth': 'Nächster Monat',
  'home.calendar.returnToday':
    'Zum aktuellen Monat',
  'home.calendar.loading':
    'Pflegekalender wird geladen...',
  'home.calendar.error':
    'Der Pflegekalender konnte nicht geladen werden.',
  'home.careToday.water': 'Pflanze gießen',
  'home.careToday.watered': 'Gegossen ✓',
  'home.careToday.complete':
    'Die Pflanzenpflege für heute ist geschafft.',
  'settings.title': 'Einstellungen',
  'settings.back': 'Zur Startseite',
  'settings.theme.title': 'Darstellung',
  'settings.theme.description':
    'Wähle das Aussehen von Poti.',
  'settings.theme.system': 'Systemeinstellung',
  'settings.theme.systemDescription':
    'Folgt der hellen oder dunklen Geräteeinstellung.',
  'settings.theme.default': 'Wald',
  'settings.theme.defaultDescription':
    'Ruhige, natürliche Grüntöne.',
  'settings.theme.cream': 'Creme',
  'settings.theme.creamDescription':
    'Warm und sanft neutral.',
  'settings.theme.terracotta': 'Terrakotta',
  'settings.theme.terracottaDescription':
    'Warme, ruhige Töne gebrannter Erde.',
  'settings.theme.darkNight': 'Dunkle Nacht',
  'settings.theme.darkNightDescription':
    'Ein ruhiger, tiefer Wald für wenig Licht.',
  'settings.theme.pastelGarden':
    'Pastellgarten',
  'settings.theme.pastelGardenDescription':
    'Sanftes Mint, Puderblau und Rosé.',
  'settings.language.title': 'Sprache',
  'settings.language.description':
    'Wähle die Sprache, die du verwenden möchtest.',
  'settings.language.notice':
    'Bei der ersten Installation folgt Poti der Gerätesprache. Bei anderen Sprachen als Koreanisch oder Deutsch startet die App auf Englisch. Du kannst die Sprache hier jederzeit ändern.',
  'settings.account.title': 'Konto',
  'settings.account.description':
    'Wähle, wie deine Pflanzendaten gespeichert werden.',
  'settings.account.guest': 'Als Gast verwenden',
  'settings.account.protected':
    'Mit Apple geschützt',
  'settings.account.idChecking': 'Wird geprüft',
  'settings.account.guestNotice':
    'Gastdaten sind nur mit diesem Gerät verbunden. Wenn du die App löschst, das Gerät wechselst oder dich abmeldest, kannst du möglicherweise nicht mehr auf deine bisherigen Pflanzendaten zugreifen.',
  'settings.account.appleUnavailable':
    'Mit Apple verbinden ist auf unterstützten iOS-Geräten verfügbar.',
  'settings.account.connecting':
    'Apple-Konto wird verbunden...',
  'settings.account.protectedNotice':
    'Nach einer Neuinstallation oder einem Wechsel zu einem anderen iPhone kannst du dich mit demselben Apple-Konto anmelden und wieder auf deine Pflanzendaten zugreifen.',
  'settings.deleteAccount.sectionTitle': 'Gefahrenbereich',
  'settings.deleteAccount.sectionDescription':
    'Dieses Konto und alle damit verknüpften Pflanzendaten dauerhaft löschen.',
  'settings.deleteAccount.action': 'Konto und alle Daten löschen',
  'settings.deleteAccount.deleting': 'Konto wird gelöscht...',
  'settings.deleteAccount.firstTitle': 'Konto und Daten löschen?',
  'settings.deleteAccount.firstDescription':
    'Deine Pflanzen und alle Pflegeeinträge werden dauerhaft gelöscht. Dies kann nicht rückgängig gemacht werden.',
  'settings.deleteAccount.finalTitle': 'Wirklich löschen?',
  'settings.deleteAccount.finalDescription':
    'Nach dem Löschen können deine Daten nicht wiederhergestellt werden.',
  'settings.deleteAccount.cancel': 'Abbrechen',
  'settings.deleteAccount.continue': 'Weiter',
  'settings.deleteAccount.permanentAction': 'Endgültig löschen',
  'settings.deleteAccount.error':
    'Dein Konto konnte nicht gelöscht werden. Du bist weiterhin angemeldet. Bitte versuche es erneut.',
} satisfies Record<TranslationKey, string>;

export const translations: Record<
  AppLanguage,
  Record<TranslationKey, string>
> = {
  ko,
  en,
  de,
};

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  params: TranslationParams = {},
) {
  return Object.entries(params).reduce(
    (message, [name, value]) =>
      message.replaceAll(
        `{{${name}}}`,
        String(value),
      ),
    translations[language][key],
  );
}
