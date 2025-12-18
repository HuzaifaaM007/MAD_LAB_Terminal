import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';
import { getPrayerData, setPrayerData } from '../utils/Storage';

const DailyPrayers = ({ route }) => {
    console.log(route.params);
    const selectedDate = route.params.selectedDate;
    const [prayerData, setPrayerDataState] = useState({});

    useEffect(() => {
        const fetchPrayerData = async () => {
            const data = await getPrayerData(selectedDate);
            setPrayerDataState(data);
           
        };
        fetchPrayerData();
    }, [selectedDate]);

    const updatePrayerStatus = async (prayerName, performed, withJamat) => {
        await setPrayerData(selectedDate, prayerName, performed, withJamat);
        const updatedData = await getPrayerData(selectedDate);
        setPrayerDataState(updatedData);
    };

    const renderPrayerItem = ({ item }) => {
        const { name, details } = item;

        return (
            <View style={styles.prayerItem}>
                <Text style={styles.prayerName}>{name}</Text>
                <Text style={styles.prayerDetails}>
                    Performed: {details.performed ? 'Yes' : 'No'} | With Jamat: {details.withJamat ? 'Yes' : 'No'}
                </Text>
                <View style={styles.actions}>
                    <View style={styles.switchContainer}>
                        <View style={styles.switchItem}>
                            <Text style={styles.switchLabel}>Performed</Text>
                            <Switch
                                trackColor={{ false: '#555', true: '#38bdf8' }}
                                thumbColor="#fff"
                                value={details.performed}
                                onValueChange={() => updatePrayerStatus(name, !details.performed, !details.performed && details.withJamat)}
                            />
                        </View>
                        <View style={styles.switchItem}>
                            <Text style={styles.switchLabel}>With Jamat</Text>
                            <Switch
                                trackColor={{ false: '#555', true: '#38bdf8' }}
                                thumbColor="#fff"
                                value={details.withJamat}
                                onValueChange={(value) => {
                                    details.performed ? updatePrayerStatus(name, details.performed, value) : null;
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const getPrayerList = () => {
        return Object.keys(prayerData).map((key) => ({
            name: key,
            details: prayerData[key],
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Daily Prayers</Text>
            </View>

            <Text style={styles.dateText}>Date: {selectedDate}</Text>

            {Object.keys(prayerData).length > 0 ? (
                <FlatList
                    data={getPrayerList()}
                    keyExtractor={(item) => item.name}
                    renderItem={renderPrayerItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <Text style={styles.noDataText}>No prayer data available for this date.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#020617',
    },
    headerContainer: {
        marginBottom: 16,
        marginTop:32,
        alignItems: 'center',
    },

    headerText: {
        color: '#e5e7eb',
        fontSize: 28,
        fontWeight: '700',
    },

    dateText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#e5e7eb',
    },
    noDataText: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 20,
    },
    prayerItem: {
        padding: 16,
        marginVertical: 6,
        backgroundColor: '#0f172a',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 3,
    },
    prayerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#38bdf8',
    },
    prayerDetails: {
        fontSize: 14,
        color: '#e5e7eb',
        marginTop: 6,
    },
    actions: {
        marginTop: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    switchItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        color: '#e5e7eb',
        fontSize: 14,
        marginRight: 8,
    },
});

export default DailyPrayers;
