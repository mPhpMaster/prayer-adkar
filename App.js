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

// مفاتيح التخزين المحلي
const STORAGE_KEY_TOTALS = '@dhikr_counter_totals';
const STORAGE_KEY_CURRENT = '@dhikr_counter_current';
const STORAGE_KEY_SELECTED = '@dhikr_counter_selected';
const STORAGE_KEY_STATS = '@dhikr_counter_statistics';
const STORAGE_KEY_DAILY_HISTORY = '@dhikr_counter_daily_history';

const App = () => {
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
  
  // العداد الحالي لكل ذكر - يحفظ العداد الحالي لكل ذكر على حدة
  const [currentCounts, setCurrentCounts] = useState(() => {
    const initial = {};
    ADHKAR_LIST.forEach(dhikr => {
      initial[dhikr] = 0;
    });
    return initial;
  });
  
  // العداد الحالي للذكر المختار
  const currentCount = currentCounts[selectedDhikr] || 0;
  
  // إحصائيات متقدمة
  const [statistics, setStatistics] = useState({
    firstUseDate: new Date().toISOString(),
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastUsedDate: new Date().toISOString(),
    bestDayCount: 0,
    bestDayDate: null,
  });
  
  // سجل الأيام - يحفظ العدد لكل يوم
  const [dailyHistory, setDailyHistory] = useState([]);

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
  }, [totalCounts, currentCounts]);
  
  /**
   * حفظ الذكر المختار عند تغييره
   */
  useEffect(() => {
    saveSelectedDhikr();
  }, [selectedDhikr]);

  /**
   * تحميل البيانات من التخزين المحلي
   */
  const loadData = async () => {
    try {
      // تحميل الإجماليات
      const totalsJson = await AsyncStorage.getItem(STORAGE_KEY_TOTALS);
      if (totalsJson != null) {
        const loadedTotals = JSON.parse(totalsJson);
        setTotalCounts(loadedTotals);
      }
      
      // تحميل العدادات الحالية
      const currentJson = await AsyncStorage.getItem(STORAGE_KEY_CURRENT);
      if (currentJson != null) {
        const loadedCurrent = JSON.parse(currentJson);
        setCurrentCounts(loadedCurrent);
      }
      
      // تحميل الذكر المختار
      const selectedJson = await AsyncStorage.getItem(STORAGE_KEY_SELECTED);
      if (selectedJson != null) {
        const loadedSelected = JSON.parse(selectedJson);
        if (ADHKAR_LIST.includes(loadedSelected)) {
          setSelectedDhikr(loadedSelected);
        }
      }
      
      // تحميل الإحصائيات المتقدمة
      const statsJson = await AsyncStorage.getItem(STORAGE_KEY_STATS);
      if (statsJson != null) {
        const loadedStats = JSON.parse(statsJson);
        setStatistics(loadedStats);
      }
      
      // تحميل سجل الأيام
      const historyJson = await AsyncStorage.getItem(STORAGE_KEY_DAILY_HISTORY);
      if (historyJson != null) {
        const loadedHistory = JSON.parse(historyJson);
        setDailyHistory(loadedHistory);
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
      // حفظ الإجماليات
      const totalsJson = JSON.stringify(totalCounts);
      await AsyncStorage.setItem(STORAGE_KEY_TOTALS, totalsJson);
      
      // حفظ العدادات الحالية
      const currentJson = JSON.stringify(currentCounts);
      await AsyncStorage.setItem(STORAGE_KEY_CURRENT, currentJson);
      
      // حفظ الإحصائيات
      const statsJson = JSON.stringify(statistics);
      await AsyncStorage.setItem(STORAGE_KEY_STATS, statsJson);
      
      // حفظ سجل الأيام
      const historyJson = JSON.stringify(dailyHistory);
      await AsyncStorage.setItem(STORAGE_KEY_DAILY_HISTORY, historyJson);
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    }
  };
  
  /**
   * حفظ الذكر المختار
   */
  const saveSelectedDhikr = async () => {
    try {
      const jsonValue = JSON.stringify(selectedDhikr);
      await AsyncStorage.setItem(STORAGE_KEY_SELECTED, jsonValue);
    } catch (error) {
      console.error('خطأ في حفظ الذكر المختار:', error);
    }
  };

  /**
   * زيادة العداد عند الضغط على الزر
   */
  const incrementCounter = () => {
    // زيادة العداد الحالي للذكر المحدد
    setCurrentCounts(prevCounts => ({
      ...prevCounts,
      [selectedDhikr]: (prevCounts[selectedDhikr] || 0) + 1,
    }));
    
    // زيادة الإجمالي للذكر المحدد
    setTotalCounts(prevCounts => ({
      ...prevCounts,
      [selectedDhikr]: prevCounts[selectedDhikr] + 1,
    }));
    
    // تحديث الإحصائيات
    updateStatistics();
  };
  
  /**
   * تحديث الإحصائيات المتقدمة
   */
  const updateStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = statistics.lastUsedDate ? new Date(statistics.lastUsedDate).toISOString().split('T')[0] : null;
    
    // تحديث تاريخ آخر استخدام
    const updatedStats = {
      ...statistics,
      lastUsedDate: new Date().toISOString(),
    };
    
    // حساب السلاسل المتتالية
    if (lastDate) {
      const daysDiff = Math.floor((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // نفس اليوم - لا تغيير في السلسلة
      } else if (daysDiff === 1) {
        // يوم متتالي - زيادة السلسلة
        updatedStats.currentStreak = statistics.currentStreak + 1;
        if (updatedStats.currentStreak > statistics.longestStreak) {
          updatedStats.longestStreak = updatedStats.currentStreak;
        }
      } else {
        // انقطاع - إعادة تعيين السلسلة
        updatedStats.currentStreak = 1;
      }
    } else {
      // أول استخدام
      updatedStats.currentStreak = 1;
      updatedStats.longestStreak = 1;
    }
    
    setStatistics(updatedStats);
    
    // تحديث سجل الأيام
    updateDailyHistory(today);
  };
  
  /**
   * تحديث سجل الأيام
   */
  const updateDailyHistory = (today) => {
    setDailyHistory(prevHistory => {
      // البحث عن سجل اليوم
      const todayIndex = prevHistory.findIndex(entry => entry.date === today);
      
      // حساب إجمالي اليوم
      const todayTotal = Object.values(currentCounts).reduce((sum, count) => sum + count, 0) + 1;
      
      if (todayIndex >= 0) {
        // تحديث السجل الموجود
        const updated = [...prevHistory];
        updated[todayIndex] = {
          date: today,
          count: todayTotal,
        };
        return updated;
      } else {
        // إضافة سجل جديد
        const newHistory = [
          ...prevHistory,
          {
            date: today,
            count: todayTotal,
          }
        ];
        
        // الاحتفاظ بآخر 30 يوم فقط
        return newHistory.slice(-30);
      }
    });
    
    // تحديث أفضل يوم
    const todayTotal = Object.values(currentCounts).reduce((sum, count) => sum + count, 0) + 1;
    if (todayTotal > statistics.bestDayCount) {
      setStatistics(prev => ({
        ...prev,
        bestDayCount: todayTotal,
        bestDayDate: today,
      }));
    }
  };

  /**
   * إعادة تعيين العداد الحالي فقط للذكر المحدد
   */
  const resetCurrentCounter = () => {
    // For web compatibility, use window.confirm instead of Alert.alert
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('هل تريد إعادة تعيين العداد الحالي لـ ' + selectedDhikr + '؟');
      if (confirmed) {
        setCurrentCounts(prevCounts => ({
          ...prevCounts,
          [selectedDhikr]: 0,
        }));
      }
    } else {
      // Fallback for React Native
      Alert.alert(
        'إعادة تعيين العداد',
        'هل تريد إعادة تعيين العداد الحالي لـ ' + selectedDhikr + '؟',
        [
          {
            text: 'إلغاء',
            style: 'cancel',
          },
          {
            text: 'إعادة تعيين',
            onPress: () => {
              setCurrentCounts(prevCounts => ({
                ...prevCounts,
                [selectedDhikr]: 0,
              }));
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  /**
   * مسح جميع البيانات المحفوظة
   */
  const clearAllData = () => {
    // For web compatibility
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('هل أنت متأكد من مسح جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.');
      if (confirmed) {
        const resetCounts = {};
        ADHKAR_LIST.forEach(dhikr => {
          resetCounts[dhikr] = 0;
        });
        setTotalCounts(resetCounts);
        setCurrentCounts(resetCounts);
        window.alert('تم مسح جميع البيانات بنجاح');
      }
    } else {
      // Fallback for React Native
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
              setCurrentCounts(resetCounts);
              Alert.alert('تم', 'تم مسح جميع البيانات بنجاح');
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  /**
   * تغيير الذكر المختار
   */
  const handleDhikrChange = (dhikr) => {
    setSelectedDhikr(dhikr);
    // لا حاجة لإعادة تعيين العداد - كل ذكر يحفظ عداده الخاص
  };

  /**
   * حساب إحصائيات الأذكار
   */
  const calculateStatistics = () => {
    // إجمالي جميع الأذكار
    const totalAll = Object.values(totalCounts).reduce((sum, count) => sum + count, 0);
    
    // إجمالي العدادات الحالية
    const currentAll = Object.values(currentCounts).reduce((sum, count) => sum + count, 0);
    
    // الذكر الأكثر استخداماً
    let mostUsedDhikr = ADHKAR_LIST[0];
    let maxCount = totalCounts[mostUsedDhikr] || 0;
    ADHKAR_LIST.forEach(dhikr => {
      if ((totalCounts[dhikr] || 0) > maxCount) {
        maxCount = totalCounts[dhikr] || 0;
        mostUsedDhikr = dhikr;
      }
    });
    
    // حساب المتوسط اليومي
    const firstUse = new Date(statistics.firstUseDate);
    const today = new Date();
    const daysSinceStart = Math.max(1, Math.floor((today - firstUse) / (1000 * 60 * 60 * 24)));
    const dailyAverage = Math.round(totalAll / daysSinceStart);
    
    // حساب متوسط آخر 7 أيام
    const last7Days = dailyHistory.slice(-7);
    const last7DaysTotal = last7Days.reduce((sum, entry) => sum + entry.count, 0);
    const weeklyAverage = last7Days.length > 0 ? Math.round(last7DaysTotal / last7Days.length) : 0;
    
    return {
      totalAll,
      currentAll,
      mostUsedDhikr,
      maxCount,
      dailyAverage,
      weeklyAverage,
      daysSinceStart,
    };
  };
  
  const stats = calculateStatistics();

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

        {/* قسم الإحصائيات */}
        <View style={styles.statisticsContainer}>
          <Text style={styles.sectionTitle}>📊 الإحصائيات الشاملة</Text>
          
          {/* إحصائيات الأعداد */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalAll}</Text>
              <Text style={styles.statLabel}>إجمالي جميع الأذكار</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.currentAll}</Text>
              <Text style={styles.statLabel}>الجلسة الحالية</Text>
            </View>
          </View>
          
          {/* إحصائيات المتوسطات */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.dailyAverage}</Text>
              <Text style={styles.statLabel}>المتوسط اليومي</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.weeklyAverage}</Text>
              <Text style={styles.statLabel}>متوسط آخر 7 أيام</Text>
            </View>
          </View>
          
          {/* السلاسل المتتالية */}
          <View style={styles.streakContainer}>
            <Text style={styles.streakTitle}>🔥 السلاسل المتتالية</Text>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{statistics.currentStreak}</Text>
                <Text style={styles.streakLabel}>السلسلة الحالية</Text>
              </View>
              <View style={styles.streakItem}>
                <Text style={styles.streakValue}>{statistics.longestStreak}</Text>
                <Text style={styles.streakLabel}>أطول سلسلة</Text>
              </View>
            </View>
          </View>
          
          {/* أفضل يوم */}
          {statistics.bestDayCount > 0 && (
            <View style={styles.bestDayCard}>
              <Text style={styles.bestDayTitle}>⭐ أفضل يوم</Text>
              <Text style={styles.bestDayCount}>{statistics.bestDayCount} ذكر</Text>
              {statistics.bestDayDate && (
                <Text style={styles.bestDayDate}>{statistics.bestDayDate}</Text>
              )}
            </View>
          )}
          
          {/* الأكثر استخداماً */}
          {stats.maxCount > 0 && (
            <View style={styles.mostUsedCard}>
              <Text style={styles.mostUsedLabel}>🏆 الأكثر استخداماً</Text>
              <Text style={styles.mostUsedDhikr}>{stats.mostUsedDhikr}</Text>
              <Text style={styles.mostUsedCount}>{stats.maxCount} مرة</Text>
            </View>
          )}
          
          {/* معلومات إضافية */}
          <View style={styles.additionalInfoCard}>
            <Text style={styles.additionalInfoText}>📅 عدد أيام الاستخدام: {stats.daysSinceStart} يوم</Text>
            {dailyHistory.length > 0 && (
              <Text style={styles.additionalInfoText}>📈 السجل التاريخي: {dailyHistory.length} يوم</Text>
            )}
          </View>
        </View>

        {/* عرض الإجماليات */}
        <View style={styles.totalsContainer}>
          <Text style={styles.sectionTitle}>إجمالي الأذكار المحفوظة</Text>
          {ADHKAR_LIST.map((dhikr, index) => {
            const total = totalCounts[dhikr] || 0;
            const current = currentCounts[dhikr] || 0;
            const percentage = stats.totalAll > 0 ? Math.round((total / stats.totalAll) * 100) : 0;
            
            return (
              <View key={index} style={styles.totalItem}>
                <View style={styles.totalItemLeft}>
                  <Text style={styles.totalDhikrName}>{dhikr}</Text>
                  <Text style={styles.currentCountText}>جلسة حالية: {current}</Text>
                </View>
                <View style={styles.totalItemRight}>
                  <View style={styles.totalCountBadge}>
                    <Text style={styles.totalCountText}>{total}</Text>
                  </View>
                  {percentage > 0 && (
                    <Text style={styles.percentageText}>{percentage}%</Text>
                  )}
                </View>
              </View>
            );
          })}
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
  statisticsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0d7377',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2.22,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#0d7377',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  mostUsedCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  mostUsedLabel: {
    fontSize: 16,
    color: '#856404',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mostUsedDhikr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: 5,
  },
  mostUsedCount: {
    fontSize: 18,
    color: '#666',
  },
  streakContainer: {
    backgroundColor: '#ffe0b2',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e65100',
    textAlign: 'center',
    marginBottom: 12,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6f00',
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bestDayCard: {
    backgroundColor: '#e1f5fe',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#0288d1',
  },
  bestDayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01579b',
    marginBottom: 8,
  },
  bestDayCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0277bd',
    marginBottom: 5,
  },
  bestDayDate: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfoCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#9c27b0',
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#4a148c',
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalItemLeft: {
    flex: 1,
  },
  totalItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalDhikrName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentCountText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
  percentageText: {
    fontSize: 14,
    color: '#0d7377',
    fontWeight: 'bold',
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
