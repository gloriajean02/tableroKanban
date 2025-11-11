//Contenedores donde están los enlaces para añadir una nueva tarjeta
const divOpenForm = document.querySelectorAll(".divOpenForm");
//Enlaces para abrir el form para crear una nueva tarjeta
const openForm = document.querySelectorAll(".openForm");
//Contenedores donde están los forms
const divForm = document.querySelectorAll(".divForm");
//Columnas
const columns = document.querySelectorAll(".columna");

const sectionTarjetas = document.querySelectorAll(".tarjetas");

const botonAdd = document.querySelectorAll(".botonAdd");

const textoTarjeta = document.querySelectorAll(".textoTarjeta");

const botonCancelar = document.querySelectorAll(".botonCancelar");

let contador = 0;

for (let index = 0; index < columns.length; index++) {
    const newCard = openForm[index];
    newCard.addEventListener("click", () => {
        divOpenForm[index].classList.add("disabled");
        divForm[index].classList.remove("disabled");
    });

    const addCard = botonAdd[index];
    addCard.addEventListener("click", () => {
        // Aquí obtenemos el texto del textarea
        const texto = textoTarjeta[index].value;
        const divTarjeta = document.createElement('div');
        divTarjeta.classList.add('tarjeta');
        divTarjeta.innerHTML =
            `<div class="contenidoTarjeta">
                    <p>${texto}</p>
                </div>
                <div class="borrar">
                    <img src="images/borrar.png" class="botonBorrar">
                </div>`;

        divTarjeta.draggable = true;
        divTarjeta.id = "tarjeta-" + contador++;
        divTarjeta.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        sectionTarjetas[index].appendChild(divTarjeta);

        textoTarjeta[index].value = '';

        divOpenForm[index].classList.remove("disabled");
        divForm[index].classList.add("disabled");

        const borrarTarjeta = divTarjeta.querySelector(".botonBorrar");
        borrarTarjeta.addEventListener("click", () => {
            sectionTarjetas[index].removeChild(divTarjeta);
        });
    });

    const cancelar = botonCancelar[index];
    cancelar.addEventListener("click", () => {
        textoTarjeta[index].value = '';
        divOpenForm[index].classList.remove("disabled");
        divForm[index].classList.add("disabled");
    });

}

const dropzones = document.querySelectorAll(".dropzone");

dropzones.forEach(zone => {
    // Permitir soltar
    zone.addEventListener('dragover', e => e.preventDefault());
    // Cuando se suelta el elemento
    zone.addEventListener('drop', handleDrop);
});

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const element = document.getElementById(id);
    e.currentTarget.appendChild(element); // e.currentTarget = la zona donde se soltó
}