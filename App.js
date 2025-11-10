/**
 * تطبيق عداد الأذكار والتسبيح
 * Dhikr Counter Application
 * 
 * هذا التطبيق يسمح للمستخدم بعد الأذكار والتسبيحات المختلفة
 * مع حفظ البيانات محلياً واسترجاعها عند فتح التطبيق
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

// تفعيل اتجاه RTL للغة العربية
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// قائمة الأذكار المتاحة
const ADHKAR_LIST = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'لا حول ولا قوة إلا بالله',
];

// مفتاح التخزين المحلي
const STORAGE_KEY = '@dhikr_counter_data';

const App = () => {
  // العداد الحالي للذكر المختار
  const [currentCount, setCurrentCount] = useState(0);
  
  // الذكر المختار حالياً
  const [selectedDhikr, setSelectedDhikr] = useState(ADHKAR_LIST[0]);
  
  // إجمالي العدد لكل ذكر - كائن يحتوي على كل الأذكار وأعدادها
  const [totalCounts, setTotalCounts] = useState(() => {
    const initial = {};
    ADHKAR_LIST.forEach(dhikr => {
      initial[dhikr] = 0;
    });
    return initial;
  });

  /**
   * تحميل البيانات المحفوظة عند بدء التطبيق
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * حفظ البيانات تلقائياً عند تغيير الأعداد
   */
  useEffect(() => {
    saveData();
  }, [totalCounts]);

  /**
   * تحميل البيانات من التخزين المحلي
   */
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const loadedData = JSON.parse(jsonValue);
        setTotalCounts(loadedData);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات المحفوظة');
    }
  };

  /**
   * حفظ البيانات في التخزين المحلي
   */
  const saveData = async () => {
    try {
      const jsonValue = JSON.stringify(totalCounts);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    }
  };

  /**
   * زيادة العداد عند الضغط على الزر
   */
  const incrementCounter = () => {
    // زيادة العداد الحالي
    setCurrentCount(currentCount + 1);
    
    // زيادة الإجمالي للذكر المحدد
    setTotalCounts(prevCounts => ({
      ...prevCounts,
      [selectedDhikr]: prevCounts[selectedDhikr] + 1,
    }));
  };

  /**
   * إعادة تعيين العداد الحالي فقط
   */
  const resetCurrentCounter = () => {
    Alert.alert(
      'إعادة تعيين العداد',
      'هل تريد إعادة تعيين العداد الحالي؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'إعادة تعيين',
          onPress: () => setCurrentCount(0),
          style: 'destructive',
        },
      ],
    );
  };

  /**
   * مسح جميع البيانات المحفوظة
   */
  const clearAllData = () => {
    Alert.alert(
      'مسح جميع البيانات',
      'هل أنت متأكد من مسح جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'مسح الكل',
          onPress: () => {
            const resetCounts = {};
            ADHKAR_LIST.forEach(dhikr => {
              resetCounts[dhikr] = 0;
            });
            setTotalCounts(resetCounts);
            setCurrentCount(0);
            Alert.alert('تم', 'تم مسح جميع البيانات بنجاح');
          },
          style: 'destructive',
        },
      ],
    );
  };

  /**
   * تغيير الذكر المختار
   */
  const handleDhikrChange = (dhikr) => {
    setSelectedDhikr(dhikr);
    setCurrentCount(0); // إعادة تعيين العداد الحالي عند تغيير الذكر
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />
      
      {/* شريط العنوان */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>عداد الأذكار والتسبيح</Text>
        <Text style={styles.headerSubtitle}>احفظ أورادك اليومية</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* قسم اختيار الذكر */}
        <View style={styles.pickerContainer}>
          <Text style={styles.sectionTitle}>اختر نوع الذكر</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDhikr}
              onValueChange={handleDhikrChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {ADHKAR_LIST.map((dhikr, index) => (
                <Picker.Item 
                  key={index} 
                  label={dhikr} 
                  value={dhikr}
                  style={styles.pickerItemText}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* عرض الذكر المختار */}
        <View style={styles.dhikrDisplayContainer}>
          <Text style={styles.dhikrText}>{selectedDhikr}</Text>
        </View>

        {/* العداد الحالي */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>العدد الحالي</Text>
          <Text style={styles.counterValue}>{currentCount}</Text>
        </View>

        {/* زر العد الرئيسي */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={incrementCounter}
          activeOpacity={0.7}
        >
          <Text style={styles.mainButtonText}>سَبِّح</Text>
          <Text style={styles.mainButtonSubtext}>اضغط للعد</Text>
        </TouchableOpacity>

        {/* أزرار التحكم */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetCurrentCounter}
          >
            <Text style={styles.resetButtonText}>إعادة تعيين العداد</Text>
          </TouchableOpacity>
        </View>

        {/* عرض الإجماليات */}
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

        {/* زر مسح البيانات */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllData}
        >
          <Text style={styles.clearButtonText}>مسح جميع البيانات</Text>
        </TouchableOpacity>

        {/* مساحة إضافية في الأسفل */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0d7377',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0f7fa',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0d7377',
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    fontSize: 20,
    textAlign: 'center',
  },
  pickerItemText: {
    fontSize: 20,
  },
  dhikrDisplayContainer: {
    backgroundColor: '#14ffec',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0d7377',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2.22,
  },
  dhikrText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0d7377',
    textAlign: 'center',
  },
  counterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0d7377',
  },
  counterLabel: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  counterValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#0d7377',
  },
  mainButton: {
    backgroundColor: '#0d7377',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  mainButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  mainButtonSubtext: {
    fontSize: 16,
    color: '#e0f7fa',
  },
  controlButtons: {
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#ff9800',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalDhikrName: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  totalCountBadge: {
    backgroundColor: '#0d7377',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  totalCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default App;
