import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { getAddressFromCoordinates, getPrayerTimings } from '../utils/Api';

export default function PrayersTimming() {
    const [prayerTimingsResponse, setPrayerTimingsResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        (async () => {
            try {
                let locationCoords = { latitude: 33.7685, longitude: 72.3606 }; 

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    try {
                        let currentLocation = await Location.getCurrentPositionAsync({});
                        locationCoords = currentLocation.coords;
                    } catch (locError) {
                        console.warn('Unable to get current location, using default Attock coordinates.', locError);
                    }
                } else {
                    console.warn('Location permission denied, using default Attock coordinates.');
                }

                const address = await getAddressFromCoordinates(locationCoords.latitude, locationCoords.longitude);
                const apiResp = await getPrayerTimings(address, currentDate);

                setPrayerTimingsResponse({ apiResp, address });
            } catch (error) {
                setErrorMsg('Something went wrong while fetching prayer timings.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const getPrayerTimingsList = () => {
        if (!prayerTimingsResponse || !prayerTimingsResponse.apiResp) return [];
        const timings = prayerTimingsResponse.apiResp.data.timings;
        return Object.keys(timings).map(key => ({ name: key, time: timings[key] }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Prayers Timming</Text>
            </View>

            <Text style={styles.dateText}>Date: {currentDate}</Text>

            <Text style={styles.addressText}>
                {prayerTimingsResponse
                    ? `Address: ${prayerTimingsResponse.address}`
                    : 'Fetching your current location...'}
            </Text>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#38bdf8" />
                    <Text style={styles.loadingText}>Loading prayer timings...</Text>
                </View>
            )}

            {!loading && errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {!loading && prayerTimingsResponse && prayerTimingsResponse.apiResp && (
                <FlatList
                    data={getPrayerTimingsList()}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <View style={styles.prayerItem}>
                            <Text style={styles.prayerName}>{item.name}</Text>
                            <Text style={styles.prayerTime}>{item.time}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#020617',
    },
    headerContainer: {
        marginVertical: 32,
        alignItems: 'center',
    },
    headerText: {
        color: '#e5e7eb',
        fontSize: 28,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 16,
        color: '#e5e7eb',
        marginBottom: 4,
        fontWeight: '600',
    },
    addressText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#38bdf8',
        fontWeight: '600',
    },
    prayerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#0f172a',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 2,
        width: '100%',
    },
    prayerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#38bdf8',
    },
    prayerTime: {
        fontSize: 16,
        color: '#e5e7eb',
    },
    errorText: {
        marginTop: 20,
        fontSize: 14,
        color: '#f87171',
        fontWeight: '600',
        textAlign: 'center',
    },
});
