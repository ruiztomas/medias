const API_BASE='http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', ()=>{
    cargarStock();

    const form=document.getElementById('formAgregarMedia');
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const modelo=document.getElementById('modelo').value;
        const nombre=document.getElementById('nombre').value.trim();
        const cantidad=parseInt(document.getElementById('cantidad').value);

        if (!modelo || !nombre || cantidad<1)return;

        await fetch(`${API_BASE}/stock`,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({modelo, nombre, cantidad})
        });

        form.reset();
        cargarStock();
    });

    const botonesFiltro=document.querySelectorAll('.filtros button');
    botonesFiltro.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            botonesFiltro.forEach(b=>b.classList.remove('activo'));
            btn.classList.add('activo');

            const modelo=btn.dataset.modelo;
            cargarStock(modelo);
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
                <td>${item.cantidad}</td>
            `;
            tbody.appendChild(tr);
        });
}