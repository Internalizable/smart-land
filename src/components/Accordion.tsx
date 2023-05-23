import React, {ReactNode, useState} from "react";
import {LayoutAnimation, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faChevronDown, faChevronRight, faChevronUp, faUser} from "@fortawesome/free-solid-svg-icons";

interface AccordionProps {
    title: string;
    children: ReactNode;
}

const Accordion = ({ title, children }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(value => !value);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    return (
        <>
            <TouchableOpacity onPress={toggleOpen} className={"mt-5 flex flex-row w-10/12 justify-between items-center"} activeOpacity={0.6}>
                <View className={"flex flex-row justify-center items-center w-11 h-11 bg-yellow-600 rounded-full"}>
                    <FontAwesomeIcon color={"white"} size={20} icon={faUser}/>
                </View>
                <View className={"flex flex-row w-[67%]"}>
                    <Text className={"font-medium text-xl"}>
                        {title}
                    </Text>
                </View>
                <View className={"flex flex-row justify-center items-center w-6 h-6 bg-gray-200 rounded-full"}>
                    <View className={"font-extra_bold"}>
                        <FontAwesomeIcon size={12}  icon={isOpen ? faChevronUp : faChevronDown}/>
                    </View>
                </View>
            </TouchableOpacity>

            <View className={`overflow-hidden ${!isOpen ? 'h-0' : ''}`}>
                {children}
            </View>
        </>
    );
};

export default Accordion;
