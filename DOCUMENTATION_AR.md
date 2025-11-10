# توثيق مفصل للكود - تطبيق عداد الأذكار

## 📚 شرح البنية والكود

### 1. المكتبات المستخدمة

#### React و React Native
```javascript
import React, {useState, useEffect} from 'react';
```
- **React**: مكتبة بناء واجهات المستخدم
- **useState**: لإدارة الحالة (State) في المكون
- **useEffect**: لتنفيذ عمليات جانبية (Side Effects) مثل تحميل البيانات

#### مكونات React Native الأساسية
```javascript
import {
  StyleSheet,      // لإنشاء التنسيقات (Styles)
  Text,           // لعرض النصوص
  View,           // حاوية (Container) للمكونات
  TouchableOpacity, // زر قابل للضغط
  ScrollView,     // عرض قابل للتمرير
  Alert,          // لعرض نوافذ التنبيه
  I18nManager,    // لإدارة اتجاه النص (RTL/LTR)
  StatusBar,      // شريط الحالة في أعلى الشاشة
} from 'react-native';
```

#### AsyncStorage - التخزين المحلي
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
```
- يستخدم لحفظ البيانات محلياً على الجهاز
- يعمل مثل localStorage في الويب
- البيانات تبقى حتى بعد إغلاق التطبيق

#### Picker - القائمة المنسدلة
```javascript
import {Picker} from '@react-native-picker/picker';
```
- يوفر قائمة منسدلة لاختيار الذكر

### 2. إعدادات اللغة العربية و RTL

```javascript
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
```
- **RTL** تعني Right-to-Left (من اليمين إلى اليسار)
- هذا يجعل التطبيق يعمل بشكل صحيح مع اللغة العربية
- جميع العناصر ستكون معكوسة لتناسب العربية

### 3. البيانات الثابتة

#### قائمة الأذكار
```javascript
const ADHKAR_LIST = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'لا حول ولا قوة إلا بالله',
];
```
- مصفوفة (Array) تحتوي على جميع الأذكار المتاحة
- يمكن إضافة أو حذف أذكار من هنا بسهولة

#### مفتاح التخزين
```javascript
const STORAGE_KEY = '@dhikr_counter_data';
```
- مفتاح فريد لتخزين البيانات في AsyncStorage
- يبدأ بـ @ كأفضل ممارسة في React Native

### 4. إدارة الحالة (State Management)

#### العداد الحالي
```javascript
const [currentCount, setCurrentCount] = useState(0);
```
- **currentCount**: العداد الذي يظهر على الشاشة
- **setCurrentCount**: دالة لتحديث قيمة العداد
- يبدأ من 0 ويعود إلى 0 عند تغيير الذكر

#### الذكر المختار
```javascript
const [selectedDhikr, setSelectedDhikr] = useState(ADHKAR_LIST[0]);
```
- يحمل الذكر المختار حالياً
- القيمة الافتراضية هي أول ذكر في القائمة ("سبحان الله")

#### إجمالي الأعداد
```javascript
const [totalCounts, setTotalCounts] = useState(() => {
  const initial = {};
  ADHKAR_LIST.forEach(dhikr => {
    initial[dhikr] = 0;
  });
  return initial;
});
```
- كائن (Object) يحتوي على العدد الإجمالي لكل ذكر
- مثال على الشكل:
```javascript
{
  'سبحان الله': 100,
  'الحمد لله': 75,
  'الله أكبر': 50,
  // ...
}
```

### 5. الوظائف الأساسية

#### تحميل البيانات عند بدء التطبيق
```javascript
useEffect(() => {
  loadData();
}, []);
```
- يعمل مرة واحدة فقط عند تشغيل التطبيق
- المصفوفة الفارغة `[]` تعني "افعل هذا مرة واحدة فقط"

#### حفظ البيانات تلقائياً
```javascript
useEffect(() => {
  saveData();
}, [totalCounts]);
```
- يعمل كلما تغيرت قيمة `totalCounts`
- يحفظ البيانات تلقائياً بدون تدخل المستخدم

#### دالة تحميل البيانات
```javascript
const loadData = async () => {
  try {
    // محاولة قراءة البيانات من التخزين
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    
    // إذا وجدت بيانات
    if (jsonValue != null) {
      const loadedData = JSON.parse(jsonValue);  // تحويل من JSON إلى Object
      setTotalCounts(loadedData);                // تحديث الحالة
    }
  } catch (error) {
    // في حالة حدوث خطأ
    console.error('خطأ في تحميل البيانات:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات المحفوظة');
  }
};
```

**شرح مفصل:**
- `async/await`: لجعل الكود ينتظر حتى تكتمل عملية القراءة
- `try/catch`: للتعامل مع الأخطاء المحتملة
- `JSON.parse()`: لتحويل النص المحفوظ إلى كائن JavaScript

#### دالة حفظ البيانات
```javascript
const saveData = async () => {
  try {
    const jsonValue = JSON.stringify(totalCounts);  // تحويل Object إلى JSON
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);  // الحفظ
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
  }
};
```

**شرح مفصل:**
- `JSON.stringify()`: يحول الكائن إلى نص JSON لحفظه
- `AsyncStorage.setItem()`: يحفظ البيانات محلياً

#### دالة زيادة العداد
```javascript
const incrementCounter = () => {
  // زيادة العداد الحالي
  setCurrentCount(currentCount + 1);
  
  // زيادة الإجمالي للذكر المحدد
  setTotalCounts(prevCounts => ({
    ...prevCounts,  // نسخ جميع القيم السابقة
    [selectedDhikr]: prevCounts[selectedDhikr] + 1,  // زيادة الذكر المحدد فقط
  }));
};
```

**شرح مفصل:**
- `...prevCounts`: Spread operator - ينسخ جميع القيم السابقة
- `[selectedDhikr]`: Computed property name - استخدام متغير كمفتاح

#### دالة إعادة تعيين العداد الحالي
```javascript
const resetCurrentCounter = () => {
  Alert.alert(
    'إعادة تعيين العداد',           // العنوان
    'هل تريد إعادة تعيين العداد الحالي؟',  // الرسالة
    [
      {
        text: 'إلغاء',
        style: 'cancel',           // زر إلغاء
      },
      {
        text: 'إعادة تعيين',
        onPress: () => setCurrentCount(0),  // إعادة العداد إلى صفر
        style: 'destructive',      // يظهر باللون الأحمر
      },
    ],
  );
};
```

#### دالة مسح جميع البيانات
```javascript
const clearAllData = () => {
  Alert.alert(
    'مسح جميع البيانات',
    'هل أنت متأكد من مسح جميع البيانات المحفوظة؟',
    [
      {text: 'إلغاء', style: 'cancel'},
      {
        text: 'مسح الكل',
        onPress: () => {
          // إنشاء كائن جديد بقيم صفرية
          const resetCounts = {};
          ADHKAR_LIST.forEach(dhikr => {
            resetCounts[dhikr] = 0;
          });
          
          // تحديث الحالة
          setTotalCounts(resetCounts);
          setCurrentCount(0);
          
          // رسالة تأكيد
          Alert.alert('تم', 'تم مسح جميع البيانات بنجاح');
        },
        style: 'destructive',
      },
    ],
  );
};
```

#### دالة تغيير الذكر
```javascript
const handleDhikrChange = (dhikr) => {
  setSelectedDhikr(dhikr);  // تحديث الذكر المختار
  setCurrentCount(0);       // إعادة تعيين العداد الحالي
};
```

### 6. واجهة المستخدم (UI Components)

#### الحاوية الرئيسية
```javascript
<View style={styles.container}>
  {/* جميع المكونات هنا */}
