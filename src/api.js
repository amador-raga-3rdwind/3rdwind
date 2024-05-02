const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Install cors middleware: npm install cors
const fetch = require('node-fetch');
const cheerio = require("cheerio");
const pretty = require("pretty");

const app = express();
app.use(cors({ origin: 'http://localhost:4200', methods: ['GET', 'POST'] }));
app.use(bodyParser.json()); 
app.use(express.urlencoded( {extended: true}));

app.listen(3000, () => {
  console.warn(`Server started on port 3000`);
});

// let response = await fetch(API_URL);
    // response = await response.json();
    // var fs = require('fs');
    // fs.writeFile('./sample3.json', JSON.stringify(response), 'utf8',()=>{ console.log("FILE SAVED!")});
    //let response = require('./sample'+ req.body.apiUrl +'.json');
  
//const preFormattedJSON = toArrayObjects(response);
    

app.post('/htmx-fetch-data', async (req, res) => {
  try {
    let response = await agencyGateway(req.body); 
    const html= toHTMLTable(response); //+ "<hr style='height:40px'>" + toHTMLTable(response,"<hr>", "H");
    res. status(200).send(html); // Send the HTML back to the client
  }
  catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

function extractAPI(agencyName){
  let API_OBJECT = [];
  API_OBJECT.push( {"agencyName": "NASA", "ROOT": "https://api.nasa.gov/", "KEY" : "&api_key=vbLbGfNJGHnixVbFnZ4qthBgHYQfzO2bmaXk9PFR" } );
  API_OBJECT.push( {"agencyName": "DVA", "ROOT": "https://api.va.gov/", "KEY" : "" } );
  const index =  API_OBJECT.find( (element) =>  element.agencyName==agencyName ) ;
  return index;
}

async function agencyGateway(body){
  const API = extractAPI(body.agencyName);
  const API_URL = API.ROOT + body.apiArea + "?" + body.paramObject + API.KEY; 
  let response =await fetch(API_URL);
  response = await response.json();
  return response;
}


//! To easily/clearly enclose items per hierarchy
    function _CELL(item){
      return "<api-cell>"+ item +"</api-cell>";
    } 
    function _VALUE(item){
      return "<api-value>"+ item +"</api-value>";
    } 
    function _KEY(item){
      return "<api-key>"+ item +"</api-key>";
    } 
    function _ROW(item){
      return "<api-row>"+ item +"</api-row>";
    } 
    function _NODE(item){
      return "<api-node>"+ item +"</api-node>";
    }
//!================================================

//! Stylize or sanitize an "item" value before being enclosed
    function keyStyle(item){
      return item.toUpperCase().replaceAll("_", "  ");
    }
    function isLinkable( item ){
      if(typeof item!="string") return "No assigned value";
      if(item.indexOf("http") >=0 )
      {
        const isPhoto = item.indexOf("jpg") >=0 || item.indexOf("png") >=0 || item.indexOf("gif") >=0 || item.indexOf("bmp") >=0; 
        return "<span class='urlMedia' onclick='apiPop(`" + item + "`)'>" + (isPhoto? "⎗":"⎆") + "</span>";
      }
      else
      return item;
    }
    function nodeInteract(item, level){
      const id = "btn" + new Date().getTime();
      const nodeBtnExpand =   `<button class='nodeButton hidden' (click)="nodeCollapse('`+ id  + `')"  title='Collapse'> + </button>`;
      const nodeBtnCollapse = `<button class='nodeButton' (click)="nodeExpand('`+ id  +`')" title='Expand'> - </button>`;
      // return _NODE(  (level>=3) ? 
      //       ( nodeBtnExpand + "<span id='"+ id + "'> " + nodeBtnCollapse + item +  "</span>" )
      //               : item );

      return  (level>=5) ?_NODE( "...") : item ;
    }
//!==================================================

//! Shortcut the structure 
    function isObject(element){
      return (element!= null && element!= undefined && typeof element==="object");
    }
    function isArray(element){
      return Array.isArray(element);
    }
//!==================================================

function toHTMLTable(JSON, level=0){
  let result = "";
  if(isObject(JSON))
  {
    level++;
    if(isArray(JSON))
    {
      for(let value of JSON){
        result+= _CELL( toHTMLTable(value, level)) ;
        // _CELL( toHTMLTable(value, level));
      }
    }
    else 
    {
      for (const [key, value] of Object.entries(JSON)) {
        const label = _KEY( keyStyle(key) );
        const item = isObject(value)  ? _CELL( nodeInteract(toHTMLTable(value, level), level) ) 
                                      : _VALUE( isLinkable(value??'N/A')) ;
        result += _CELL( label + item  );
      }
    }
  }
    return _ROW( result ); //  :  _NODE(result) ;
}


function toArrayObjects(JSON){
  let result = [];
  if(isObject(JSON))
  {
    if(isArray(JSON))
    {
      for(let value of JSON){
        result.push( toArrayObjects(value) );
      }
    }
    else 
    {
      for(const [key, value] of Object.entries(JSON) ){
        result.push( { "key": key, "value": isObject(value) ? toArrayObjects(value) : value });
      }
    }
  }
    return result;
}



