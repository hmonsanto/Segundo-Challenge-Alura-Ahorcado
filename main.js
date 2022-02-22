const abecedarioMayuscula=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const acentoVocales=['Á', 'É', 'Í', 'Ó', 'Ú'];

var palabra;
var vidas = 0;
var space=""
var prueba="";

var failLetterList=""

var palabras = ["ESFERA", "JUSTICIA", "BATMAN", "EXTREMO", "SPIDERMAN", 
"FARMACIA", "SUPERMERCADO", "PERU", "ARGENTINA", "AZUL",
"CORONAVIRUS", "SOLEADO", "HELADO", "EXTRVAGANTE", "AGRICULTURA",
"REFORMA", "EMOTIVO", "SORTEO", "CANADA", "UNIVERSO", 
"INTERPOL", "FANTASMA", "MISTERIO", "HUMOR", "LLUVIA"];


function startGame(){
    document.getElementById("div-1").style.display="none";
    document.getElementById("div-2").style.display="none";
    document.getElementById("contact").style.display="none";
    document.getElementById("div-3").style.display="";
    document.getElementById("div-imagen").style.display="";
    document.getElementById("contact").style.display="";

    palabra= palabras[Math.floor(Math.random()*palabras.length)]
    addSpace(palabra.length-1)


}
function addWord(){

    let data= document.getElementById("input-nueva-palabra").value;

    if(data){
        alert("PALABRA AGREGADA")
        palabras.push(data);
    }
    else{
        alert("PALABRA VACIA")
    }
}
function addSpace(number){


    for (let index = 0; index <= number; index++) {
        space+="_ ";
        
    }
    document.getElementById("word-space").innerHTML=space;
}

function checkLetter(){
    var letter= document.getElementById("input-nueva-letra").value;
    

    if(letter.length>1){
        alert("INGRESE UNA LETRA")
    }
    else{

        if(mayuscula(letter)){
            alert("Letra Minuscula no aceptada")

         }
        if(acento(letter)){
            alert("Acento detectado no aceptado");

        }
        else{
         
            if(vidas==6){
                alert("JUEGO TERMINADO")
            }
            else{
                if(palabra.indexOf(letter)==-1){
                    vidas+=1;
                    alert("LETRA NO ENCONTRADA")
                    failLetter(vidas,letter)
                }
                else{
                    correctLetter(palabra,letter)

                }
            }
        }


    }
}

function failLetter(number,letter){

    var message= document.getElementById("vidas").childNodes.item(0).data;
    let message2= message.slice(0,18)
    message2+=number.toString();

    let scrPhoto= "img/"+number.toString()+".PNG";

    document.getElementById("vidas").innerHTML=message2;
    document.getElementById("foto").src=scrPhoto;

    if(!failLetterList.includes(letter)){
        failLetterList+=letter+',';
    }

    document.getElementById("letter-fail").innerHTML="Letras fallidas: "+failLetterList;


}

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
 
    return this.substring(0, index) + replacement + this.substring(index + 1);
}
 

function correctLetter(palabra,letter){

    
    var textWord="";


    for (let index = 0; index < palabra.length; index++) {
        if(palabra[index]==letter){
            textWord+=letter+" ";
        }
        else{
            textWord+="_ ";
        }
        
    }

    for (let index = 0; index < textWord.length; index++) {
        if(textWord[index]=="_"||textWord[index]==""){

        }
        else{
            space= space.replaceAt(index,textWord[index]);
        }
        
    }

    document.getElementById("word-space").innerHTML=space;

    if(space.replace(/\s/g,'')==palabra){
        document.getElementById("vidas").innerHTML="GANASTE!!!";

        alert("PALABRA ENCONTRADA")
    }

}

function acento(texto){
    for (let index = 0; index < texto.length; index++) {
        if(acentoVocales.includes(texto[index])){
            return true;
        }
        
    }
    return false;
    
}

function mayuscula(texto){
    for (let index = 0; index < texto.length; index++) {
        if(abecedarioMayuscula.includes(texto[index])){
            return true;
        }
        
    }
    return false;
    
}
