const res=await fetch(`${API_BASE}/stock`);
const stock=await res.json();
const tbody=document.querySelector('#tablaResumen tbody');
let total=0;

stock.forEach(item=>{
    const subtotal=item.cantidad+item.precioUnitario;
    total+=subtotal;

    const tr=document.createElement('tr');
    tr.innerHTML=`
        <td>${item.modelo}></td>
        <td>${item.nombre}<>/td>
        <td>${item.cantidad}></td>
        <td>${item.precioUnitario.toFixed(2)}></td>
        <td>${subtotal.toFixed(2)}></td>
    `;
    tbody.appendChild(tr);
});

document.getElementById('totalGeneral').textContent=`Total general: $${total.toFixed(2)}`;