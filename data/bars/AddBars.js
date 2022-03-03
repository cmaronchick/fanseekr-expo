// //ADD TO NEW COLLECTION WITH HASH
        // firestore().collection('bars').doc('WAS').collection('markers').get()
        //     .then(function (querySnapshot) {
        //         querySnapshot.forEach(function (doc) {
        //             _bars.push(doc.data());
        //         });

        //         _bars.forEach(function (bar, index) {
        //             geocollection.add({
        //                 ...bar,
        //                 // The coordinates field must be a GeoPoint!
        //                 coordinates: new firebase.firestore.GeoPoint(bar.coordinate.latitude, bar.coordinate.longitude)
        //             })
        //             //barArr.push({ ...bar, isFavTeam: isFavTeam });
        //         });



        //     })
        //     .catch(function (error) {
        //     });

        //USERS
        // firestore().collection('users2').get()
        // .then(function (querySnapshot) {
        //     var _users = [];
        //     querySnapshot.forEach(function (doc) {
        //         _users.push(doc.data());
        //     });
        //     console.log('users2', _users);
        //     _users.forEach(function (u, index) {
        //         var _loc = citiesList.find(x => x.id == u.location);
        //         console.log('user loc', _loc);
        //         if (_loc) {
        //             geocollection2.add({
        //                 ...u,
        //                 // The coordinates field must be a GeoPoint!
        //                 coordinates: new firebase.firestore.GeoPoint(_loc.coordinates.latitude, _loc.coordinates.longitude)
        //             })
        //         }
        //         //barArr.push({ ...bar, isFavTeam: isFavTeam });
        //     });



        // })
        // .catch(function (error) {
        // });