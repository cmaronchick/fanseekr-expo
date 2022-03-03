
import firebase, { utils } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'


export const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export const getGeoCodeResponse = (address) => {
    if (!address || typeof address !== "string") {
        return {
            error: 500,
            error_message: 'Invalid Address'
        }
    }
    console.log('process.env.GEOCODE_API_KEY', process.env.GEOCODE_API_KEY)
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyADQwOAO9gOeIi5LukZmp_v5fl3J0wRWt4`)
    .then(geoCodeResponse => {
        return geoCodeResponse.json()
    })
    .then(geoCodeResponseJSON => {
        console.log('geoCodeResponseJSON', geoCodeResponseJSON);
        return geoCodeResponseJSON
    })
    .catch(geoCodeResponseError => {
        console.log('geoCodeResponseError', geoCodeResponseError)
        return {
            error_message: 'something went wrong'
        }
    })
}

export const uploadToFirebase = (img) => {
    const { mime, path, data } = img
    // get image name from path
    const pathArray = path.split('/')
    const imageName = pathArray[pathArray.length - 1]
    const mimeType = mime === 'image/jpeg' ? 'jpg' : mime === 'image/gif' ? 'gif' : mime === 'image/png' ? 'png' : null
    return new Promise((resolve, reject) => {
        if (mime === null) {
            return reject({ error: 'Image Type not supported'})
        }
        const uid = auth().currentUser.uid;
        const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/${imageName}`;
        // console.log(`pathToFile`, pathToFile)
          
        var storageRef = storage().ref(`images/chat/${imageName}`);
        
        storageRef.putFile(path).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                resolve(snapshot);
            },
            error => {
                reject(error);
            });
    });
}
