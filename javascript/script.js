/* 
    http://pokeapi.co/
    http://pokeapi.co/v2/pokemon?limit=3&offset=0/

    -TRABAJAMOS RESPETANDO SIEMPRE LAS ID DE LOS DIV
    -MOVEMOS EL XMLHTTPREQUEST CON PREVIOUS-NEXT
    -DATOS DEL POKEMON: ESPECIE, NRO. POKEDEX, TIPOS, SPRITES (FRENTE Y DE ESPALDA), HABILIDAD Y HABILIDAD OCULTA.
    -LA POKEDEX EMPIEZA EN #1 TERMINA EN #898

*/

//variables de datos del pokemon en el html 
const nombre = document.getElementById('nombre');
const nombreL= document.getElementById('actual');
const frenteNormal = document.getElementById('frenteNormal');
const espaldaNormal = document.getElementById('espaldaNormal');
const frenteShiny = document.getElementById('frenteShiny');
const espaldaShiny = document.getElementById('espaldaShiny');
const hab= document.getElementById("habilidad");
const habO=document.getElementById("habilidadOculta");
const tipo1 = document.getElementById('tipo1');
const tipo2 = document.getElementById('tipo2');

//variables de manejo de ajax
const botonAnt = document.getElementById('botonAnt');
const botonSig = document.getElementById('botonSig');
const nombres = [ document.getElementById('nombre0'), document.getElementById('nombre1'), document.getElementById('nombre2') ];
let url= `https://pokeapi.co/api/v2/pokemon?limit=3&offset=0`;
let pokemon= new XMLHttpRequest();
let poke= new XMLHttpRequest();
let urlPoke;

botonAnt.addEventListener("click",function(){
    url= JSON.parse(pokemon.responseText).previous;
    mostrarPokemon();
})

botonSig.addEventListener("click",function(){
    url= JSON.parse(pokemon.responseText).next;
    mostrarPokemon();
})

function mostrarPokemon(){

    pokemon.open("GET",url,true);
    pokemon.send();
    
    function mostrarLista(datos){
        let aux = datos.results;
            
        for(let i=0; i<aux.length;i++) {
            let name = aux[i].name;
            name = name[0].toUpperCase() + name.slice(1);
            nombres[i].textContent = name;
        }
    }

    function mostrarDatos(datos){
        for(let i=0; i<nombres.length;i++) {
            nombres[i].addEventListener("click",function(){
                urlPoke= datos.results[i].url;
                poke.open("GET",urlPoke,true);
                poke.send();
                poke.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        let datosP = JSON.parse(poke.responseText);
                        actPokemon(datosP);
                    }
                }
            })
        }
    }
    pokemon.onreadystatechange=function(){
        if(this.status == 200 && this.readyState == 4){
            let datosPokemon = JSON.parse(pokemon.responseText);

            //bloquear botones
            if (datosPokemon.previous == null)
                botonAnt.disabled = true;
            else
                botonAnt.disabled = false;

            if (datosPokemon.next == null)
                botonSig.disabled = true;
            else
                botonSig.disabled = false;
            
            mostrarLista(datosPokemon); //mostrar los nombres
            mostrarDatos(datosPokemon); //mostrar los datos
        }
    }
        
    function actPokemon(pokemon){
        
        function visualizar(){
            function mostrarNombre(){
                nombreL.textContent= pokemon.forms[0].name.toUpperCase()+ " "
                nombre.textContent = pokemon.forms[0].name.toUpperCase() + "  ";
            }
    
            function mostrarNumero(){
                 let numero= document.getElementById('numPoke');
                 let aux = pokemon.id;
                 if (aux < 10){ aux = "00" + aux; }
                 else if (aux < 100) aux = "0" + aux;
                 numero.textContent = "#" + aux;
            }
    
            function mostrarImagenes(){
                frenteNormal.src = pokemon.sprites.front_default;
                espaldaNormal.src = pokemon.sprites.back_default;
                frenteShiny.src = pokemon.sprites.front_shiny;
                espaldaShiny.src = pokemon.sprites.back_shiny;
            }
    
            function mostrarTipos(){
                tipo1.src = "css/types/" + pokemon.types[0].type.name + ".gif";
                if (pokemon.types.length > 1) tipo2.src = "css/types/" + pokemon.types[1].type.name + ".gif";
                else tipo2.src ="";
                    
            }
    
            function mostrarHabilidades(){
                let aux = pokemon.abilities;
                let ocultas='No posee.';
                let normales='';
                for (let i=0; i< aux.length ; i++) {
                    if (aux[i].is_hidden == true)
                        ocultas= aux[i].ability.name;
                    else
                        normales= normales + ' ' + aux[i].ability.name; 
                }
                    
                hab.textContent ="HABILIDADES" + normales;
                habO.textContent="HABILIDAD OCULTA: " + ocultas;
            }
                    
            mostrarNombre(); mostrarNumero(); mostrarImagenes(); mostrarTipos(); mostrarHabilidades();
        }
        visualizar();
    }
}