</View>
```

#### شريط الحالة
```javascript
<StatusBar barStyle="light-content" backgroundColor="#0d7377" />
```
- يجعل النصوص والأيقونات في شريط الحالة بيضاء
- الخلفية باللون الأخضر المزرق

#### شريط العنوان
```javascript
<View style={styles.header}>
  <Text style={styles.headerTitle}>عداد الأذكار والتسبيح</Text>
  <Text style={styles.headerSubtitle}>احفظ أورادك اليومية</Text>
</View>
```

#### منطقة التمرير
```javascript
<ScrollView 
  style={styles.scrollView}
  contentContainerStyle={styles.scrollContent}
>
  {/* المحتوى القابل للتمرير */}
</ScrollView>
```

#### القائمة المنسدلة
```javascript
<View style={styles.pickerContainer}>
  <Text style={styles.sectionTitle}>اختر نوع الذكر</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedDhikr}
      onValueChange={handleDhikrChange}
      style={styles.picker}
    >
      {ADHKAR_LIST.map((dhikr, index) => (
        <Picker.Item 
          key={index} 
          label={dhikr} 
          value={dhikr}
        />
      ))}
    </Picker>
  </View>
</View>
```

**شرح:**
- `map()`: تكرار على كل عنصر في المصفوفة
- `key={index}`: مطلوب من React لتحسين الأداء
- `label`: النص الذي يظهر
- `value`: القيمة الفعلية

#### عرض الذكر الحالي
```javascript
<View style={styles.dhikrDisplayContainer}>
  <Text style={styles.dhikrText}>{selectedDhikr}</Text>
</View>
```

#### العداد الحالي
```javascript
<View style={styles.counterContainer}>
  <Text style={styles.counterLabel}>العدد الحالي</Text>
  <Text style={styles.counterValue}>{currentCount}</Text>
</View>
```

#### زر العد الرئيسي
```javascript
<TouchableOpacity
  style={styles.mainButton}
  onPress={incrementCounter}
  activeOpacity={0.7}  // تأثير الشفافية عند الضغط
>
  <Text style={styles.mainButtonText}>سَبِّح</Text>
  <Text style={styles.mainButtonSubtext}>اضغط للعد</Text>
