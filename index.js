import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const API=process.env.API_NINJAS_KEY;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

var chosenMake;
var chosenModel;

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.post("/getModel", async (req, res) =>{
    try{
        chosenMake = req.body.make.toLowerCase().trim();
        console.log(chosenMake);

        const response =  await axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/" + chosenMake + "?format=json");
        
        res.render("index.ejs", {make:chosenMake, cars:response.data.Results});
    }
    catch{
        console.error("Something went wrong:", error.message);
    }
});

app.post("/getImage", async(req, res) => {
    try{
        chosenModel = req.body.model.toLowerCase().trim();
        console.log(chosenModel);

        const imageResponse = await axios.get(`https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${chosenMake}+${chosenModel}`);
        const imageURL = imageResponse.data.match(/<string[^>]*>(.*?)<\/string>/)?.[1];

        const deets = await axios.get(`https://api.api-ninjas.com/v1/cars?make=${chosenMake}&model=${chosenModel}`, {headers: {"X-Api-Key":API}});
        console.log(`https://api.api-ninjas.com/v1/cars?make=${chosenMake}&model=${chosenModel}`);
        
        res.render("index.ejs", {make:chosenMake, model:chosenModel, image:imageURL, deets:deets.data[0]});
    }
    catch{
        console.error("Something went wrong:", error.message);
    }
});

app.listen(port, ()=>{
    console.log("Server is running!");
})