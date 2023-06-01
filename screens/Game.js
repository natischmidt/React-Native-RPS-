import React, {  useState } from "react";
import axios from 'axios';
import IP_URL from "../services/IP";
import { getData } from "./HomePage";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";

const MakeMove = async (token, gameContainer, sign) => {
    try {
        return fetch(IP_URL + `/games/move/${sign}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: await getData('token'),
            },
            body: JSON.stringify(gameContainer),
        })
            .then((response) => response.json())
            .then((data) => data);
    } catch (err) {
        console.log(err.message);
    }
};

const Game = () => {
    const [player, setPlayer] = useState('');
    const [opponent, setOpponent] = useState('');
    const [playerMove, setPlayerMove] = useState("");
    const [opponentMove, setOpponentMove] = useState("");
    const [result, setResult] = useState("");
    const [gameStatus, setGameStatus] = useState(null);



    const GameStatus = async () => {
        const gameid = await getData('gameid');
        try {
            const response = await axios.get(IP_URL + `/games/` + gameid);
            setGameStatus(response.data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleMove = async (sign) => {
        try {
            const gameid = await getData("gameid");
            const token = await getData("token");

            const response = await axios.get(IP_URL + `/games/` + gameid, {
                headers: {
                    token: token,
                },
            });
            const gameData = response.data;

            const gameContainer = {
                uuid: gameData.uuid,
                firstPlayer: gameData.firstPlayer,
                playerMove: null,
                secondPlayer: gameData.secondPlayer,
                opponentMove: null,
                gamestatus: gameData.gamestatus,
            };

            const moveResponse = await MakeMove(token, gameContainer, sign);
            console.log(moveResponse);

            setPlayerMove(moveResponse.playerMove);
            setOpponentMove(moveResponse.opponentMove);

            setResult(moveResponse.result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
                <TouchableOpacity onPress={() => handleMove("rock")}>
                    <Image source={require("../images/rock.png.bmp")} style={[styles.image, styles.choiceImage]}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMove("scissors")}>
                    <Image source={require("../images/scissor.png.bmp")} style={[styles.image, styles.choiceImage]}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMove("paper")}>
                    <Image source={require("../images/paper.png.bmp")} style={[styles.image, styles.choiceImage]}/>
                </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    choicesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    image: {},
    choiceImage: {
        marginTop: 50,
        width: 150,
        height: 180,
        resizeMode: 'contain',
    },

});

export default Game;
