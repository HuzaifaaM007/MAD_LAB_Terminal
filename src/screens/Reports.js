import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllPrayerData } from '../utils/Storage';
import CustomButton from '../components/CustomButton';

const Reports = () => {
    const [prayerData, setPrayerData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState('week'); // 'week' | 'month' | 'custom'

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPrayerData();
            setPrayerData(data);
            applyRangeFilter('week', data);
        };
        fetchData();
    }, []);

    const applyRangeFilter = (range, data = prayerData) => {
        setSelectedRange(range);
        if (range === 'week') filterDataForCurrentWeek(data);
        else if (range === 'month') filterDataForCurrentMonth(data);
    };

    const filterDataForCurrentWeek = (data) => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
        const filtered = filterDataByDateRange(data, startOfWeek, endOfWeek);
        setFilteredData(filtered);
    };

    const filterDataForCurrentMonth = (data) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const filtered = filterDataByDateRange(data, startOfMonth, endOfMonth);
        setFilteredData(filtered);
    };

    const filterDataByDateRange = (data, start, end) => {
        setStartDate(start);
        setEndDate(end);
        const filtered = {};
        Object.keys(data).forEach((date) => {
            const prayerDate = new Date(date);
            if (prayerDate >= start && prayerDate <= end) filtered[date] = data[date];
        });
        return filtered;
    };

    const calculateStatistics = (data) => {
        let performed = 0;
        let missed = 0;
        let withJamat = 0;

        Object.values(data).forEach((day) => {
            Object.values(day).forEach((prayer) => {
                if (prayer.performed) {
                    performed++;
                    if (prayer.withJamat) withJamat++;
                } else missed++;
            });
        });

        return { performed, missed, withJamat };
    };

    const applyCustomFilter = () => {
        setSelectedRange('custom');
        const filtered = filterDataByDateRange(prayerData, startDate, endDate);
        setFilteredData(filtered);
    };

    const stats = calculateStatistics(filteredData);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Prayer Reports</Text>



            <Text style={styles.dateLabel}>
                {startDate.toDateString()} - {endDate.toDateString()}
            </Text>

            <StatsSection stats={stats} />
            {selectedRange === 'custom' && (
                <View style={styles.datePickerContainer}>
                    <CustomButton title="Select Start Date" onPress={() => setShowStartPicker(true)} />
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            themeVariant="dark"
                            onChange={(event, selectedDate) => {
                                setShowStartPicker(false);
                                if (selectedDate) setStartDate(selectedDate);
                            }}
                        />
                    )}
                    <CustomButton title="Select End Date" onPress={() => setShowEndPicker(true)} />
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            themeVariant="dark"
                            onChange={(event, selectedDate) => {
                                setShowEndPicker(false);
                                if (selectedDate) setEndDate(selectedDate);
                            }}
                        />
                    )}
                    <CustomButton title="Apply Filter" onPress={applyCustomFilter} />
                </View>
            )}

            <View style={styles.radioContainer}>
                <RadioButton
                    label="Current Week"
                    value="week"
                    selected={selectedRange === 'week'}
                    onPress={() => applyRangeFilter('week')}
                />
                <RadioButton
                    label="Current Month"
                    value="month"
                    selected={selectedRange === 'month'}
                    onPress={() => applyRangeFilter('month')}
                />
                <RadioButton
                    label="Custom"
                    value="custom"
                    selected={selectedRange === 'custom'}
                    onPress={() => setSelectedRange('custom')}
                />
            </View>

        </ScrollView>
    );
};

const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
        <View style={[styles.radioOuter, selected && styles.radioSelectedOuter]}>
            {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
);

const StatsSection = ({ stats }) => (
    <View style={styles.statsCard}>
        <Text style={styles.statsHeader}>Summary</Text>
        <View style={styles.statRow}>
            <Text style={styles.statLabel}>Performed:</Text>
            <Text style={styles.statValue}>{stats.performed}</Text>
        </View>
        <View style={styles.statRow}>
            <Text style={styles.statLabel}>Missed:</Text>
            <Text style={styles.statValue}>{stats.missed}</Text>
        </View>
        <View style={styles.statRow}>
            <Text style={styles.statLabel}>With Jamat:</Text>
            <Text style={styles.statValue}>{stats.withJamat}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#020617',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        color: '#e5e7eb',
        marginVertical: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94a3b8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioSelectedOuter: {
        borderColor: '#38bdf8',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#38bdf8',
    },
    radioLabel: {
        color: '#e5e7eb',
        fontSize: 16,
    },
    datePickerContainer: {
        marginBottom: 20,
    },
    dateLabel: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsCard: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 3,
    },
    statsHeader: {
        fontSize: 20,
        fontWeight: '700',
        color: '#38bdf8',
        textAlign: 'center',
        marginBottom: 15,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    statLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#e5e7eb',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#38bdf8',
    },
});

export default Reports;
