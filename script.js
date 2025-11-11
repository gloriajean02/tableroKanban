//Columnas
const columns = document.querySelectorAll(".columna");

//Contenedores donde están los enlaces para añadir una nueva tarjeta
const divOpenForm = document.querySelectorAll(".divOpenForm");

//Enlaces para abrir el form para crear una nueva tarjeta
const openForm = document.querySelectorAll(".openForm");

//Contenedores donde están los forms
const divForm = document.querySelectorAll(".divForm");

//Botón añadir del form
const botonAdd = document.querySelectorAll(".botonAdd");

//Texto del textarea (luego hay que añadir .value)
const textoTarjeta = document.querySelectorAll(".textoTarjeta");

//Botón "X" para cancelar creación de tarjeta
const botonCancelar = document.querySelectorAll(".botonCancelar");

//Secciones donde se van a ubicar todas las tarjetas
const sectionTarjetas = document.querySelectorAll(".tarjetas");

//Contador para añadir ID a cada tarjeta ("#tarjeta-1")
let contador = 0;

//Iteramos sobre las columnas para saber en cuál de ellas estamos trabajando
for (let index = 0; index < columns.length; index++) {

    //Si click sobre "+ Añadir nueva tarjeta"
    const newCard = openForm[index];
    newCard.addEventListener("click", () => {
        divOpenForm[index].classList.add("disabled");
        divForm[index].classList.remove("disabled");
    });

    //Si click sobre "Añadir" en el form
    const addCard = botonAdd[index];
    addCard.addEventListener("click", () => {

        // Aquí obtenemos el texto del textarea
        const texto = textoTarjeta[index].value;

        //Creamos el div para la tarjeta, le añadimos class e innerHTML
        const divTarjeta = document.createElement('div');
        divTarjeta.classList.add('tarjeta');
        divTarjeta.innerHTML =
            `<div class="contenidoTarjeta">
                    <p>${texto}</p>
                </div>
                <div class="borrar">
                    <img src="images/borrar.png" class="botonBorrar disabled">
                </div>`;
        
        const borrarTarjeta = divTarjeta.querySelector(".botonBorrar");
        divTarjeta.addEventListener("mouseover", () => {
            borrarTarjeta.classList.remove("disabled");
        });

        divTarjeta.addEventListener("mouseleave", () => {
            borrarTarjeta.classList.add("disabled");
        });

        //Le decimos que va a ser arrastrable, le añadimos id y cómo arrastrarse
        divTarjeta.draggable = true;
        divTarjeta.id = "tarjeta-" + contador++;

        //Evento que se dispara cuando empiezas a arrastrar la tarjeta
        divTarjeta.addEventListener('dragstart', e => {
            //Añadimos una clase para indicar que esta tarjeta está siendo arrastrada
            divTarjeta.classList.add("dragging");
            //Guardamos el ID de la tarjeta en el "dataTransfer"
            //Esto sirve para que, cuando se suelte en drop, sepamos qué tarjeta mover
            e.dataTransfer.setData('text/plain', divTarjeta.id);
        });

        //Evento que se dispara cuando terminas de arrastrar (cuando sueltas la tarjeta)
        divTarjeta.addEventListener('dragend', () => {
            //Quitamos la clase "dragging" porque ya no está siendo arrastrada
            divTarjeta.classList.remove("dragging");
        });

        //Añadimos la tarjeta a la sección de tarjetas
        sectionTarjetas[index].appendChild(divTarjeta);

        //Reseteamos el valor del textarea y los disabled
        textoTarjeta[index].value = '';
        divOpenForm[index].classList.remove("disabled");
        divForm[index].classList.add("disabled");

        //Si click en borrar tarjeta, borramos el child de la seccion tarjetas
        borrarTarjeta.addEventListener("click", () => {
            sectionTarjetas[index].removeChild(divTarjeta);
        });
    });

    //Si click en "X" en el form, cancelamos la creación de la nueva tarjeta
    //y reseteamos el textarea y los disabled
    const cancelar = botonCancelar[index];
    cancelar.addEventListener("click", () => {
        textoTarjeta[index].value = '';
        divOpenForm[index].classList.remove("disabled");
        divForm[index].classList.add("disabled");
    });

}


// Eventos para el funcionamiento de drag & drop

const dropzones = document.querySelectorAll(".dropzone");

// Seleccionamos todas las zonas donde se pueden soltar las tarjetas
dropzones.forEach(zone => {
    // "dragover" se dispara mientras arrastras una tarjeta sobre la zona
    // PreventDefault es necesario para permitir que se pueda soltar (drop)
    zone.addEventListener('dragover', e => e.preventDefault());

    // "drop" se dispara cuando sueltas la tarjeta sobre la zona
    // Llama a la función handleDrop para mover la tarjeta
    zone.addEventListener('drop', handleDrop);
});

// --- Función que se ejecuta al soltar una tarjeta ---
function handleDrop(e) {
    e.preventDefault(); // Evita el comportamiento por defecto del navegador

    // Recuperamos el ID de la tarjeta que estamos arrastrando
    const id = e.dataTransfer.getData('text/plain');

    // Obtenemos el elemento HTML de la tarjeta usando su ID
    const dragged = document.getElementById(id);

    // Contenedor donde se ha soltado la tarjeta
    const container = e.currentTarget;

    // Determinamos si hay alguna tarjeta debajo del cursor para insertar antes
    const afterElement = getDragAfterElement(container, e.clientY);

    if (afterElement == null) {
        // No hay tarjeta debajo, añadimos al final
        container.appendChild(dragged);
    } else {
        // Hay tarjeta debajo, insertamos la tarjeta arrastrada antes de esa
        container.insertBefore(dragged, afterElement);
    }
}

// --- Función que detecta qué tarjeta está justo debajo del cursor ---
function getDragAfterElement(container, y) {
    // Seleccionamos todas las tarjetas en la columna que no están siendo arrastradas,
    //es decir, las que no contengan 'dragging'
    const allCards = container.querySelectorAll(".tarjeta");
    const draggableElements = Array.from(allCards).filter(card => !card.classList.contains('dragging'));

    //Ahora tenemos que encontrar la tarjeta más cercana al lugar donde estamos moviendo
    let closest = null;

    for (const element of draggableElements) {
        const coordTarjeta = element.getBoundingClientRect(); //devuelve las coordenadas de la tarjeta en la pantalla

        //top es la distancia desde la parte superior de la ventana hasta la tarjeta.
        // height es altura de la tarjeta.
        // Calculamos el punto medio vertical de la tarjeta.
        const puntoMedio = coordTarjeta.top + coordTarjeta.height / 2;

        //"y" es la posición vertical del ratón cuando soltamos la tarjeta (e.clientY).
        // Si el cursor está arriba del centro de la tarjeta, significa que queremos insertar
        // la tarjeta arrastrada antes de esta tarjeta.
        if (y < puntoMedio) {
            closest = element;
            break; // la primera tarjeta cuyo centro está debajo del cursor
        }
    }

    return closest; // null si ninguna está debajo, si es null se hace append en handledrop, si no, insertbefore
}
