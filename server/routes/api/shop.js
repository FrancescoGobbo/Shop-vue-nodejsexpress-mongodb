const express = require ('express');
const mongodb = require ('mongodb').MongoClient;
const objectId = require ('mongodb').ObjectID;
const assert = require ('assert');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

var url = 'mongodb://localhost:27017/atroossb';

//GET Post
router.get('/', (req, res) => {
    mongodb.connect(url, function(err, db) {
        console.log("Connected");
    })
    res.json('index');
});

//Get utente
router.get('/user', (req, res) => {
    var utente =[];
    mongodb.connect(url, function(err, db){
        assert.strictEqual(null, err);
        var cursor = db.collection('users').find();
        cursor.forEach(function(doc, err) {
            assert.strictEqual(undefined, err);
            utente.push(doc);
        }, function(){
            db.close();
            res.json({items: utente});
        });
    });
});
//Get articles
router.get('/articles', (req, res) => {
    var articoli = [];
    mongodb.connect(url, function(err, db){
        assert.strictEqual(null, err);
        var cursor = db.collection('articles').find();
        cursor.forEach(function(doc, err) {
            assert.strictEqual(undefined, err);
            articoli.push(doc);
        }, function(){
            db.close();
            res.json({items: articoli});
        });
    });
});
//Get order
router.get('/orders', (req, res) => {
    var ordini = [];
    mongodb.connect(url, function(err, db){
        assert.strictEqual(null, err);
        var cursor = db.collection('orders').find();
        cursor.forEach(function(doc, err) {
            assert.strictEqual(undefined, err);
            ordini.push(doc);
        }, function(){
            db.close();
            res.json({items: ordini});
        });
    });
});

//Update order
router.post('/uporders', async(req, res) => {
    const collection = await loadCollection('orders');
    var it = req.body.items;
    console.log(it);
    //updateOne don't work
    await collection.updateOne(
        {   "_id": ObjectId(it._id) }, 
        {
            $set: {"articles": it.articles},
            $set: {"status": it.status}
         }
    );
});

//Update Aricles
router.post('/uparticles', async (req, res) => {
    
    const collection = await loadCollection('articles');
    for(var i=0; i<req.body.items.length; i++){
        var art = req.body.items[i];
        await collection.updateOne(
            { "_id": ObjectId(art._id)},
            {
                $set: {"available_quantity": art.available_quantity}
            },
        );
    }

});

async function loadCollection(c) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, function(err,db) {
          if (err) {
            reject(err);
          }
  
          resolve(db.collection(c));
      });
    })
  }

module.exports = router;
