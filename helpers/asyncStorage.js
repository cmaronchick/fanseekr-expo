import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'


export async function _storeLocalItem(key, item) {
    try {
        var value = (typeof item === 'string' || item instanceof String) ? item : JSON.stringify(item);
        var jsonOfItem = await AsyncStorage.setItem(key, value);
        return jsonOfItem;
    } catch (error) {
        console.log(error.message);
    }
}

export async function _retrieveLocalItem(key) {
    try {
        const retrievedItem = await AsyncStorage.getItem(key);
        var item = (typeof retrievedItem === 'string' || retrievedItem instanceof String) ? retrievedItem : JSON.parse(retrievedItem);
        return item;
    } catch (error) {
        console.log(error.message);
    }
    return
}


export async function _getTeamsFromLocal() {
    try {
        const retrievedItem = await AsyncStorage.getItem("teams");
        if (retrievedItem) {
            return JSON.parse(retrievedItem);;
        } else {
            //get teams from Firebase
            var teamsArr = [];
            await firestore().collection('teams').get().then((teams) => {
                teams.forEach((e, i) => {
                    var newTeam = {
                        teamId: e.id,
                        name: e.data().name,
                        league: e.data().league,
                        api_id: e.data().api_id,
                        isSelected: false
                    };

                    teamsArr.push(newTeam);
                })
            })

            //store teams locally
            await AsyncStorage.setItem("teams", JSON.stringify(teamsArr));

            return teamsArr;
        }
    } catch (error) {
        console.log(error.message);
    }
    return
}
