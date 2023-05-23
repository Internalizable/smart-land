import React, {useRef} from "react";
import {Alert, Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHome, faMagnifyingGlass, faUser, faWallet} from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import {SvgUri} from "react-native-svg";
import FastImage from "react-native-fast-image";
import * as Animatable from 'react-native-animatable';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import { Dimensions } from 'react-native';

const WelcomeScreen: React.FC<any> = ({navigation}) => {

    const viewRef = useRef<Animatable.View & View>(null);

    useFocusEffect(
        React.useCallback(() => {
            viewRef!.current!.fadeIn!(500);
        }, [])
    );

    return (
        <Animatable.View ref={viewRef} animation="fadeIn" className={"flex flex-row h-screen w-screen bg-white"}>
            <View className="absolute w-screen h-screen flex flex-col justify-center items-center">
                <Image
                    source={require('../../../assets/images/ic_welcome.png')}
                    style={tw`absolute z-10 w-[100%] h-[50%] top-[1%]`}
                />
                <View className={"absolute w-80 h-80 rounded-full bg-green-200 z-5 -top-[5%] -right-[56%]"}>
                </View>
                <View className={"absolute w-80 h-80 rounded-full bg-lime-100 z-5 top-[16.5%] -left-[62%]"}>
                </View>
                <View className={"absolute flex flex-col top-[60%] justify-between items-center"}>
                    <Text className={"font-extrabold text-4xl"}>Check on your 🌱</Text>
                    <Text className={"font-extrabold text-4xl"}>everywhere.</Text>

                    <TouchableOpacity className={"my-8 flex flex-row bg-gray-100 rounded-xl w-64 h-12 items-center px-3"} onPress={() => navigation.push("SignUpEmail")}>
                        <Image
                            source={require('../../../assets/images/ic_email.png')}
                            style={tw`w-7 h-7`}
                        />
                        <Text className={"pl-7 text-xl font-medium text-[#9EB100]"}>
                            Sign up with email
                        </Text>
                    </TouchableOpacity>

                    <View className={"flex flex-row"}>
                        <Text className={"font-medium text-base"}>Already have an account?</Text>
                        <Text className={"px-1 font-medium text-base text-[#9EB100] underline"} onPress={() => navigation.push("SignInEmail")}>Sign in</Text>
                    </View>
                </View>

                <Text className={"absolute font-regular text-xs bottom-[2.5%] left-[5%] w-80 text-gray-400"}>By tapping Sign in and using SmartLand you agree to our Terms and Privacy Policy.</Text>
            </View>
        </Animatable.View>
    );
};

export default WelcomeScreen;
