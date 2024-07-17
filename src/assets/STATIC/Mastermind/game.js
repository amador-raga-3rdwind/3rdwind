var MAX_TRIES = 10;
var NUM_COLORS = 6;
var NUM_BUTTONS = 4;

var currentRow = 0;
var placeholder;

var answers = [];
var code = [];
var colors = ["rgb(244, 78, 78)", "rgb(39, 163, 1)", "rgb(1, 116, 163)", "rgb(249, 247, 49)", "rgb(206, 83, 242)", "rgb(247, 180, 37)"];
var rows = document.getElementsByClassName("row");

var timer;

function createCode(){

	//Create a code array with four elements; each element will have a color value coming from the six colors from the colors.

	answers = ["0", "1", "2", "3"];
	code = ["","","",""]
	
	for( i=0; i<NUM_BUTTONS; i++ ){
	
		//if color is found in code, do it again
		var color 
		do
		{
			color = colors[Math.floor( Math.random() * 6 )];
		} 
		while (code.indexOf(color)>=0)
		code[i] = color
		console.log(color)
		
		var btn = document.createElement('button');
		btn.style.background = color;
		
		document.getElementById("answers").appendChild( btn );
	
	}
	HideCode()
	createGameBoard()

}

function ShowCode()
{
	document.getElementById("answers").style.display="";
	document.getElementById("header").style.display="none";
}

function HideCode()
{
	document.getElementById("answers").style.display="none"
}

function createGameBoard()
{
	for( i=0; i<NUM_COLORS; i++ ){

	var btn = document.createElement("button");
	btn.style.background = colors[i];
	btn.onclick = function(){
	
		if( document.getElementById("timer").innerHTML == "0.0" ){
		
			//timer
			timer = setInterval( function(){

				var time = document.getElementById("timer").innerHTML;
				
				document.getElementById('timer').innerHTML = (parseFloat(time) + 0.1).toFixed(1);	

			}, 100 );
		
		}
	
		document.getElementsByName(placeholder)[currentRow].style.background = this.style.background;
		document.getElementsByName(placeholder)[currentRow].className = "active";
		document.getElementById('btn_choices').style.display = "none";
		
		answers[placeholder.split("d")[1]] =  this.style.background;
		
		console.log(answers);
	
	}
	
	document.getElementById("btn_choices").appendChild( btn );

	}

	for( i=0; i<MAX_TRIES; i++ ){
		var div = document.createElement("div");
		div.className = "row";
		div.style.display='none';
		div.id = "row-" + i;
		div.setAttribute("data-row", i+1 );
		for( n=0; n<NUM_BUTTONS; n++ ){
			var btn = document.createElement("button");
			btn.name ="d" + n;
			btn.onmouseover = function(){ document.getElementById('btn_choices').style.display = '' ; placeholder = this.getAttribute("name"); };
			btn.onmousemove = function(e){
			
				if( this.parentNode.getAttribute("data-row")!=(currentRow+1) ){ return false; }
			
				var evt = e ? e:window.event;

				var divChoice = document.getElementById("btn_choices");
				
				divChoice.style.left = (evt.pageX - 85) + "px";
				divChoice.style.top = (evt.pageY + 20) + "px";
			
			};
			div.appendChild( btn );
		}
		document.getElementById("container").appendChild( div );
		var div2 = document.createElement("div");
		div2.className = "push inactive";
		div2.onclick = function(){ if( this.parentNode.getAttribute("data-row")==(currentRow+1) ){ if( push(answers, currentRow) ){ answers = ["0", "1", "2", "3"]; }; } }
		div.appendChild( div2 );
	}

	rows[currentRow].style.display = "";
	rows[currentRow].className = "row active";

}


//===== To be called when the PUSH button is clicked.
function push( ans, cr ){

	for( i=0; i<NUM_BUTTONS; i++ ){
	
		//Get the value of answers i..
		if( ans[i].indexOf("rgb") < 0 ){ alert("Please assign a colour for every peg."); return false; }
	
	}
	document.getElementById("start").style.display="none"
	if(cr>=2) document.getElementById("note").style.display="none"
	var solution=[0,0,0,0]
	var x = checkAnswers(ans).split(":")
	var counter=0
	console.log("solution0: " + solution)
	for(i=0; i<parseInt(x[0]); i++)
	{
		solution[counter]=2
		counter++
	}
	for(i=0; i<parseInt(x[1]); i++)
	{
		solution[counter]=1
		counter++
	}
	console.log("solution1: " + solution)
	for( n=0; n<NUM_BUTTONS; n++ ){
		var answers = document.createElement("span");
		answers.className = "answer";
			switch(solution[n]) {
			case 2:
			    answers.style.background = 'black'
			    break;
			case 1:
			    answers.style.background = 'white'
			    break;
			case 0:
			    answers.style.background = 'transparent'
			}
		document.getElementById("row-" + currentRow).getElementsByClassName("push")[0].appendChild( answers );
	}
	rows[currentRow].className = "row"; //make the past row a little inactive
	rows[currentRow].getElementsByClassName("push")[0].className = "push"; //make the past row a little inactive
	currentRow ++;
	
	rows[currentRow].style.display = ""; //make the current row visible
	rows[currentRow].className = "row active";

		
	return true;
	
}

function checkAnswers(ans)
{
	var coder = []
	for(x=0; x<=3; x++)
		coder.push(code[x])
	var correct_Position = 0
	var correct_Color = 0
	for (x=0; x<=3; x++)
	{
		//compare the answer with the code, with the same index, to find if correct position 
		if(ans[x]==coder[x])
		{
			correct_Position++
			console.log(code[x])
			ans[x]="done"
			coder[x]="===="
		}
	}
	console.log("answer: " + ans)
	console.log("code: " + coder)
	// now find for correct colors
	for (x=0; x<=3; x++)
	{
		var loc =coder.indexOf(ans[x])
		console.log("color: "+ loc)
		if(loc>=0) {
				correct_Color++
				coder[loc]="===="
		}
	}
console.log(correct_Position + ":" + correct_Color)
if(correct_Position==4){
	clearInterval( timer );
	ShowResult();
	for( i=currentRow+1; i<MAX_TRIES; i++ ){
		var elmt = document.getElementById("row-" + i );
		elmt.parentNode.removeChild(elmt);
	}
}
else
	{

		if( currentRow > 8 ){ alert("Sorry, you have lost."); ShowCode(); }
		//draw the 4 squares
		//alert("Dylan, draw the squares now!\nBlack Squares: " + correct_Position + "     White Squares: " + correct_Color )

	}
	return (correct_Position + ":" + correct_Color)

}


function ShowResult()
{
	//alert("Congratulations!!! You completed the game in " + document.getElementById('timer').innerHTML + " seconds.")
	
	document.getElementById("wrap").className = "blur";
	
	var pane = document.createElement('div');
	pane.className = "pane";
	var h1 = document.createElement('h1');
	var h1_ = document.createTextNode("Congratulations!");
	h1.appendChild( h1_ );
	
	var p = document.createElement('p');
	var p_ = document.createTextNode("You completed the game in " + document.getElementById('timer').innerHTML + " seconds.");
	p.appendChild( p_ );
	
	pane.appendChild( h1 );
	pane.appendChild( p );
	
	document.body.appendChild(pane);
	
}

//http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div
function onMouseOut(event) {
        //this is the original element the event handler was assigned to
        var e = event.toElement || event.relatedTarget;
        if (e.parentNode == this || e == this) {
           return;
        }
    this.style.display = "none";
    this.setAttribute("data-for", "");
}

document.getElementById('btn_choices').addEventListener('mouseout',onMouseOut,true);
