const usuarioInput = document.getElementById('usuario');
const contrasenaInput = document.getElementById('contrasena');
const iniciarSesionBoton = document.getElementById('iniciarSesion');
const headerIniciarSesionBoton = document.getElementById('headerIniciarSesion');
const salirBoton = document.getElementById('salir');
const divHistoriasClinicas = document.getElementById('divHistoriasClinicas');
const divAtencion = document.getElementById('divAtencion');
const agregarHistoriaBoton = document.getElementById('agregarHistoria');
const historiasClinicasContenedor = document.getElementById('historiasClinicasContenedor');
const modalEjemplo = new bootstrap.Modal(document.getElementById('modalEjemplo'));


let userData = JSON.parse(localStorage.getItem('userData')) || { usuario: '', contrasena: '' };


let historiasCargadas = false;

// elementos dependiendo del login
function actualizar() {
    const h1 = document.querySelector('main h1');
    if (userData && userData.usuario) {
        h1.innerHTML = `¡Hola de nuevo Dr, ${userData.usuario}!`;
        headerIniciarSesionBoton.disabled = true;
        salirBoton.style.display = 'block';
        divAtencion.classList.add('ocultar');
        divHistoriasClinicas.classList.remove('ocultar');
    } else {
        h1.innerHTML = '¡Hola de nuevo!';
        divHistoriasClinicas.classList.add('ocultar');
        divAtencion.classList.remove('ocultar');
    }
}


function guardarUsuarioEnLocalStorage() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// btn login
iniciarSesionBoton.addEventListener('click', function () {
    const usuario = usuarioInput.value;
    const contrasena = contrasenaInput.value;

    if (usuario === '' || contrasena === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese usuario y contraseña',
            background: '#000',
            confirmButtonColor: '#dc3545',
        });
    } else {
        userData.usuario = usuario;
        userData.contrasena = contrasena;

        guardarUsuarioEnLocalStorage();

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: '¡Inicio de sesión exitoso!',
            background: '#000',
            confirmButtonColor: '#28a745',
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                location.reload();
            }
        });

        headerIniciarSesionBoton.disabled = true;
        salirBoton.style.display = 'block';
    }
});

// btn salir
salirBoton.addEventListener('click', function () {
    Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Tu sesión se ha cerrado exitosamente.',
        background: '#000',
        confirmButtonColor: '#28a745',
    }).then(() => {
        userData = { usuario: '', contrasena: '' };

        guardarUsuarioEnLocalStorage();

        location.reload();
    });
});


class Hospital {
    constructor(nombre, img, alt, direccion) {
        this.nombre = nombre;
        this.img = img;
        this.alt = alt;
        this.direccion = direccion;
    }
}

// .json 
fetch('datos_hospitales.json')
    .then((response) => response.json())
    .then((data) => {
        const hospitalesContenier = document.getElementById('hospitalesContenier');

        data.forEach((hospitalesData) => {
            const hospital = new Hospital(
                hospitalesData.nombre,
                hospitalesData.img,
                hospitalesData.alt,
                hospitalesData.direccion
            );

            const hospitalCard = document.createElement('div');
            hospitalCard.classList.add('col-md-4');
            hospitalCard.innerHTML = `
                <div class="card text-light bg-dark mb-3">
                    <img src="${hospital.img}" alt="${hospital.alt}" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">${hospital.nombre}</h5>
                        <p class="card-text">${hospital.direccion}</p>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="btn btn-primary">Cómo ir</a>
                    </div>
                </div>
            `;

            hospitalesContenier.appendChild(hospitalCard);
        });
    });

