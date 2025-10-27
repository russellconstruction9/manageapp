import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useDataContext';
import { BellIcon } from './icons/Icons';

const PWAFeatures: React.FC = () => {
    const { currentUser, setCurrentLocation } = useData();
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Effect to check current subscription status on load
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.getSubscription().then(sub => {
                    if (sub) {
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, []);

    // Effect for active GPS tracking
    useEffect(() => {
        let watchId: number | null = null;

        if (currentUser?.isClockedIn) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error watching position:", error);
                    setCurrentLocation(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            setCurrentLocation(null);
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [currentUser?.isClockedIn, setCurrentLocation]);

    const handleNotificationSubscribe = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert("Push Notifications are not supported in this browser.");
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                // VAPID public key should be securely generated and stored
                applicationServerKey: 'BPEj9_qW-VEw5A0p-R8v1_4Dq3uL-8h3LpX77-T-y_jT_t_T-qY_j_j_q-q-T_t', 
            });

            console.log('Push subscription:', subscription);
            // In a real app, you would send this subscription object to your server
            // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(subscription), ... });
            setIsSubscribed(true);
        }
    };

    const getIconColor = () => {
        if (notificationPermission === 'denied') return 'text-red-500';
        if (isSubscribed) return 'text-green-500';
        return 'text-gray-500 hover:text-gray-700';
    }

    return (
        <button
            onClick={handleNotificationSubscribe}
            disabled={notificationPermission === 'denied' || isSubscribed}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getIconColor()}`}
            title={
                notificationPermission === 'denied' ? 'Notifications Blocked' :
                isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'
            }
        >
            <BellIcon className="w-6 h-6" />
        </button>
    );
};

export default PWAFeatures;
