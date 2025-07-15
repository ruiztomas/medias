const API_BASE='http://localhost:3000/api';

document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('formAgregarMedia');
    if(!form) return;

    form.addEventListener('submit',async(e)=>{
        e.preventDefault();

        const modelo=document.getElementById('modelo').value;
        const nombre=document.getElementById('nombre').value;
        const cantidad=parseINt(document.getElementById('cantidad').value);
        const imagenInput=document.getElementById('imagen');
        const precio=parseFloat(document.getElementById('precio')?.value || 0);

        if (!modelo || !nombre || cantidad < 1 || imagenInput.files.length === 0)return;
        const formData=new FormData();
        formData.append('modelo', modelo);
        formData.append('nombre', nombre);
        formData.append('cantidad', cantidad);
        formData.append('imagen', imagenInput.files[0]);
        formData.append('precioUnitario', precio);

        await fetch(`${API_BASE}/stock`,{
            method: 'POST',
            body: formData,
        });
        e.target.reset();
    })
})