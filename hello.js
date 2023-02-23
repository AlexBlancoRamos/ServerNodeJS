const cors = require('cors');
const express = require('express');
const app= express()


//var admin = require("firebase-admin");

// var serviceAccount = require("../projecte-botiga-firebase-adminsdk-uc4li-f20664a256.json);
// const {getFirestore} = require("firebase-admin/firestore");
//
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
//
// const db = getFirestore();


app.use(express.json());


app.use(cors());

port = 4200;

app.listen(port,() => {
    console.log('Server listening on the port ::'+ port);
});

app.get('/api/client', async(req,res) =>{
    const clients = {name:"Alex", mail:"blanco@gmail.com"}
    res.json(clients)



    // const cityRef = db.collection('gerardValldosera').doc('Tq1Gf0P7oNns96jyraxV');
    // const doc = await cityRef.get();
    // if (!doc.exists) {
    //     console.log('No such document!');
    // } else {
    //     console.log('Document data:', doc.data());
    // }
    // res.json(doc.data())
});