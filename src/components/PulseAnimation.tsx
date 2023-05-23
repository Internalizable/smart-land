import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const PulseLoading = () => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: false }),
                Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                width: 48,
                height: 48,
                backgroundColor: '#E5E7EB',
                borderRadius: 24,
                opacity,
            }}
        />
    );
};

export default PulseLoading;
