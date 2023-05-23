import React, {useContext, useEffect, useRef, useState} from "react";
import {
    Animated, FlatList,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import FastImage from "react-native-fast-image";
import {useFocusEffect} from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import {LinearGradient} from "expo-linear-gradient";
import {LineChart} from "react-native-chart-kit";

import { Dimensions } from "react-native";
import {PlantDataDTO, PlantDTO} from "../../services/dto/PlantDTO";
import {PlantService} from "../../services/PlantService";
import {UserContext} from "../../context/UserContext";
import Toast from "react-native-toast-message";
import useWebSocket from "react-use-websocket";
import moment from "moment";
const screenWidth = Dimensions.get("window").width;

interface SocketData {
    temperature: number,
    light: number,
    moisture: number,
    humidity: number
}

interface SocketState {
    id: string,
    online: boolean,
    state: boolean,
}

const HomeScreen: React.FC<any> = ({navigation}) => {
    const viewRef = useRef<Animatable.View & View>(null);
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

    const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState(false);
    const [modalTop, setModalTop] = useState(0);
    const inputRef = useRef<View | null>(null);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [loading, setLoading] = useState<boolean>(false);
    const [allPlants, setAllPlants] = useState<PlantDTO[]>([]);
    const [currentPlant, setCurrentPlant] = useState<PlantDTO>();
    const [searchText, setSearchText] = useState<string>("");

    const [tempData, setTempData] = useState<any>(null);
    const [moistureData, setMoistureData] = useState<any>(null);
    const [humidityData, setHumidityData] = useState<any>(null);
    const [lightData, setLightData] = useState<any>(null);

    const prevActivePlantId = useRef<string | null>(null);

    const userContext = useContext(UserContext);
    const { user } = userContext;

    const {sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket} = useWebSocket(currentPlant ?
        `ws://34.165.1.243:8000/plants/listen/${currentPlant.id}?token=${user?.access_token}${prevActivePlantId.current == null ? '&isFirst=true' : ''}` : null, {
        onOpen: () => console.log(`Opened a connection to 34.165.1.243:8000/plants/listen/${currentPlant?.id}?token=${user?.access_token}`),
        onClose: () => console.log("Closed the connection"),
        shouldReconnect: (closeEvent) => true,
    });


    const renderItem = ({ item }: { item: PlantDTO }) => (
        <View className={"flex flex-row w-full my-2 justify-between items-center"}>
            <View className={"w-1/5"}></View>
            <TouchableOpacity onPress={() => {
                setSearchOpen(false)
                setCurrentPlant(item)
            }}
                              className={"flex flex-row w-4/5 justify-start items-center"}>
                <Text>🔴</Text>
                <Text className={"pl-4 text-base font-semi_bold text-black"}>{item.name}</Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // Prevent default behavior
            e.preventDefault();

            console.log(e);
            console.log(JSON.stringify(e));

            // Do something manually
            // ...
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (isSearchOpen) {
            setIsVisible(true);
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
        } else {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start(() => {
                // This callback will be executed after the animation has finished
                setIsVisible(false);
            });
        }
    }, [isSearchOpen]);


    useFocusEffect(
        React.useCallback(() => {
            viewRef!.current!.fadeIn!(500);
        }, [])
    );

    const fetchPlantData = async () => {
        try {
            const response: PlantDTO = await PlantService.getPlant(user?.access_token, currentPlant!.id, 10);
            setCurrentPlant(response)

            const labels = response.temperatures.map((tempData: PlantDataDTO) => {
                const utcDate = moment.utc(tempData.timestamp);
                const localDate = utcDate.local();

                return localDate.format('DD/MM/YYYY HH:mm:ss');
            });

            setTempData({
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature Data',
                        data: response.temperatures.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ]
            })

            setHumidityData({
                labels: labels,
                datasets: [
                    {
                        label: 'Humidity Data',
                        data: response.humidities.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(144, 25, 103)',
                        backgroundColor: 'rgba(144, 25, 103, 0.5)',
                    },
                ]
            })

            setMoistureData({
                labels: labels,
                datasets: [
                    {
                        label: 'Moisture Data',
                        data: response.moistures.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(31, 22, 193)',
                        backgroundColor: 'rgba(31, 22, 193, 0.5)',
                    },
                ]
            })

            setLightData({
                labels: labels,
                datasets: [
                    {
                        label: 'Light Data',
                        data: response.light_values.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(31, 199, 21)',
                        backgroundColor: 'rgba(31, 199, 21, 0.5)',
                    },
                ]
            })

            setLoading(false);
        } catch (err: any) {
            console.log(err);
        }
    }


    useEffect(() => {
        PlantService.fetchPlants(user?.access_token).then((res) => {
            setAllPlants(res);
            setCurrentPlant(res[0])
        }).catch(() => {
            Toast.show({
                type: 'error',
                text1: 'Plant fetching error',
                text2: 'An error occurred whilst fetching the plants'
            });
        })
    }, [])

    useEffect(() => {
        if(currentPlant && currentPlant.id !== prevActivePlantId.current) {
            if(getWebSocket() && !getWebSocket()?.url.endsWith("isFirst=true")) {
                getWebSocket()?.close();
            }

            console.log("called")
            setLoading(true)
            fetchPlantData().then(() => {
                console.log("Successfully fetched plant data")
                prevActivePlantId.current = currentPlant.id;
            }).finally(() => setLoading(false))
        }
    }, [currentPlant])

    useEffect(() => {
        if(lastJsonMessage) {
            let data = lastJsonMessage as any;

            console.log(JSON.stringify(data))
            if(data.type == "state") {
                data = (data.payload) as SocketState;

                if(data.id == currentPlant?.id)
                    setCurrentPlant({
                        ...currentPlant as PlantDTO,
                        online: data.online,
                        state: data.state
                    })

                console.log("Setting plan options to updated array")

                console.log(allPlants.map((plant) => {

                        if(plant.id == data.id) {
                            console.log("EQ")
                            plant.online = data.online
                            plant.state = data.state
                        }

                        return plant
                    })
                )

                setAllPlants(allPlants.map((plant) => {

                    if(plant.id == data.id) {
                        plant.online = data.online
                        plant.state = data.state
                    }

                    return plant
                }))

                return;
            }

            data = (data.payload) as SocketData;

            let newLabels = tempData.labels as Array<string>

            if(newLabels.length > 10)
                newLabels.shift();

            newLabels.push(new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }));

            /** Temp **/

            let newTempDataSets = tempData.datasets as Array<any>
            newTempDataSets.forEach(set => {
                if(set.data.length > 10)
                    set.data.shift()

                set.data.push(data.temperature)
            })

            console.log(newTempDataSets)
            setTempData({
                labels: newLabels,
                datasets: newTempDataSets
            })

            /** Humidity **/

            let newHumidityDataSets = humidityData.datasets as Array<any>
            newHumidityDataSets.forEach(set => {
                if(set.data.length > 10)
                    set.data.shift()

                set.data.push(data.humidity)
            })

            setHumidityData({
                labels: newLabels,
                datasets: newHumidityDataSets
            })

            /** Moisture **/

            let newMoistureDataSets = moistureData.datasets as Array<any>
            newMoistureDataSets.forEach(set => {
                if(set.data.length > 10)
                    set.data.shift()

                set.data.push(data.moisture)
            })

            setMoistureData({
                labels: newLabels,
                datasets: newMoistureDataSets
            })


            /** Light **/

            let newLightDataSets = lightData.datasets as Array<any>
            newLightDataSets.forEach(set => {
                if(set.data.length > 10)
                    set.data.shift()

                set.data.push(data.light)
            })

            setLightData({
                labels: newLabels,
                datasets: newLightDataSets
            })
        }
    }, [lastJsonMessage]);


    const chartConfig = {
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#FFFFFF",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 5, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(0, 197, 94, ${opacity})`,
                strokeWidth: 5
            }
        ],
    };

    return (
        <Animatable.View ref={viewRef} animation="fadeIn" className={"flex flex-grow"}>
            <ScrollView className={"h-screen flex flex-grow bg-white"} stickyHeaderIndices={[0]} onScroll={() => setSearchOpen(false)}>
                <View className="sticky flex-row items-center justify-start bg-white w-full h-28 z-30">
                    <Text className="ml-7 mt-5 font-extrabold text-4xl">
                        Your Plants
                    </Text>
                </View>

                <View ref={inputRef} onLayout={(event) => {
                    const layout = event.nativeEvent.layout;

                    console.log(layout.y + layout.height)
                    setModalTop(layout.y + layout.height);
                }} className={`mt-5 ml-7 flex flex-row w-10/12 h-14 bg-[#f9f7f7] ${isSearchOpen ? 'rounded-t-3xl' : 'rounded-3xl'} items-center justify-between`}>
                    <View className={"w-1/5"}>
                        <FontAwesomeIcon size={20} style={tw`ml-5`} icon={faMagnifyingGlass}/>
                    </View>
                    <View className={"w-4/5"}>
                        <TextInput placeholder={"Search for a plant"} className={"text-base font-bold"}
                                   value={searchText}
                                   onChangeText={text => setSearchText(text)}
                                   onFocus={() => {
                                       setSearchOpen(true)
                                   }}
                        />
                    </View>
                </View>

                <View className={"ml-7 mt-5 w-10/12 h-48 rounded-xl bg-[#C1E4D7] flex flex-row flex-shrink-0 items-center justify-center"}>
                    <View className={"flex flex-row w-10/12 h-full items-center justify-between"}>
                        <View className={"flex flex-col w-[60%] h-full items-start justify-between"}>
                            <View className={"flex flex-col h-[55%] items-start justify-end"}>
                                <Text className={"text-2xl font-semi_bold"}>Selected plant:</Text>
                                <Text className={"text-2xl font-semi_bold"}>{currentPlant?.name}</Text>
                            </View>

                            <View className={"flex flex-col h-[45%] items-start justify-center"}>
                                <Text className={"text-sm font-semi_bold text-gray-500"}>Current State:</Text>
                                <Text className={"text-sm font-semi_bold"}>{currentPlant?.online ? currentPlant.state ? "🔵 (WATERING)" : "🟡 (IDLE)" : "🔴 (OFF)"}</Text>
                            </View>
                        </View>
                        <Image
                            source={require('../../../assets/images/plant_pot.png')}
                            style={tw`ml-2 w-30 h-30`}
                        />
                    </View>
                </View>

                <View className={"mt-7 w-full h-[20rem] flex flex-col items-start justify-between"}>
                    <Text className="ml-7 font-bold text-2xl mb-7">
                        🌡️ Temperature
                    </Text>

                    {
                        tempData ?
                            tempData.labels.length > 0 ?
                                <LineChart
                                    data={tempData}
                                    width={screenWidth}
                                    height={380}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                                :
                                <Text className={"ml-7 font-regular text-lg"}>No data available yet to plot.</Text>
                            :
                            <View className={"ml-7 w-10/12 items-center justify-start"}>
                                <ShimmerPlaceholder shimmerStyle={{
                                    width: "100%",
                                    height: 260,
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 24
                                }}/>
                            </View>
                    }

                </View>
                <View className={"mt-7 w-full h-[20rem] flex flex-col items-start justify-between"}>
                    <Text className="ml-7 font-bold text-2xl mb-7">
                        💨 Humidity
                    </Text>

                    {
                        humidityData ?
                            humidityData.labels.length > 0 ?
                                <LineChart
                                    data={humidityData}
                                    width={screenWidth}
                                    height={380}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                                :
                                <Text className={"ml-7 font-regular text-lg"}>No data available yet to plot.</Text>
                            :
                            <View className={"ml-7 w-10/12 items-center justify-start"}>
                                <ShimmerPlaceholder shimmerStyle={{
                                    width: "100%",
                                    height: 260,
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 24
                                }}/>
                            </View>
                    }
                </View>
                <View className={"mt-7 w-full h-[20rem] flex flex-col items-start justify-between"}>
                    <Text className="ml-7 font-bold text-2xl mb-7">
                        💦 Moisture
                    </Text>

                    {
                        moistureData ?
                            moistureData.labels.length > 0 ?
                                <LineChart
                                    data={moistureData}
                                    width={screenWidth}
                                    height={380}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                                :
                                <Text className={"ml-7 font-regular text-lg"}>No data available yet to plot.</Text>
                            :
                            <View className={"ml-7 w-10/12 items-center justify-start"}>
                                <ShimmerPlaceholder shimmerStyle={{
                                    width: "100%",
                                    height: 260,
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 24
                                }}/>
                            </View>
                    }
                </View>
                <View className={"mt-7 w-full h-[20rem] flex flex-col items-start justify-between"}>
                    <Text className="ml-7 font-bold text-2xl mb-7">
                        💡 Light
                    </Text>

                    {
                        lightData ?
                            lightData.labels.length > 0 ?
                                <LineChart
                                    data={lightData}
                                    width={screenWidth}
                                    height={380}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                                :
                                <Text className={"ml-7 font-regular text-lg"}>No data available yet to plot.</Text>
                            :
                            <View className={"ml-7 w-10/12 items-center justify-start"}>
                                <ShimmerPlaceholder shimmerStyle={{
                                    width: "100%",
                                    height: 260,
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 24
                                }}/>
                            </View>
                    }

                </View>
                <View className={"mt-7 w-full h-14 flex flex-col items-start justify-between"}>

                </View>
            </ScrollView>

            {isVisible && (
                <Animated.View style={{position: "absolute", top: modalTop, opacity: fadeAnim}}
                               className={`flex flex-col w-10/12 max-h-48 bg-[#f9f7f7] justify-center rounded-b-3xl ml-7 z-20`}>
                    <FlatList
                        data={allPlants.filter(plant =>
                            plant.name.toLowerCase().startsWith(searchText.toLowerCase())
                        )}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `list-item-${index}`}
                        ListEmptyComponent={() => (
                            <View className={"flex flex-row w-full my-3 justify-between items-center"}>
                                <View className={"w-1/5"}></View>
                                <View className={"flex flex-row w-4/5 justify-start items-center"}>
                                    <Image
                                        source={require('../../../assets/images/remove.png')}
                                        style={{width: 28, height: 28}}
                                    />
                                    <Text className={"pl-4 text-base font-semi_bold text-black"}>No plant found</Text>
                                </View>
                            </View>

                        )}
                    />
                </Animated.View>
            )}
        </Animatable.View>
    );
};

export default HomeScreen;
