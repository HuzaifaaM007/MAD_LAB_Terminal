import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const CalendarViewScreen = () => {
  const navigation = useNavigation();

  const handleDateSelect = (day) => {
    navigation.navigate('DailyPrayers', {
      selectedDate: day.dateString,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Calendar View</Text>
        </View>

        <Calendar
          onDayPress={handleDateSelect}
          style={styles.calendar}
          theme={{
            backgroundColor: '#0f172a',
            calendarBackground: '#0f172a',

            textSectionTitleColor: '#94a3b8',
            textSectionTitleDisabledColor: '#475569',

            selectedDayBackgroundColor: '#38bdf8',
            selectedDayTextColor: '#020617',

            todayTextColor: '#38bdf8',

            dayTextColor: '#e5e7eb',
            textDisabledColor: '#475569',

            arrowColor: '#38bdf8',
            monthTextColor: '#e5e7eb',

            textMonthFontSize: 22,
            textMonthFontWeight: '600',

            textDayFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
        
      </View>
    </View>
  );
};

export default CalendarViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b1eff',
    justifyContent: 'center',
    padding: 16,
  },

  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },

  headerText: {
    color: '#e5e7eb',
    fontSize: 28,
    fontWeight: '700',
  },

  calendarWrapper: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  calendar: {
    borderRadius: 12,
  },
});
