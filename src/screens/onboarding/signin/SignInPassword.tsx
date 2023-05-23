import React, {useContext, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert, Dimensions,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faHome,
    faMagnifyingGlass,
    faUser,
    faWallet
} from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import {SvgUri} from "react-native-svg";
import FastImage from "react-native-fast-image";
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import {User, UserContext} from "../../../context/UserContext";
import {OnboardingContext} from "../context/OnboardingContext";
import Toast from "react-native-toast-message";
import {UserService} from "../../../services/UserService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpPassword: React.FC<any> = ({navigation}) => {

    const [loading, setLoading] = useState<boolean>(false);

    const onboardingContext = useContext(OnboardingContext);
    const userContext = useContext(UserContext);

    if (!onboardingContext)
        throw new Error('SignUpEmail must be rendered within an OnboardingContext.Provider');

    const { onboardedUser, setOnboardedUser } = onboardingContext;
    const { user, setUser } = userContext;

    const viewRef = useRef<Animatable.View & View>(null);

    useFocusEffect(
        React.useCallback(() => {
            viewRef!.current!.fadeIn!(500);
        }, [])
    );

    return (
        <Animatable.View ref={viewRef} animation="fadeIn" className={"flex flex-grow bg-white"}>
            <ScrollView className={"h-screen flex flex-grow mx-5"} stickyHeaderIndices={[0]}>
                <TouchableOpacity onPress={() => navigation.goBack()} className={"flex flex-row justify-center items-center w-10 h-10 bg-gray-200 rounded-full"}>
                    <View className={"font-extra_bold"}>
                        <FontAwesomeIcon size={14} icon={faChevronLeft}/>
                    </View>
                </TouchableOpacity>
                <Text className="mt-10 font-bold text-4xl">
                    Enter your password
                </Text>
                <Text className="mt-10 font-medium text-2xl text-gray-400">
                    Let's sign you back in! Please enter your password
                </Text>
                <TextInput
                    className={"mt-10 text-xl font-medium"}
                    onChangeText={(text) => setOnboardedUser({
                        ...onboardedUser,
                        password: text
                    })}
                    value={onboardedUser.password}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <View className={"mt-10 w-full flex flex-row justify-center items-center"}>
                    <TouchableOpacity disabled={loading} className={"flex flex-row items-center justify-center w-48 h-14 rounded-xl bg-[#FC4C02]"} onPress={async () => {
                        if (onboardedUser.password.length < 5) {
                            Toast.show({
                                type: 'error',
                                text1: 'Invalid password',
                                text2: 'Your password should be at least 5 characters long!'
                            });
                            return;
                        }

                        setLoading(true)

                        UserService.login(onboardedUser).then(async res => {
                            const details = {
                                email: res.user.email,
                                id: res.user.id,
                                admin: res.user.admin,
                                access_token: res.access_token
                            }

                            await AsyncStorage.setItem('@user_login', JSON.stringify(details))
                            setUser(details as User)
                            setLoading(false)
                        }).catch((exp) => {
                            Toast.show({
                                type: 'error',
                                text1: 'Invalid login',
                                text2: 'The login details you provided are invalid!'
                            });

                            setLoading(false)
                        })
                    }}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text className="font-bold text-xl text-white">Next</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </Animatable.View>
    );
};

export default SignUpPassword;
