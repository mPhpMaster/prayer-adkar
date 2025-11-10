/**
 * تطبيق عداد الأذكار والتسبيح - محسّن
 * Enhanced Dhikr Counter Application
 * 
 * Features:
 * - Multi-language support (Arabic, English, Thai)
 * - Beautiful selection UI
 * - Separate statistics page
 * - SweetAlert2 integration
 * - Smooth animations
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swal from 'sweetalert2';
import {TRANSLATIONS, ADHKAR_KEYS, LANGUAGES} from './languages';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// مفاتيح التخزين المحلي
const STORAGE_KEY_TOTALS = '@dhikr_counter_totals';
const STORAGE_KEY_CURRENT = '@dhikr_counter_current';
const STORAGE_KEY_SELECTED = '@dhikr_counter_selected';
const STORAGE_KEY_LANGUAGE = '@dhikr_counter_language';

const App = () => {
  // Language state
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);
  
  // View state
  const [currentView, setCurrentView] = useState('counter'); // 'counter' or 'statistics'
  
  // الذكر المختار حالياً
  const [selectedDhikr, setSelectedDhikr] = useState(ADHKAR_KEYS[0]);
  
  // إجمالي العدد لكل ذكر
  const [totalCounts, setTotalCounts] = useState(() => {
    const initial = {};
    ADHKAR_KEYS.forEach(key => {
      initial[key] = 0;
    });
    return initial;
  });
  
  // العداد الحالي لكل ذكر
  const [currentCounts, setCurrentCounts] = useState(() => {
    const initial = {};
    ADHKAR_KEYS.forEach(key => {
      initial[key] = 0;
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

  // Get translations
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

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
   * حفظ اللغة المختارة
   */
  useEffect(() => {
    saveLanguage();
    setIsRTL(LANGUAGES[language]?.dir === 'rtl');
  }, [language]);

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
        if (ADHKAR_KEYS.includes(loadedSelected)) {
          setSelectedDhikr(loadedSelected);
        }
      }
      
      // تحميل اللغة
      const languageJson = await AsyncStorage.getItem(STORAGE_KEY_LANGUAGE);
      if (languageJson != null) {
        const loadedLanguage = JSON.parse(languageJson);
        if (LANGUAGES[loadedLanguage]) {
          setLanguage(loadedLanguage);
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    }
  };

  /**
   * حفظ البيانات في التخزين المحلي
   */
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TOTALS, JSON.stringify(totalCounts));
      await AsyncStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentCounts));
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    }
  };
  
  /**
   * حفظ الذكر المختار
   */
  const saveSelectedDhikr = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(selectedDhikr));
    } catch (error) {
      console.error('خطأ في حفظ الذكر المختار:', error);
    }
  };
  
  /**
   * حفظ اللغة
   */
  const saveLanguage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, JSON.stringify(language));
    } catch (error) {
      console.error('خطأ في حفظ اللغة:', error);
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
    Swal.fire({
      title: t.resetTitle,
      text: `${t.resetMessage} ${t[selectedDhikr]}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff9800',
      cancelButtonColor: '#999',
      confirmButtonText: t.resetConfirm,
      cancelButtonText: t.cancel,
      reverseButtons: isRTL,
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentCounts(prevCounts => ({
          ...prevCounts,
          [selectedDhikr]: 0,
        }));
      }
    });
  };

  /**
   * مسح جميع البيانات المحفوظة
   */
  const clearAllData = () => {
    Swal.fire({
      title: t.clearTitle,
      text: t.clearMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#999',
      confirmButtonText: t.clearConfirm,
      cancelButtonText: t.cancel,
      reverseButtons: isRTL,
    }).then((result) => {
      if (result.isConfirmed) {
        const resetCounts = {};
        ADHKAR_KEYS.forEach(key => {
          resetCounts[key] = 0;
        });
        setTotalCounts(resetCounts);
        setCurrentCounts(resetCounts);
        
        Swal.fire({
          title: t.success,
          text: t.dataCleared,
          icon: 'success',
          confirmButtonColor: '#0a7e8c',
          timer: 2000,
        });
      }
    });
  };

  /**
   * تغيير الذكر المختار
   */
  const handleDhikrChange = (dhikrKey) => {
    setSelectedDhikr(dhikrKey);
  };

  /**
   * Change language
   */
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  /**
   * حساب إحصائيات الأذكار
   */
  const calculateStatistics = () => {
    const totalAll = Object.values(totalCounts).reduce((sum, count) => sum + count, 0);
    const currentAll = Object.values(currentCounts).reduce((sum, count) => sum + count, 0);
    
    let mostUsedDhikr = ADHKAR_KEYS[0];
    let maxCount = totalCounts[mostUsedDhikr] || 0;
    ADHKAR_KEYS.forEach(key => {
      if ((totalCounts[key] || 0) > maxCount) {
        maxCount = totalCounts[key] || 0;
        mostUsedDhikr = key;
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

  /**
   * Render language selector
   */
  const renderLanguageSelector = () => (
    <View style={styles.languageSelector}>
      {Object.values(LANGUAGES).map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageButton,
            language === lang.code && styles.languageButtonActive,
          ]}
          onPress={() => changeLanguage(lang.code)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageButtonText,
              language === lang.code && styles.languageButtonTextActive,
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Render prettier dhikr selection
   */
  const renderDhikrSelection = () => (
    <Animated.View style={[styles.selectionContainer, {opacity: fadeAnim}]}>
      <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
        📿 {t.selectDhikr}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dhikrScrollContainer}
      >
        {ADHKAR_KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.dhikrCard,
              selectedDhikr === key && styles.dhikrCardActive,
            ]}
            onPress={() => handleDhikrChange(key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dhikrCardText,
                selectedDhikr === key && styles.dhikrCardTextActive,
                isRTL && styles.textRTL,
              ]}
              numberOfLines={2}
            >
              {t[key]}
            </Text>
            {selectedDhikr === key && (
              <View style={styles.dhikrCardCheck}>
                <Text style={styles.dhikrCardCheckIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  /**
   * Render counter view
   */
  const renderCounterView = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Language Selector */}
      {renderLanguageSelector()}
      
      {/* Dhikr Selection */}
      {renderDhikrSelection()}

      {/* عرض الذكر المختار */}
      <Animated.View style={[styles.dhikrDisplayContainer, {opacity: fadeAnim, transform: [{scale: fadeAnim}]}]}>
        <Text style={[styles.dhikrText, isRTL && styles.textRTL]}>
          🌙 {t[selectedDhikr]} 🌙
        </Text>
      </Animated.View>

      {/* العداد الحالي */}
      <Animated.View style={[styles.counterContainer, {opacity: fadeAnim, transform: [{scale: counterScaleAnim}]}]}>
        <Text style={[styles.counterLabel, isRTL && styles.textRTL]}>
          {t.currentCount}
        </Text>
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
          <Text style={[styles.mainButtonText, isRTL && styles.textRTL]}>
            {t.mainButton} ✨
          </Text>
          <Text style={[styles.mainButtonSubtext, isRTL && styles.textRTL]}>
            {t.mainButtonSub}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* أزرار التحكم */}
      <Animated.View style={[styles.controlButtons, {opacity: fadeAnim}]}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetCurrentCounter}
          activeOpacity={0.8}
        >
          <Text style={[styles.resetButtonText, isRTL && styles.textRTL]}>
            🔄 {t.resetCounter}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => setCurrentView('statistics')}
          activeOpacity={0.8}
        >
          <Text style={[styles.statsButtonText, isRTL && styles.textRTL]}>
            📊 {t.viewStatistics}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* زر مسح البيانات */}
      <Animated.View style={{opacity: fadeAnim}}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllData}
          activeOpacity={0.8}
        >
          <Text style={[styles.clearButtonText, isRTL && styles.textRTL]}>
            🗑️ {t.clearAllData}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  /**
   * Render statistics view
   */
  const renderStatisticsView = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentView('counter')}
        activeOpacity={0.8}
      >
        <Text style={[styles.backButtonText, isRTL && styles.textRTL]}>
          {isRTL ? '→' : '←'} {t.backToCounter}
        </Text>
      </TouchableOpacity>

      {/* قسم الإحصائيات */}
      <View style={styles.statisticsContainer}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          📊 {t.statistics}
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalAll}</Text>
            <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
              {t.totalAll}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.currentAll}</Text>
            <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
              {t.currentSession}
            </Text>
          </View>
        </View>
        
        {stats.maxCount > 0 && (
          <View style={styles.mostUsedCard}>
            <Text style={[styles.mostUsedLabel, isRTL && styles.textRTL]}>
              🏆 {t.mostUsed}
            </Text>
            <Text style={[styles.mostUsedDhikr, isRTL && styles.textRTL]}>
              {t[stats.mostUsedDhikr]}
            </Text>
            <Text style={[styles.mostUsedCount, isRTL && styles.textRTL]}>
              {stats.maxCount} {t.times}
            </Text>
          </View>
        )}
      </View>

      {/* عرض الإجماليات */}
      <View style={styles.totalsContainer}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          💾 {t.savedTotals}
        </Text>
        {ADHKAR_KEYS.map((key, index) => {
          const total = totalCounts[key] || 0;
          const current = currentCounts[key] || 0;
          const percentage = stats.totalAll > 0 ? Math.round((total / stats.totalAll) * 100) : 0;
          
          return (
            <View key={index} style={styles.totalItem}>
              <View style={styles.totalItemLeft}>
                <Text style={[styles.totalDhikrName, isRTL && styles.textRTL]}>
                  {t[key]}
                </Text>
                <Text style={[styles.currentCountText, isRTL && styles.textRTL]}>
                  {t.session}: {current}
                </Text>
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

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a5f5f" />
      
      {/* شريط العنوان */}
      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
          ✨ {t.appTitle}
        </Text>
        <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>
          {t.appSubtitle}
        </Text>
      </Animated.View>

      {currentView === 'counter' ? renderCounterView() : renderStatisticsView()}
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
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SCREEN_WIDTH < 360 ? 15 : 20,
    paddingBottom: 40,
  },
  
  // Language Selector
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  languageButtonActive: {
    backgroundColor: '#0a7e8c',
    borderColor: '#0a7e8c',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  languageButtonTextActive: {
    color: '#ffffff',
  },
  
  // Dhikr Selection
  selectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH < 360 ? 18 : 22,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 15,
    textAlign: 'center',
  },
  dhikrScrollContainer: {
    paddingVertical: 10,
    gap: 12,
  },
  dhikrCard: {
    width: SCREEN_WIDTH < 360 ? 140 : 160,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  dhikrCardActive: {
    backgroundColor: '#4dd0e1',
    borderColor: '#0a7e8c',
    borderWidth: 3,
    elevation: 6,
    shadowOpacity: 0.25,
  },
  dhikrCardText: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dhikrCardTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dhikrCardCheck: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0a7e8c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dhikrCardCheckIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Dhikr Display
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
    fontSize: SCREEN_WIDTH < 360 ? 24 : 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  
  // Counter
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
  
  // Main Button
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
  
  // Control Buttons
  controlButtons: {
    marginBottom: 16,
    gap: 12,
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
  statsButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#4caf50',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  statsButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
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
  
  // Statistics View
  backButton: {
    backgroundColor: '#0a7e8c',
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0a7e8c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 16,
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
    fontSize: SCREEN_WIDTH < 360 ? 20 : 24,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 5,
    textAlign: 'center',
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
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
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
  bottomSpacing: {
    height: 40,
  },
});

export default App;