// historias
function guardarHistoriasEnLocalStorage() {
    const historias = [];
    const historiasCards = historiasClinicasContenedor.querySelectorAll('.card');

    historiasCards.forEach((card) => {
        const titulo = card.querySelector('.card-title').textContent;
        const grupoSanguineo = card.querySelector('.card-text:nth-child(2)').textContent.split(': ')[1];
        const tratamientos = card.querySelector('.card-text:nth-child(3)').textContent.split(': ')[1];
        const alergias = card.querySelector('.card-text:nth-child(4)').textContent.split(': ')[1];
        const condicion = card.querySelector('.card-text:nth-child(5)').textContent.split(': ')[1];
        const anotaciones = card.querySelector('.card-text:nth-child(6)').textContent.split(': ')[1];

        historias.push({
            titulo,
            grupoSanguineo,
            tratamientos,
            alergias,
            condicion,
            anotaciones,
        });
    });

    localStorage.setItem('historiasClinicas', JSON.stringify(historias));
}


function cargarHistoriasDesdeLocalStorage() {
    const historias = JSON.parse(localStorage.getItem('historiasClinicas')) || [];

    historias.forEach((historia) => {
        const nuevaHistoriaClinica = document.createElement('div');
        nuevaHistoriaClinica.classList.add('card', 'mb-3');
        nuevaHistoriaClinica.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${historia.titulo}</h5>
                <p class="card-text">Grupo Sanguíneo: ${historia.grupoSanguineo}</p>
                <p class="card-text">Tratamientos: ${historia.tratamientos}</p>
                <p class="card-text">Alergias: ${historia.alergias}</p>
                <p class="card-text">Condición: ${historia.condicion}</p>
                <p class="card-text">Anotaciones: ${historia.anotaciones}</p>
                <button type="button" class="btn btn-danger" id="eliminarHistoria">Eliminar</button>
            </div>
        `;

        historiasClinicasContenedor.appendChild(nuevaHistoriaClinica);

        const eliminarHistoriaBoton = nuevaHistoriaClinica.querySelector('#eliminarHistoria');
        eliminarHistoriaBoton.addEventListener('click', () => {
            historiasClinicasContenedor.removeChild(nuevaHistoriaClinica);
            guardarHistoriasEnLocalStorage();
        });
    });
}

agregarHistoriaBoton.addEventListener('click', () => {
    modalEjemplo.show();
});

const guardarCambiosBoton = document.querySelector('#modalEjemplo .modal-footer button.btn-primary');
guardarCambiosBoton.addEventListener('click', () => {
    const nombrePaciente = document.getElementById('nombrePaciente').value;
    const grupoSanguineo = document.getElementById('grupoSanguineo').value;
    const tratamientos = document.getElementById('tratamientos').value;
    const alergias = document.getElementById('alergias').value;
    const condicion = document.getElementById('condicion').value;
    const anotaciones = document.getElementById('anotaciones').value;

    const nuevaHistoriaClinica = document.createElement('div');
    nuevaHistoriaClinica.classList.add('card', 'mb-3');
    nuevaHistoriaClinica.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${nombrePaciente}</h5>
            <p class="card-text">Grupo Sanguíneo: ${grupoSanguineo}</p>
            <p class="card-text">Tratamientos: ${tratamientos}</p>
            <p class="card-text">Alergias: ${alergias}</p>
            <p class="card-text">Condición: ${condicion}</p>
            <p class="card-text">Anotaciones: ${anotaciones}</p>
            <button type="button" class="btn btn-danger" id="eliminarHistoria">Eliminar</button>
        </div>
    `;

    historiasClinicasContenedor.appendChild(nuevaHistoriaClinica);

    modalEjemplo.hide();

    document.getElementById('nombrePaciente').value = '';
    document.getElementById('grupoSanguineo').value = '';
    document.getElementById('tratamientos').value = '';
    document.getElementById('alergias').value = '';
    document.getElementById('condicion').value = '';
    document.getElementById('anotaciones').value = '';

    guardarHistoriasEnLocalStorage();

    const eliminarHistoriaBoton = nuevaHistoriaClinica.querySelector('#eliminarHistoria');
    eliminarHistoriaBoton.addEventListener('click', () => {
        historiasClinicasContenedor.removeChild(nuevaHistoriaClinica);
        guardarHistoriasEnLocalStorage();
    });
});

actualizar();

if (!historiasCargadas) {
    cargarHistoriasDesdeLocalStorage();
    historiasCargadas = true;
}
