# 🎨 دليل التخصيص والتطوير

## مقدمة

هذا الدليل يشرح كيفية تخصيص التطبيق حسب احتياجاتك الخاصة.

---

## 🎨 تغيير الألوان

### تغيير اللون الأساسي

افتح ملف `App.js` وابحث عن `styles` في الأسفل:

```javascript
// اللون الأساسي الحالي
backgroundColor: '#0d7377',

// غيّره إلى أي لون تريد، مثل:
backgroundColor: '#2e7d32',  // أخضر غامق
backgroundColor: '#1565c0',  // أزرق
backgroundColor: '#6a1b9a',  // بنفسجي
backgroundColor: '#c62828',  // أحمر
```

### تغيير لون زر التسبيح

```javascript
mainButton: {
  backgroundColor: '#0d7377',  // غيّر هذا
  // ...
}
```

### تغيير لون عرض الذكر

```javascript
dhikrDisplayContainer: {
  backgroundColor: '#14ffec',  // غيّر هذا
  // ...
}
```

### مجموعات ألوان مقترحة

#### السمة الخضراء (افتراضي)
```javascript
const COLORS = {
  primary: '#0d7377',
  secondary: '#14ffec',
  warning: '#ff9800',
  danger: '#d32f2f',
};
```

#### السمة الزرقاء
```javascript
const COLORS = {
  primary: '#1976d2',
  secondary: '#64b5f6',
  warning: '#ff9800',
  danger: '#d32f2f',
};
```

#### السمة البنفسجية
```javascript
const COLORS = {
  primary: '#7b1fa2',
  secondary: '#ce93d8',
  warning: '#ff9800',
  danger: '#d32f2f',
};
```

#### السمة الذهبية
```javascript
const COLORS = {
  primary: '#f57f17',
  secondary: '#ffd54f',
  warning: '#ff9800',
  danger: '#d32f2f',
};
```

---

## 📝 تغيير الخطوط

### تغيير حجم خط العداد

```javascript
counterValue: {
  fontSize: 72,  // غيّر هذا الرقم
  // جرب: 50, 60, 80, 100
}
```

### تغيير حجم خط الذكر

```javascript
dhikrText: {
  fontSize: 32,  // غيّر هذا
  // جرب: 28, 36, 40
}
```

### تغيير حجم خط العنوان

```javascript
headerTitle: {
  fontSize: 28,  // غيّر هذا
  // جرب: 24, 32, 36
}
```

### استخدام خط مخصص

أولاً، أضف ملفات الخط إلى المشروع:
```
android/app/src/main/assets/fonts/YourFont.ttf
ios/YourApp/Fonts/YourFont.ttf
```

ثم استخدمه في الكود:
```javascript
dhikrText: {
  fontFamily: 'YourFont',
  fontSize: 32,
}
```

---

## ➕ إضافة أذكار جديدة

### إضافة ذكر واحد

في ملف `App.js`، ابحث عن `ADHKAR_LIST`:

```javascript
const ADHKAR_LIST = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'لا حول ولا قوة إلا بالله',
  'اللهم صل على محمد',  // أضف هنا
];
```

### إضافة عدة أذكار

```javascript
const ADHKAR_LIST = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'لا حول ولا قوة إلا بالله',
  'اللهم صل على محمد',
  'سبحان الله وبحمده',
  'سبحان الله العظيم',
  'لا حول ولا قوة إلا بالله العلي العظيم',
];
```

---

## 🔊 إضافة صوت

### الخطوة 1: تثبيت المكتبة

```bash
npm install react-native-sound
cd ios && pod install && cd ..
```

### الخطوة 2: إضافة ملف الصوت

ضع ملف `click.mp3` في:
- Android: `android/app/src/main/res/raw/click.mp3`
- iOS: أضفه عبر Xcode

### الخطوة 3: تعديل الكود

```javascript
// في بداية الملف
import Sound from 'react-native-sound';

// داخل المكون
const [clickSound, setClickSound] = useState(null);

useEffect(() => {
  const sound = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('فشل تحميل الصوت', error);
      return;
    }
  });
  setClickSound(sound);
  
  return () => {
    sound.release();
  };
}, []);

// في دالة incrementCounter
const incrementCounter = () => {
  if (clickSound) {
    clickSound.play();
  }
  setCurrentCount(currentCount + 1);
  setTotalCounts(prevCounts => ({
    ...prevCounts,
    [selectedDhikr]: prevCounts[selectedDhikr] + 1,
  }));
};
```

---

## 📳 إضافة اهتزاز

### تعديل بسيط في الكود

```javascript
// في بداية الملف
import {Vibration} from 'react-native';

// في دالة incrementCounter
const incrementCounter = () => {
  Vibration.vibrate(50);  // اهتزاز لمدة 50 ميلي ثانية
  setCurrentCount(currentCount + 1);
  setTotalCounts(prevCounts => ({
    ...prevCounts,
    [selectedDhikr]: prevCounts[selectedDhikr] + 1,
  }));
};
```

### اهتزاز متقدم

