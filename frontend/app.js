const API_BASE='http://localhost:3000/api';

let filtro="todos";

document.addEventListener('DOMContentLoaded', ()=>{
    cargarStock();

    const form=document.getElementById('formAgregarMedia');
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const modelo=document.getElementById('modelo').value;
        const nombre=document.getElementById('nombre').value.trim();
        const cantidad=parseInt(document.getElementById('cantidad').value);
        const imagenInput=document.getElementById('imagen');
        const precio=parseFloat(document.getElementById('precio').value);

        if (!modelo || !nombre || cantidad<1 || imagenInput.files.length === 0)return;

        const formData= new FormData();
        formData.append('modelo', modelo);
        formData.append('nombre', nombre);
        formData.append('cantidad', cantidad);
        formData.append('imagen', imagenInput.files[0]);
        formData.append('precio', precio);

        await fetch(`${API_BASE}/stock`,{
            method: 'POST',
            body: formData,
        });

        e.target.reset();
        cargarStock(filtro);
    });

    const botonesFiltro=document.querySelectorAll('.filtros button');
    botonesFiltro.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            botonesFiltro.forEach(b=>b.classList.remove('activo'));
            btn.classList.add('activo');

            filtro=btn.dataset.modelo;
            cargarStock();
        });
    });
});

async function cargarStock(){
    const res=await fetch(`${API_BASE}/stock`);
    const stock=await res.json();

    const tbody=document.querySelector('#tablaStock tbody');
    tbody.innerHTML='';
    
    stock
        .filter(item=>filtro==='todos' || item.modelo===filtro)
        .forEach(item => {
            const tr=document.createElement('tr');
            tr.innerHTML=`
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
            `;
            tbody.appendChild(tr);
        });
    
    document.querySelectorAll('.btnSumar').forEach(btn=>{
        btn.addEventListener('click', async()=>{
            const id=btn.dataset.id;
            await fetch(`${API_BASE}/stock/${id}/sumar`,{
                method: 'PATCH',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({cantidad:1})
            });
            cargarStock();
        });
    });

    document.querySelectorAll('.btnRestar').forEach(btn=>{
        btn.addEventListener('click', async()=>{
            const id=btn.dataset.id;
            await fetch(`${API_BASE}/stock/${id}/restar`,{
                method: 'PATCH',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({cantidad:1})
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
}