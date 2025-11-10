/**
 * تطبيق عداد الأذكار والتسبيح
 * Dhikr Counter Application
 * 
 * هذا التطبيق يسمح للمستخدم بعد الأذكار والتسبيحات المختلفة
 * مع حفظ البيانات محلياً واسترجاعها عند فتح التطبيق
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

// تفعيل اتجاه RTL للغة العربية
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const {width: SCREEN_WIDTH} = Dimensions.get('window');

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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const counterScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  /**
   * تحميل البيانات المحفوظة عند بدء التطبيق
   */
  useEffect(() => {
    loadData();
    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
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
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Counter scale animation
    Animated.sequence([
      Animated.timing(counterScaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(counterScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Ripple animation
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
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
    
    return {
      totalAll,
      currentAll,
      mostUsedDhikr,
      maxCount,
    };
  };
  
  const stats = calculateStatistics();

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a5f5f" />
      
      {/* شريط العنوان */}
      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <Text style={styles.headerTitle}>✨ عداد الأذكار والتسبيح</Text>
        <Text style={styles.headerSubtitle}>احفظ أورادك اليومية بسهولة</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* قسم اختيار الذكر */}
        <Animated.View style={[styles.pickerContainer, {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [20, 0]})}]}]}>
          <Text style={styles.sectionTitle}>📿 اختر نوع الذكر</Text>
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
        </Animated.View>

        {/* عرض الذكر المختار */}
        <Animated.View style={[styles.dhikrDisplayContainer, {opacity: fadeAnim, transform: [{scale: fadeAnim}]}]}>
          <Text style={styles.dhikrText}>🌙 {selectedDhikr} 🌙</Text>
        </Animated.View>

        {/* العداد الحالي */}
        <Animated.View style={[styles.counterContainer, {opacity: fadeAnim, transform: [{scale: counterScaleAnim}]}]}>
          <Text style={styles.counterLabel}>العدد الحالي</Text>
          <Animated.Text style={styles.counterValue}>{currentCount}</Animated.Text>
        </Animated.View>

        {/* زر العد الرئيسي */}
        <Animated.View style={{transform: [{scale: buttonScaleAnim}]}}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={incrementCounter}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.rippleCircle,
              {
                transform: [{scale: rippleScale}],
                opacity: rippleOpacity,
              },
            ]} />
            <Text style={styles.mainButtonText}>سَبِّح ✨</Text>
            <Text style={styles.mainButtonSubtext}>اضغط للعد</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* أزرار التحكم */}
        <Animated.View style={[styles.controlButtons, {opacity: fadeAnim}]}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetCurrentCounter}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>🔄 إعادة تعيين العداد</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* قسم الإحصائيات */}
        <Animated.View style={[styles.statisticsContainer, {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [30, 0]})}]}]}>
          <Text style={styles.sectionTitle}>📊 الإحصائيات</Text>
          
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
          
          {stats.maxCount > 0 && (
            <View style={styles.mostUsedCard}>
              <Text style={styles.mostUsedLabel}>🏆 الأكثر استخداماً</Text>
              <Text style={styles.mostUsedDhikr}>{stats.mostUsedDhikr}</Text>
              <Text style={styles.mostUsedCount}>{stats.maxCount} مرة</Text>
            </View>
          )}
        </Animated.View>

        {/* عرض الإجماليات */}
        <Animated.View style={[styles.totalsContainer, {opacity: fadeAnim}]}>
          <Text style={styles.sectionTitle}>💾 إجمالي الأذكار المحفوظة</Text>
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
        </Animated.View>

        {/* زر مسح البيانات */}
        <Animated.View style={{opacity: fadeAnim}}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllData}
            activeOpacity={0.8}
          >
            <Text style={styles.clearButtonText}>🗑️ مسح جميع البيانات</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* مساحة إضافية في الأسفل */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#0a7e8c',
    paddingTop: Platform.OS === 'web' ? 30 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH < 360 ? 24 : 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    color: '#b3e5fc',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SCREEN_WIDTH < 360 ? 15 : 20,
    paddingBottom: 40,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 16 : 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH < 360 ? 18 : 22,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: '#f8fbfd',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#b3e5fc',
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    fontSize: SCREEN_WIDTH < 360 ? 18 : 20,
    textAlign: 'center',
  },
  pickerItemText: {
    fontSize: SCREEN_WIDTH < 360 ? 18 : 20,
  },
  dhikrDisplayContainer: {
    backgroundColor: '#4dd0e1',
    borderRadius: 25,
    padding: SCREEN_WIDTH < 360 ? 20 : 28,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dhikrText: {
    fontSize: SCREEN_WIDTH < 360 ? 26 : 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  counterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: SCREEN_WIDTH < 360 ? 25 : 35,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4dd0e1',
    elevation: 4,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  counterLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 20,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  counterValue: {
    fontSize: SCREEN_WIDTH < 360 ? 64 : 80,
    fontWeight: 'bold',
    color: '#0a7e8c',
  },
  mainButton: {
    backgroundColor: '#0a7e8c',
    borderRadius: 30,
    padding: SCREEN_WIDTH < 360 ? 25 : 35,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  mainButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 32 : 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  mainButtonSubtext: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    color: '#b3e5fc',
    fontWeight: '500',
  },
  rippleCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  controlButtons: {
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#ff9800',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#ff9800',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  resetButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statisticsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 16 : 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 360 ? 12 : 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4dd0e1',
    elevation: 2,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: SCREEN_WIDTH < 360 ? 32 : 40,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  mostUsedCard: {
    backgroundColor: '#fff9e6',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 360 ? 14 : 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd54f',
    elevation: 2,
    shadowColor: '#ffb300',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mostUsedLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    color: '#f57c00',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mostUsedDhikr: {
    fontSize: SCREEN_WIDTH < 360 ? 22 : 26,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 5,
  },
  mostUsedCount: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    color: '#666',
    fontWeight: '600',
  },
  totalsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 16 : 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SCREEN_WIDTH < 360 ? 12 : 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e3f2fd',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    marginBottom: 8,
  },
  totalItemLeft: {
    flex: 1,
  },
  totalItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalDhikrName: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentCountText: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#666',
    fontStyle: 'italic',
  },
  totalCountBadge: {
    backgroundColor: '#0a7e8c',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: SCREEN_WIDTH < 360 ? 12 : 15,
    minWidth: SCREEN_WIDTH < 360 ? 50 : 60,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  totalCountText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  percentageText: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#0a7e8c',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#e53935',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#e53935',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  clearButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default App;