```javascript
// اهتزاز بنمط معين
const VIBRATION_PATTERN = [0, 50, 100, 50];  // تأخير، اهتزاز، توقف، اهتزاز

const incrementCounter = () => {
  Vibration.vibrate(VIBRATION_PATTERN);
  // ... باقي الكود
};
```

---

## 🎯 إضافة هدف يومي

### الخطوة 1: إضافة State

```javascript
const [dailyGoal, setDailyGoal] = useState(100);
const [currentDailyCount, setCurrentDailyCount] = useState(0);
```

### الخطوة 2: تحديث العداد

```javascript
const incrementCounter = () => {
  setCurrentCount(currentCount + 1);
  setCurrentDailyCount(currentDailyCount + 1);
  
  // عند الوصول للهدف
  if (currentDailyCount + 1 === dailyGoal) {
    Alert.alert('مبروك!', 'لقد حققت هدفك اليومي! 🎉');
  }
  
  setTotalCounts(prevCounts => ({
    ...prevCounts,
    [selectedDhikr]: prevCounts[selectedDhikr] + 1,
  }));
};
```

### الخطوة 3: عرض التقدم

```javascript
<View style={styles.goalContainer}>
  <Text style={styles.goalLabel}>الهدف اليومي</Text>
  <View style={styles.progressBar}>
    <View 
      style={[
        styles.progressFill,
        {width: `${(currentDailyCount / dailyGoal) * 100}%`}
      ]}
    />
  </View>
  <Text style={styles.goalText}>
    {currentDailyCount} / {dailyGoal}
  </Text>
</View>
```

### الخطوة 4: إضافة Styles

```javascript
goalContainer: {
  backgroundColor: '#ffffff',
  borderRadius: 15,
  padding: 20,
  marginBottom: 20,
},
goalLabel: {
  fontSize: 18,
  color: '#666',
  marginBottom: 10,
  textAlign: 'center',
},
progressBar: {
  height: 20,
  backgroundColor: '#e0e0e0',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 10,
},
progressFill: {
  height: '100%',
  backgroundColor: '#0d7377',
},
goalText: {
  fontSize: 16,
  color: '#333',
  textAlign: 'center',
},
```

---

## 📊 إضافة إحصائيات

### حساب إجمالي اليوم

```javascript
const [todayTotal, setTodayTotal] = useState(0);

useEffect(() => {
  // حساب إجمالي اليوم
  const total = Object.values(totalCounts).reduce((a, b) => a + b, 0);
  setTodayTotal(total);
}, [totalCounts]);

// في الواجهة
<View style={styles.statsCard}>
  <Text style={styles.statsLabel}>إجمالي اليوم</Text>
  <Text style={styles.statsValue}>{todayTotal}</Text>
</View>
```

### عرض الذكر الأكثر استخداماً

```javascript
const getMostUsedDhikr = () => {
  let max = 0;
  let mostUsed = '';
  
  Object.entries(totalCounts).forEach(([dhikr, count]) => {
    if (count > max) {
      max = count;
      mostUsed = dhikr;
    }
  });
  
  return mostUsed || 'لا يوجد';
};

// في الواجهة
<View style={styles.statsCard}>
  <Text style={styles.statsLabel}>الذكر الأكثر استخداماً</Text>
  <Text style={styles.statsValue}>{getMostUsedDhikr()}</Text>
</View>
```

---

## 🌙 إضافة الوضع الليلي

### الخطوة 1: إضافة State

```javascript
const [isDarkMode, setIsDarkMode] = useState(false);
```

### الخطوة 2: تعريف الألوان

```javascript
const LIGHT_THEME = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  primary: '#0d7377',
};

const DARK_THEME = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  primary: '#14ffec',
};

const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
```

### الخطوة 3: استخدام الثيم

```javascript
<View style={[styles.container, {backgroundColor: theme.background}]}>
  <View style={[styles.card, {backgroundColor: theme.card}]}>
    <Text style={[styles.text, {color: theme.text}]}>
      النص هنا
    </Text>
  </View>
</View>
```

### الخطوة 4: إضافة زر التبديل

```javascript
import {Switch} from 'react-native';

// في الواجهة
<View style={styles.themeToggle}>
  <Text style={styles.themeLabel}>الوضع الليلي</Text>
  <Switch
    value={isDarkMode}
    onValueChange={setIsDarkMode}
  />
</View>
```

---

## 📱 تخصيص الأيقونة والاسم

### تغيير اسم التطبيق

في ملف `app.json`:
```json
{
  "name": "DhikrCounter",
  "displayName": "عداد الأذكار"  // غيّر هذا
}
```

### تغيير الأيقونة (Icon)

1. أنشئ أيقونة بحجم 1024x1024 px
2. استخدم أداة مثل https://appicon.co/ لإنشاء جميع الأحجام
3. استبدل الملفات في:
   - Android: `android/app/src/main/res/mipmap-*/`
   - iOS: `ios/DhikrCounter/Images.xcassets/AppIcon.appiconset/`

---

## 🔔 إضافة إشعارات

### الخطوة 1: تثبيت المكتبة

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
# أو
npm install react-native-push-notification
```

### الخطوة 2: إعداد الإشعارات

```javascript
import PushNotification from 'react-native-push-notification';

