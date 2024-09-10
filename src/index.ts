import express,{Request, Response, request, response} from "express";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/pokedex/:pageId", function(request:Request, response:Response){
    let pageId=parseInt(request.params.pageId);
    console.log(pageId);
    if(pageId<1 || pageId>22 || !pageId){
        response.render("error", {err:404});
    }
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${50*(pageId-1)}&limit=${50}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            response.render("index", {data:data, pageId:pageId});
        })
        .catch(function(err){
            response.render("error", err);
        });
})

app.get("/", function (request:Request, response: Response) {
    response.redirect("/pokedex/1");
});

app.get("/details/:pokemon", function(request:Request, response:Response){
    var pokeData;
    fetch(`https://pokeapi.co/api/v2/pokemon/${request.params.pokemon}`)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        data.name=data.name.charAt(0).toUpperCase()+data.name.slice(1);
        data.abilities.forEach(function(ability){
            ability.ability.name=ability.ability.name.charAt(0).toUpperCase()+ability.ability.name.slice(1);
        })
        data.types.forEach(function(type){
            type.type.name=type.type.name.charAt(0).toUpperCase()+type.type.name.slice(1);
        })
        pokeData=data;
    })
    .then(function(){
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${request.params.pokemon}`)
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            console.log(data)
            response.render("pokemon", {data:pokeData, speciesData:data})
        });
    })
});

app.listen(3000, function () {
    console.log("Server is running");
});