</TouchableOpacity>
```

#### عرض الإجماليات
```javascript
<View style={styles.totalsContainer}>
  <Text style={styles.sectionTitle}>إجمالي الأذكار المحفوظة</Text>
  {ADHKAR_LIST.map((dhikr, index) => (
    <View key={index} style={styles.totalItem}>
      <Text style={styles.totalDhikrName}>{dhikr}</Text>
      <View style={styles.totalCountBadge}>
        <Text style={styles.totalCountText}>
          {totalCounts[dhikr]}
        </Text>
      </View>
    </View>
  ))}
</View>
```

### 7. التنسيقات (Styles)

#### نظام الألوان
- **اللون الأساسي**: `#0d7377` (أخضر مزرق)
- **اللون الثانوي**: `#14ffec` (سماوي فاتح)
- **لون النص الفاتح**: `#e0f7fa`
- **لون التحذير**: `#ff9800` (برتقالي)
- **لون الخطر**: `#d32f2f` (أحمر)
- **الخلفية**: `#f5f5f5` (رمادي فاتح جداً)

#### الظلال والارتفاع (Elevation & Shadow)
```javascript
elevation: 4,  // للأندرويد
shadowColor: '#000',
shadowOffset: {width: 0, height: 2},
shadowOpacity: 0.25,
shadowRadius: 3.84,  // لـ iOS
```

#### الحواف المدورة
```javascript
borderRadius: 15,  // زوايا دائرية
```

#### المسافات
- `padding`: المسافة الداخلية
- `margin`: المسافة الخارجية

### 8. أفضل الممارسات المستخدمة

#### 1. فصل المنطق عن العرض
- الوظائف منفصلة عن مكونات UI
- سهل للصيانة والتطوير

#### 2. استخدام async/await
- كود أسهل للقراءة
- معالجة أفضل للأخطاء

#### 3. التعامل مع الأخطاء
- استخدام try/catch في كل مكان
- رسائل واضحة للمستخدم

#### 4. التأكيد قبل الإجراءات الخطيرة
- نوافذ تأكيد قبل المسح
- حماية من الحذف العرضي

#### 5. الحفظ التلقائي
- لا يحتاج المستخدم للضغط على "حفظ"
- تجربة استخدام أفضل

#### 6. دعم RTL
- واجهة صحيحة للغة العربية
- ترتيب منطقي للعناصر

### 9. كيفية إضافة ميزات جديدة

#### إضافة ذكر جديد
```javascript
const ADHKAR_LIST = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'لا حول ولا قوة إلا بالله',
  'اللهم صل على محمد',  // ذكر جديد
];
```

#### إضافة صوت عند الضغط
```javascript
// أولاً، قم بتثبيت المكتبة:
// npm install react-native-sound

import Sound from 'react-native-sound';

// في بداية المكون:
const clickSound = new Sound('click.mp3', Sound.MAIN_BUNDLE);

// في دالة incrementCounter:
const incrementCounter = () => {
  clickSound.play();  // تشغيل الصوت
  setCurrentCount(currentCount + 1);
  // ... باقي الكود
};
```

#### إضافة اهتزاز عند الضغط
```javascript
import {Vibration} from 'react-native';

const incrementCounter = () => {
  Vibration.vibrate(50);  // اهتزاز لمدة 50 ميلي ثانية
  setCurrentCount(currentCount + 1);
  // ... باقي الكود
};
```

#### إضافة هدف يومي
```javascript
const [dailyGoal, setDailyGoal] = useState(100);

// في واجهة المستخدم:
<View>
  <Text>الهدف اليومي: {currentCount} / {dailyGoal}</Text>
  <ProgressBar progress={currentCount / dailyGoal} />
</View>
```

### 10. نصائح للتطوير

#### استخدام React DevTools
```bash
npm install -g react-devtools
react-devtools
```

#### مراقبة الأداء
```javascript
console.log('Render time:', Date.now());
```

#### تصحيح الأخطاء
- استخدم `console.log()` لطباعة القيم
- استخدم React Native Debugger
- افحص AsyncStorage:
```javascript
AsyncStorage.getAllKeys().then(keys => console.log(keys));
```

### 11. تحسينات مستقبلية مقترحة

1. **إضافة أوقات محددة**: تذكير المستخدم بأوقات الأذكار
2. **إحصائيات**: رسوم بيانية لعرض التقدم
3. **مشاركة**: مشاركة الإنجازات على وسائل التواصل
4. **نسخ احتياطي**: تصدير/استيراد البيانات
5. **سمات**: تخصيص الألوان والخطوط
6. **لغات متعددة**: دعم لغات أخرى

---

## 📞 أسئلة شائعة

### س: كيف أغير حجم الخط؟
ج: في ملف `App.js`، ابحث عن `styles.counterValue` وغير `fontSize`:
```javascript
counterValue: {
  fontSize: 100,  // زيادة الحجم
  // ...
}
```

### س: كيف أغير الألوان؟
ج: ابحث عن الألوان في قسم `StyleSheet.create()` واستبدلها:
```javascript
mainButton: {
  backgroundColor: '#your-color',  // لونك المفضل
  // ...
}
```

### س: كيف أضيف المزيد من الأذكار؟
ج: عدّل مصفوفة `ADHKAR_LIST` في أول الملف.

---

**جزاكم الله خيراً**