// إعداد الإشعارات
PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
```

### الخطوة 3: جدولة إشعار

```javascript
// إشعار بعد 5 ثواني
PushNotification.localNotificationSchedule({
  message: 'حان وقت الأذكار! 🕌',
  date: new Date(Date.now() + 5 * 1000),
  playSound: true,
  soundName: 'default',
});

// إشعار يومي
PushNotification.localNotificationSchedule({
  message: 'لا تنسى أذكار الصباح! ☀️',
  date: new Date(2023, 1, 1, 7, 0, 0),
  repeatType: 'day',
});
```

---

## 💾 إضافة تصدير/استيراد البيانات

### تصدير البيانات

```javascript
import {Share} from 'react-native';
import RNFS from 'react-native-fs';

const exportData = async () => {
  try {
    const data = JSON.stringify(totalCounts, null, 2);
    const path = RNFS.DocumentDirectoryPath + '/dhikr_backup.json';
    
    await RNFS.writeFile(path, data, 'utf8');
    
    await Share.share({
      title: 'نسخة احتياطية من أذكاري',
      url: 'file://' + path,
    });
  } catch (error) {
    Alert.alert('خطأ', 'فشل تصدير البيانات');
  }
};
```

### استيراد البيانات

```javascript
import DocumentPicker from 'react-native-document-picker';

const importData = async () => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.json],
    });
    
    const content = await RNFS.readFile(result.uri, 'utf8');
    const importedData = JSON.parse(content);
    
    setTotalCounts(importedData);
    Alert.alert('نجح', 'تم استيراد البيانات بنجاح');
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      // المستخدم ألغى العملية
    } else {
      Alert.alert('خطأ', 'فشل استيراد البيانات');
    }
  }
};
```

---

## 🎨 إضافة رسوم متحركة (Animations)

### استخدام Animated API

```javascript
import {Animated} from 'react-native';

// داخل المكون
const scaleValue = new Animated.Value(1);

const animateButton = () => {
  Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 1.2,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

const incrementCounter = () => {
  animateButton();
  // ... باقي الكود
};

// في الواجهة
<Animated.View style={{transform: [{scale: scaleValue}]}}>
  <TouchableOpacity
    style={styles.mainButton}
    onPress={incrementCounter}
  >
    <Text style={styles.mainButtonText}>سَبِّح</Text>
  </TouchableOpacity>
</Animated.View>
```

---

## 📱 دعم الأجهزة اللوحية

### استخدام Dimensions

```javascript
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const isTablet = width >= 768;

// تخصيص الحجم حسب الجهاز
const fontSize = isTablet ? 48 : 32;
const padding = isTablet ? 40 : 20;
```

---

## 🌐 إضافة لغات أخرى

### الخطوة 1: تثبيت i18n

```bash
npm install i18n-js
```

### الخطوة 2: إعداد الترجمات

```javascript
import I18n from 'i18n-js';

I18n.translations = {
  ar: {
    title: 'عداد الأذكار',
    count: 'سَبِّح',
  },
  en: {
    title: 'Dhikr Counter',
    count: 'Count',
  },
};

I18n.locale = 'ar';
```

### الخطوة 3: استخدام الترجمات

```javascript
<Text>{I18n.t('title')}</Text>
```

---

## 🎯 نصائح للأداء

### 1. استخدام useMemo

```javascript
import {useMemo} from 'react';

const totalCount = useMemo(() => {
  return Object.values(totalCounts).reduce((a, b) => a + b, 0);
}, [totalCounts]);
```

### 2. استخدام useCallback

```javascript
import {useCallback} from 'react';

const incrementCounter = useCallback(() => {
  setCurrentCount(prev => prev + 1);
  setTotalCounts(prevCounts => ({
    ...prevCounts,
    [selectedDhikr]: prevCounts[selectedDhikr] + 1,
  }));
}, [selectedDhikr]);
```

### 3. تحسين القوائم

```javascript
<FlatList
  data={ADHKAR_LIST}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({item}) => <DhikrItem dhikr={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

---

## 🐛 نصائح للتصحيح (Debugging)

### استخدام Console

```javascript
console.log('القيمة:', currentCount);
console.warn('تحذير:', 'شيء غير متوقع');
console.error('خطأ:', error);
```

### استخدام React DevTools

```bash
npm install -g react-devtools
react-devtools
```

### فحص AsyncStorage

```javascript
const checkStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('المفاتيح المحفوظة:', keys);
  
  const values = await AsyncStorage.multiGet(keys);
  console.log('القيم:', values);
};
```

---

## 📚 موارد إضافية

### مواقع مفيدة
- [React Native Docs](https://reactnative.dev/)
- [React Native Express](http://www.reactnativeexpress.com/)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

### مكتبات مفيدة
- `react-native-vector-icons`: أيقونات
- `react-native-linear-gradient`: تدرجات لونية
- `react-native-modal`: نوافذ منبثقة
- `react-native-charts`: رسوم بيانية

---

**بالتوفيق في تطوير تطبيقك! 🚀**

**جزاكم الله خيراً** 🤲
