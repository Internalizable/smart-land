import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./HomeScreen";

const HomeStack = createStackNavigator();

const HomeNavigator: React.FC<any> = ({navigation}) => {

    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Welcome"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
        </HomeStack.Navigator>
    );
}

export default HomeNavigator;
