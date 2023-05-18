const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fppyswv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});


//GET multiple data
const  getMultipleData =async (collectionName) => {
  //collectionName = send the collection name 
  const cursor =await collectionName.find({});
  const data = await cursor.toArray();
  return data
}


//GET single data
const getSingleData = async (collectionName,query,options={}) =>{
  /*
    query = data(obj) you want to find
    options = optional parameter and by default it is empty
    example ->   const options = {
            _sort matched documents in descending order by rating
                sort: { "imdb.rating": -1 },
            _Include only the `title` and `imdb` fields in the returned document
                projection: { _id: 0, title: 1, imdb: 1 },
                      };
  */
  return data = await collectionName.findOne(query, options);
}


  //POST insert single data
  const insertSingleData = async (collectionName,data) =>{
    /*
    collectionName -> collection name of the database
    data -> the data wanted to store
    */
    return result = await collectionName.insertOne(data);
  }

  //POST insert multiple data
  const insertMultipleData = async( collectionName,data,options={})=>{
    /* collectionName = name of the collection where to insert
       data = the data want to insert and this data should be inside an array
            example :  
              const data = [
                              { name: "cake", healthy: false },
                              { name: "lettuce", healthy: true },
                              { name: "donut", healthy: false }
                          ];
      __this option prevents additional documents from being inserted if one fails
      const options = { ordered: true };  
    */
 return result = await collectionName.insertMany(data, options);
  }

  //PUT update single data
  const updateSinlgeData = async (collectionName,filter,dataTobeUpdated,option=true)=>{
      /*
      collectionName = name of the collection name
      filter = create a filter to update. Example:
              const filter = { title: "Random Harvest" };
      dataTobeUpdated = data you want to update
      options = this option is used if the data is absent then it will insert the data otherwise it will update it
                 const options = { upsert: true };
      */
        const options = { upsert: option };
        const updateDoc = { $set: dataTobeUpdated };
        return result = await collectionName.updateOne(filter, updateDoc, options);
  }

  //PUT update multiple data
  const updateMultipleData = async (collectionName,filter,dataTobeUpdated) => {
    /*
    collectionName = the collection name where the data will be updated
    filter = filter the data means where the datas will be updated. 
            example: create a filter to update all movies with a 'G' rating
                    const filter = { rated: "G" };
    
    dataTobeUpdated = data that will be update
    */
    const updateDoc = {
      $set: {dataTobeUpdated}
    }
    return result = await collectionName.updateMany(filter, updateDoc);
  }

  //POST replace single data
  const replaceOneData = async (collectionName,filter,replacement) => {
    /*
    collectionName = collection where the data will be replaced 😪
    filter = the data need to be replaced. Here you can use regex. Example
              const filter = { title: "The Cat from Sector XYZ" }; (without regex)
              const filter = { title: { $regex: "The Cat from" } }; (with regex)
    replacement =  create a new document that will be used to replace the existing document. Example:
                      const replacement = {
                        title: `The Cat from Sector ${Math.floor(Math.random() * 1000) + 1}`,
                      };
    */const query =filter;
      return result = await collectionName.replaceOne(query, replacement);
  }

  //DELETE delete single data
  const deleteSingleData = async(collectionName,query) => {
    /*
    collectionName = the collection where data will be deleted -_-
    query = the data will be delete. Example
            const query = { title: "Annie Hall" };
    */
   const deleteData = query
   const result = await collectionName.deleteOne(deleteData);
   if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
    return true
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
    return false
  }
  }

  //DELETE delete multiple data
  const deleteMultipleData = async(collectionName,filter) => {
    /*
    collectionName = eta colection tar name -__-
    filter = the data need to be replaced. Here you can use regex. Example
              const filter = { title: "The Cat from Sector XYZ" }; (without regex)
              const filter = { title: { $regex: "The Cat from" } }; (with regex)
      */
    const query = filter;
    const result = await collectionName.deleteMany(query);
    if (result.deletedCount === 0) {
      console.log("Nothing deleted.");
      return false
    } else {
      console.log("Successfully deleted");
      return false
    }
  }

  //GET estimated data count and count the specific category data
  const countAmountData = async (collectionName,estimateCount=false,query)=>{
    /*
    collectionName = eta collection name
    estimateCount = true means it will give estimate count of data means count of all data and false means it will give the amount of specific categories' of data
    query = filtered data Query for movies from Canada. Example:
            const query = { countries: "Canada" };
    */
   const filter = query
    if (estimateCount) {
      return estimate = await collectionName.estimatedDocumentCount();
    }else{
      return count = await collectionName.countDocuments(filter);
    }
  }

  
  //you can watch the change of the data base which is kinda high level but a needed feature 
  //check it from below link
  //https://www.mongodb.com/docs/drivers/node/current/usage-examples/changeStream/


  async function run(){
    try{
        await client.connect();

        //here collection and database will be added
        const venueCollection = client.db('event_horizon').collection('venues')


        app.get('/venues', async(req, res) => {
            const query = {};
            let x = await getMultipleData(venueCollection)         
            res.send(x)
        })
    } finally {

    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app  on port ${port}`)
})