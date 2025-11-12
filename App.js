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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swal from 'sweetalert2';
import {TRANSLATIONS, ADHKAR_KEYS, LANGUAGES} from './languages';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// مفاتيح التخزين المحلي
const STORAGE_KEY_TOTALS = '@dhikr_counter_totals';
const STORAGE_KEY_CURRENT = '@dhikr_counter_current';
const STORAGE_KEY_SELECTED = '@dhikr_counter_selected';
const STORAGE_KEY_STATS = '@dhikr_counter_statistics';
const STORAGE_KEY_DAILY_HISTORY = '@dhikr_counter_daily_history';

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
    // Play sound effect
    playCounterSound();
    
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

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  /**
   * Play counter sound effect
   */
  const playCounterSound = () => {
    if (Platform.OS === 'web') {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for a pleasant beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound - pleasant "ding" sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Higher frequency
        oscillator.type = 'sine'; // Smooth sine wave
        
        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Sound playback not supported');
      }
    }
  };

  /**
   * Render language selector
   */
  const renderLanguageSelector = () => (
    <View style={styles.languageSelectorWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.languageSelectorScroll}
        style={styles.languageSelectorContainer}
      >
        {Object.values(LANGUAGES).sort((a, b) => a.order - b.order).map((lang) => (
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
      </ScrollView>
      {/* Mosque Image */}
      {Platform.OS === 'web' ? (
        <img 
          src="https://wagrmmbkukwblfpfxxcb.supabase.co/storage/v1/object/public/web-img/islamic-arabic-blue-shape-of-masjid-mosque-vector-11642573201guxqvuqnod-removebg-preview.png"
          alt="Mosque"
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            display: 'block',
            margin: '0 auto 16px auto',
            opacity: 0.8
          }}
        />
      ) : (
        <Image 
          source={{uri: 'https://wagrmmbkukwblfpfxxcb.supabase.co/storage/v1/object/public/web-img/islamic-arabic-blue-shape-of-masjid-mosque-vector-11642573201guxqvuqnod-removebg-preview.png'}}
          style={styles.mosqueImage}
          resizeMode="contain"
        />
      )}
    </View>
  );

  /**
   * Render prettier dhikr selection
   */
  const renderDhikrSelection = () => {
    const isDesktop = SCREEN_WIDTH >= 768;
    
    if (isDesktop) {
      // Desktop: Show all cards in a wrapped grid
      return (
        <Animated.View style={[styles.selectionContainer, {opacity: fadeAnim}]}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t.selectDhikr}
          </Text>
          <View style={styles.dhikrGridContainer}>
            {ADHKAR_KEYS.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.dhikrCardDesktop,
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
          </View>
        </Animated.View>
      );
    }
    
    // Mobile: Horizontal scroll
    return (
      <Animated.View style={[styles.selectionContainer, {opacity: fadeAnim}]}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t.selectDhikr}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dhikrScrollContainer}
          style={styles.dhikrScrollView}
        >
          {ADHKAR_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.dhikrCardMobile,
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
  };

  /**
   * Render counter view
   */
  const renderCounterView = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      {/* Language Selector */}
      {renderLanguageSelector()}
      
      {/* Dhikr Selection */}
      {renderDhikrSelection()}

      {/* عرض الذكر المختار */}
      <Animated.View style={[styles.dhikrDisplayContainer, {opacity: fadeAnim, transform: [{scale: fadeAnim}]}]}>
        <Text style={[styles.dhikrText, isRTL && styles.textRTL]}>
          {t[selectedDhikr]}
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
          role="button"
          aria-label="Increment counter"
        >
          <Animated.View style={[
            styles.rippleCircle,
            {
              transform: [{scale: rippleScale}],
              opacity: rippleOpacity,
            },
          ]} />
          <Text style={[styles.mainButtonText, isRTL && styles.textRTL]}>
            {t.mainButton}
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
          role="button"
          aria-label="Reset counter"
        >
          <Text style={[styles.resetButtonText, isRTL && styles.textRTL]}>
            {t.resetCounter}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => setCurrentView('statistics')}
          activeOpacity={0.8}
          role="button"
          aria-label="View statistics"
        >
          <Text style={[styles.statsButtonText, isRTL && styles.textRTL]}>
            {t.viewStatistics}
          </Text>
        </TouchableOpacity>
      </Animated.View>

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
        
        {stats.maxCount > 0 && (
          <View style={styles.mostUsedCard}>
            <Text style={[styles.mostUsedLabel, isRTL && styles.textRTL]}>
              {t.mostUsed}
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
          {t.savedTotals}
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

  /**
   * Render Islamic Theme Background Elements
   */
  const renderIslamicBackground = () => {
    if (Platform.OS === 'web') {
      return (
        <div className="islamic-background">
          {/* Stars Container */}
          <div className="stars-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Shooting Stars */}
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>

          {/* Galaxy Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="galaxy-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}

          {/* Sparkles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Islamic Pattern Overlay */}
          <div className="islamic-pattern"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e27" />
      
      {/* Islamic Theme Background */}
      {renderIslamicBackground()}
      
      {/* شريط العنوان */}
      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            {Platform.OS === 'web' ? (
              <img 
                src="adhkar-icon.svg" 
                alt="ADHKAR" 
                style={{
                  width: '35px',
                  height: '35px',
                  marginRight: isRTL ? '0' : '20px',
                  marginLeft: isRTL ? '20px' : '0',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            ) : (
              <Image 
                source={require('./public/adhkar-icon.svg')}
                style={styles.headerIcon}
              />
            )}
            <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
              {t.appTitle}
            </Text>
          </View>
        </View>
      </Animated.View>

      {currentView === 'counter' ? renderCounterView() : renderStatisticsView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    backgroundColor: 'rgba(30, 58, 95, 0.95)',
    paddingTop: Platform.OS === 'web' ? 30 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    width: 35,
    height: 35,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH < 360 ? 26 : 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    color: '#ffd700',
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
    paddingBottom: 100,
    flexGrow: 1,
  },
  
  // Language Selector
  languageSelectorWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageSelectorContainer: {
    flexGrow: 0,
  },
  languageSelectorScroll: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(77, 208, 225, 0.3)',
    marginRight: 10,
  },
  languageButtonActive: {
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    borderColor: '#4dd0e1',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b0c4de',
  },
  languageButtonTextActive: {
    color: '#ffffff',
  },
  mosqueImage: {
    width: '100%',
    maxWidth: 400,
    height: 150,
    marginBottom: 16,
    opacity: 0.8,
  },
  
  // Dhikr Selection
  selectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH < 360 ? 18 : 22,
    fontWeight: 'bold',
    color: '#4dd0e1',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(77, 208, 225, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  // Desktop: Grid layout
  dhikrGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  dhikrCardDesktop: {
    width: SCREEN_WIDTH >= 1024 ? 180 : 160,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.3)',
    elevation: 8,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  // Mobile: Horizontal scroll
  dhikrScrollView: {
    flexGrow: 0,
  },
  dhikrScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    gap: 12,
  },
  dhikrCardMobile: {
    width: SCREEN_WIDTH < 360 ? 140 : 160,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.3)',
    elevation: 8,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  dhikrCardActive: {
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    borderColor: '#4dd0e1',
    borderWidth: 2,
    elevation: 12,
    shadowColor: '#4dd0e1',
    shadowOpacity: 0.6,
  },
  dhikrCardText: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    fontWeight: '600',
    color: '#e0f7fa',
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
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dhikrCardCheckIcon: {
    color: '#0a0e27',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Dhikr Display
  dhikrDisplayContainer: {
    backgroundColor: 'rgba(77, 208, 225, 0.15)',
    borderRadius: 25,
    padding: SCREEN_WIDTH < 360 ? 20 : 28,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    elevation: 8,
    shadowColor: '#ffd700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  dhikrText: {
    fontSize: SCREEN_WIDTH < 360 ? 24 : 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(77, 208, 225, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  
  // Counter
  counterContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: SCREEN_WIDTH < 360 ? 25 : 35,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(77, 208, 225, 0.5)',
    elevation: 10,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  counterLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 20,
    color: '#b3e5fc',
    marginBottom: 10,
    fontWeight: '600',
  },
  counterValue: {
    fontSize: SCREEN_WIDTH < 360 ? 64 : 80,
    fontWeight: 'bold',
    color: '#ffd700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },
  
  // Main Button
  mainButton: {
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    borderRadius: 30,
    padding: SCREEN_WIDTH < 360 ? 25 : 35,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4dd0e1',
    elevation: 12,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 15,
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
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9800',
    elevation: 6,
    shadowColor: '#ff9800',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  resetButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
    elevation: 6,
    shadowColor: '#4caf50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  statsButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: 'rgba(229, 57, 53, 0.3)',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 14 : 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e53935',
    elevation: 6,
    shadowColor: '#e53935',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  clearButtonText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Statistics View
  backButton: {
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4dd0e1',
    elevation: 6,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statisticsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 16 : 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.3)',
    elevation: 6,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(77, 208, 225, 0.15)',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 360 ? 12 : 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.4)',
    elevation: 4,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  statValue: {
    fontSize: SCREEN_WIDTH < 360 ? 32 : 40,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  statLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#b3e5fc',
    textAlign: 'center',
    fontWeight: '600',
  },
  mostUsedCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 360 ? 14 : 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
    elevation: 6,
    shadowColor: '#ffd700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  mostUsedLabel: {
    fontSize: SCREEN_WIDTH < 360 ? 14 : 16,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mostUsedDhikr: {
    fontSize: SCREEN_WIDTH < 360 ? 20 : 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  mostUsedCount: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    color: '#b3e5fc',
    fontWeight: '600',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: SCREEN_WIDTH < 360 ? 16 : 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.3)',
    elevation: 6,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SCREEN_WIDTH < 360 ? 12 : 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(77, 208, 225, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#e0f7fa',
    marginBottom: 4,
  },
  currentCountText: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#b0c4de',
    fontStyle: 'italic',
  },
  totalCountBadge: {
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: SCREEN_WIDTH < 360 ? 12 : 15,
    minWidth: SCREEN_WIDTH < 360 ? 50 : 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4dd0e1',
    elevation: 3,
    shadowColor: '#4dd0e1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  totalCountText: {
    fontSize: SCREEN_WIDTH < 360 ? 16 : 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  percentageText: {
    fontSize: SCREEN_WIDTH < 360 ? 12 : 14,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default App;
