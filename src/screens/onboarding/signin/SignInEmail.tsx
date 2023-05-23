import React, {useContext, useRef} from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from "@react-navigation/native";
import {OnboardingContext} from "../context/OnboardingContext";
import Toast from "react-native-toast-message";

const SignInEmail: React.FC<any> = ({navigation}) => {

    const onboardingContext = useContext(OnboardingContext);

    if (!onboardingContext)
        throw new Error('SignUpEmail must be rendered within an OnboardingContext.Provider');

    const { onboardedUser, setOnboardedUser } = onboardingContext;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const viewRef = useRef<Animatable.View & View>(null);

    useFocusEffect(
        React.useCallback(() => {
            viewRef!.current!.fadeIn!(500);
        }, [])
    );

    return (
        <Animatable.View ref={viewRef} animation="fadeIn" className={"flex flex-grow bg-white"}>
            <ScrollView className={"h-screen flex flex-grow mx-5"} stickyHeaderIndices={[0]}>
                <TouchableOpacity onPress={() => navigation.goBack()} className={"mt-5 flex flex-row justify-center items-center w-10 h-10 bg-gray-200 rounded-full"}>
                    <View className={"font-extra_bold"}>
                        <FontAwesomeIcon size={14} icon={faChevronLeft}/>
                    </View>
                </TouchableOpacity>
                <Text className="mt-10 font-bold text-4xl">
                    Enter your email
                </Text>
                <Text className="mt-10 font-medium text-2xl text-gray-400">
                    Welcome back! 👋
                </Text>
                <TextInput
                    className={"mt-10 text-xl font-medium"}
                    onChangeText={(text) => setOnboardedUser({
                        ...onboardedUser,
                        email: text
                    })}
                    value={onboardedUser.email}
                    placeholder="Email"
                />
                <View className={"mt-10 w-full flex flex-row justify-center items-center"}>
                    <TouchableOpacity className={"flex flex-row items-center justify-center w-48 h-14 rounded-xl bg-[#FC4C02]"} onPress={() => {
                        const isValidEmail = emailRegex.test(onboardedUser.email);

                        if(!isValidEmail) {
                            Toast.show({
                                type: 'error',
                                text1: 'Invalid email',
                                text2: 'The email provided is incorrect!'
                            });
                            Vibration.vibrate();
                            return;
                        }

                        navigation.push("SignInPassword")
                    }}>
                        <Text className="font-bold text-xl text-white">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default SignInEmail;
