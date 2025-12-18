import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DailyPrayers from '../screens/DailyPrayers';
import Reports from '../screens/Reports';
import CalenderView from '../screens/CalenderView';
import PrayersTimming from '../screens/PrayersTimming';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {

    const currentDate = new Date().toISOString().split('T')[0];
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopColor: '#020617',
                    height: 65,
                },

                tabBarActiveTintColor: '#38bdf8',
                tabBarInactiveTintColor: '#94a3b8',

                tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 4,
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'DailyPrayers':
                            iconName = focused ? 'book' : 'book-outline';
                            break;
                        case 'Reports':
                            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                            break;
                        case 'CalenderView':
                            iconName = focused ? 'calendar' : 'calendar-outline';
                            break;
                        case 'PrayersTimmings':
                            iconName = focused ? 'time' : 'time-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="DailyPrayers"
                component={DailyPrayers}
                options={{ tabBarLabel: 'Daily Prayers' }}
                initialParams={{ selectedDate: currentDate }}
            />


            <Tab.Screen
                name="PrayersTimmings"
                component={PrayersTimming}
                options={{ tabBarLabel: 'Timings' }}
            />

            <Tab.Screen
                name="CalenderView"
                component={CalenderView}
                options={{ tabBarLabel: 'Calendar' }}
            />

            <Tab.Screen
                name="Reports"
                component={Reports}
                options={{ tabBarLabel: 'Reports' }}
            />
        </Tab.Navigator>
    );
}
