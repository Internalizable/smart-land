import React, {useContext} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {faHome, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import HomeNavigator from "./home/HomeNavigator";
import LogoutEmptyComponent from "./LogoutEmptyComponent";
import {UserContext} from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC<any> = () => {

    const userContext = useContext(UserContext);
    const { user, setUser } = userContext;


    return (
        <Tab.Navigator initialRouteName={"Home"} screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: { height: 52 },
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused, color, size }) => {

                let icon = faHome;

                if (route.name === 'Logout') {
                    icon = faSignOut
                }

                return <FontAwesomeIcon color={focused ? '' : 'gray'} size={25} icon={icon}/>
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
        })} >
            <Tab.Screen name="Home" component={HomeNavigator}/>
            <Tab.Screen name="Logout" component={LogoutEmptyComponent} listeners={{
                tabPress: async e => {
                    e.preventDefault();

                    return Alert.alert(   // Shows up the alert without redirecting anywhere
                        'Sign out?'
                        ,'Do you really want to sign out?'
                        ,[
                            {text: 'Cancel'},
                            {text: 'Accept', onPress: async () => {
                                    setUser(null)
                                    await AsyncStorage.removeItem("@user_login");
                                }},
                        ]
                    );

                },
            }}/>
        </Tab.Navigator>
    );
}

export default MainNavigator;
