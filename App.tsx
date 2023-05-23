import {StatusBar} from 'expo-status-bar';
import {Dimensions, Text, View} from 'react-native';
import {faX} from "@fortawesome/free-solid-svg-icons";
import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import React, {useCallback, useEffect, useState} from "react";
import * as SplashScreen from 'expo-splash-screen';
import {ActiveScreen} from "./src/utils/ActiveScreen";
import {NavigationContainer} from '@react-navigation/native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import OnboardingNavigator from "./src/screens/onboarding/OnboardingNavigator";
import MainNavigator from "./src/screens/MainNavigator";
import {User, UserContext} from './src/context/UserContext';
import Toast from 'react-native-toast-message';
import {ToastConfig} from "react-native-toast-message/lib/src/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    bold: require('./assets/fonts/bold.ttf'),
                    extra_bold: require('./assets/fonts/extra_bold.ttf'),
                    light: require('./assets/fonts/light.ttf'),
                    medium: require('./assets/fonts/medium.ttf'),
                    regular: require('./assets/fonts/regular.ttf'),
                    semi_bold:  require('./assets/fonts/semi_bold.ttf'),
                });

                const storage_user = await AsyncStorage.getItem("@user_login")

                if(storage_user)
                    setUser(JSON.parse(storage_user));

                setAppIsReady(true)
            } catch (e) {
                console.warn(e);
            }
        }

        prepare();
    }, []);

    const hideSplashScreen = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    useEffect(() => {
        hideSplashScreen();
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    const toastConfig: ToastConfig = {
        error: ({ text1, text2, hide, props}) => {
            return (<View className={"flex flex-row w-full h-24 bg-[#d0342c] items-center justify-center"}>
                <View className={"flex flex-row w-9/12 justify-between items-center"}>
                    <FontAwesomeIcon icon={faX} size={24} color={"white"}/>

                    <View className={"flex flex-col w-9/12"}>
                        <Text className={"text-xl font-regular text-white"}>{text1}</Text>
                        <Text className={"font-regular text-white"}>{text2}</Text>
                    </View>
                </View>
            </View>)
        }
    };

    return (
        <UserContext.Provider value={{user, setUser}}>
            <NavigationContainer>
                {user !== null ? <MainNavigator /> : <OnboardingNavigator />}
            </NavigationContainer>
            <Toast config={toastConfig} topOffset={0}/>
        </UserContext.Provider>
    );
}
