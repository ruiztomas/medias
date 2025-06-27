const API_BASE='https://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async()=>{
    await cargarOpcionesStock();
    await cargarVentas();

    const form=document.getElementById('formVenta');
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const mediaId=document.getElementById('mediaSelect').ariaValueMax;
        const cantidad=parseInt(document.getElementById('cantidadVenta').value);

        if (!mediaId || cantidad<1)return;

        const selectedOption=document.querySelector(`#mediaSelect option[value="${mediaId}"]`);
        const modelo=selectedOption.dataset.modelo;
        const nombre=selectedOption.dataset.nombre;

        await fetch(`${API_BASE}/ventas`,{
            method: 'PATH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({cantidad})
        });

        form.reset();
        await cargarVentas();
        await cargarOpcionesStock();
    });
});

async function cargarOpcionesStock() {
    const res=await fetch(`${API_BASE}/stock`);
    const stock=await res.json();
    const select=document.getElementById('mediaSelect');
    select.innerHTML='<option value="">Seleccionar</option>';

    stock.forEach(media=>{
        select.innerHTML+=`
            <option value="${media._id}" data-modelo="${media.modelo}" data-nombre="${media.nombre}">
                ${media.modelo} - ${media.nombre} (${media.cantidad})
            </option>
        `;
    });
}

async function cargarVentas() {
    const res=await fetch(`${API_BASE}/ventas`);
    const ventas=await res.json();
    
    const tbody=document.querySelector('#tablaVentas tbody');
    tbody.innerHTML='';

    ventas.forEach(v=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`
            <td>${v.modelo}</td>
            <td>${v.nombre}</td>
            <td>${v.cantidad}</td>
            <td>${new Date(v.fecha).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}