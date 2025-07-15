const API_BASE = 'http://localhost:3000/api';

let filtro = "todos";
let textoBusqueda="";

document.addEventListener('DOMContentLoaded', () => {
    cargarStock();
    cargarSugerenciasDeMedias();

    const botonesFiltro = document.querySelectorAll('button[data-modelo]');
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            filtro = btn.dataset.modelo;
            cargarStock();
        });
    });
    const inputBusqueda=document.getElementById("busquedaInput");
    inputBusqueda.addEventListener('input',()=>{
        textoBusqueda=inputBusqueda.value.toLowerCase();
        cargarStock();
    });
});    

async function cargarStock() {
    const res = await fetch(`${API_BASE}/stock`);
    const stock = await res.json();

    const tbody = document.querySelector('#tablaStock tbody');
    tbody.innerHTML = '';

    stock
        .filter(item => 
            (filtro === 'todos' || item.modelo === filtro)&&
            (item.nombre.toLowerCase().includes(textoBusqueda) || item.modelo.toLowerCase().includes(textoBusqueda))
        )
        .forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.modelo}</td>
                <td>${item.nombre}</td>
                <td>
                    ${item.cantidad}
                    <button class="btnSumar" data-id="${item._id}">+</button>
                    <button class="btnRestar" data-id="${item._id}">-</button>
                </td>
                <td>
                    <button class="btnRepuesta" data-id="${item._id}">
                        ${item.repuesta ? '✅' : '⬜'}
                    </button>
                </td>
                <td>
                    <button class="btnEliminar" data-id="${item._id}>🗑️</button>
            `;
            tbody.appendChild(tr);
        });

    document.querySelectorAll('.btnSumar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await fetch(`${API_BASE}/stock/${id}/sumar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: 1 })
            });
            cargarStock();
        });
    });

    document.querySelectorAll('.btnRestar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await fetch(`${API_BASE}/stock/${id}/restar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: 1 })
            });
            cargarStock();
        });
    });

    document.querySelectorAll('.btnRepuesta').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const esRepuesta = btn.textContent === '✅';
            const nuevoValor = !esRepuesta;

            await fetch(`${API_BASE}/stock/${id}/repuesta`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repuesta: nuevoValor })
            });
            cargarStock();
        });
    });
    
    document.querySelectorAll('.btnEliminar').forEach(btn=>{
        btn.addEventListener('click', async()=>{
            const id=btn.dataset.id;
            if(confirm('¿Estas seguro de que queres eliminar esta media?')){
                await fetch(`${API_BASE}/stock/${id}`,{
                    method:'DELETE'
                });
                cargarStock();
            }
        });
    });
}
async function cargarSugerenciasDeMedias(){
    const res=await fetch(`${API_BASE}/stock`);
    const stock=await res.json();
    
    const datalist=document.getElementById('listaMedias');
    if(!datalist)return;
    datalist.innerHTML='';

    const nombresUnicos=[...new Set(stock.map(item=>item.nombre))];

    nombresUnicos.forEach(nombre=>{
        const option=document.createElement('option');
        option.value=nombre;
        datalist.appendChild(option);
    });
}