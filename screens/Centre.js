import React, { useState, useEffect } from 'react';
import {
    StyleSheet, FlatList, Text, TouchableOpacity, View, Button, StatusBar,
} from "react-native";
import { Table, Row } from 'react-native-table-component';
import firebase from "firebase";
import auth from "../firebase/auth";
import 'firebase/storage'
import { Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Centre({ navigation }) {
    const [audioList, setAudioList] = useState([]);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.navigate("Login");
            })
            .catch((error) => alert(error.message));
    };

    useEffect(() => {
        // Get audio files from Firebase Storage
        const userID = firebase.auth().currentUser.uid;
        console.log("Current User: ", userID);
        firebase.storage().ref(`audio/${userID}/`).listAll().then((result) => {
            result.items.forEach((audioRef) => {
                // Get download URL for each audio file
                audioRef.getDownloadURL().then((url) => {
                    // Add audio file to the list
                    setAudioList((prevState) => [...prevState, { name: audioRef.name, url }]);
                });
            });
        });
    }, []);

    const playAudio = async (url) => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri: url });
            await soundObject.playAsync();
        } catch (error) {
            console.error(error);
        }
    };


    // const renderItem = ({ item }) => {
    //     return (
    //         <TouchableOpacity
    //             style={styles.audioItem}
    //             onPress={() => {
    //                 playAudio(item.url);
    //             }}
    //         >
    //             <MaterialCommunityIcons name="music" size={24} color="black" style={styles.audioIcon} />
    //             <Text style={styles.audioName}>{item.name}</Text>
    //         </TouchableOpacity>
    //     );
    // };



    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.itemContainer}>
                    <View style={styles.itemInfo}>
                        <MaterialCommunityIcons name="file-music" size={24} color="black" />
                        <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                    <View style={styles.itemButtons}>
                        <TouchableOpacity onPress={() => handleDelete(item.name)} style={styles.itemButton}>
                            <MaterialCommunityIcons name="delete" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => playAudio(item.url)} style={styles.itemButton}>
                            <MaterialCommunityIcons name="play-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList data={audioList} renderItem={renderItem} keyExtractor={(item) => item.name} />
            <TouchableOpacity onPress={handleSignOut} style={[styles.signOutButton]}>
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        marginLeft: 10,
        fontSize: 16,
    },
    itemButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemButton: {
        marginLeft: 20,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        width: '100%',
        marginTop: 10,
    },
    signOutButton: {
        backgroundColor: "#0782F9",
        width: "60%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 40,
        position: 'absolute',
        bottom: 100,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});
