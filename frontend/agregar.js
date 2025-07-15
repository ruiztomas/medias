const API_BASE='http://localhost:3000/api';

document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('formAgregarMedia');
    if(!form) return;

    const pica=window.pica();

    async function redimensionarImagen(file){
        const img=new Image();
        img.src=URL.createObjectURL(file);
        await img.decode();
        
        const MAX_WIDTH=800;
        const scale=MAX_WIDTH/img.width;
        const canvas=document.createElement('canvas');
        canvas.width=MAX_WIDTH;
        canvas.height=img.height*scale;

        await pica.resize(img, canvas);

        const resizeBlob=await pica.toBlob(canvas, 'image/jpeg', 0.8);
        URL.revokeObjectURL(img.src);
        return new File([resizeBlob], file.name, {type:'image/jpeg'});
    }

    form.addEventListener('submit',async(e)=>{
        e.preventDefault();

        const modelo=document.getElementById('modelo').value;
        const nombre=document.getElementById('nombre').value.trim();
        const cantidad=parseInt(document.getElementById('cantidad').value);
        const imagenInput=document.getElementById('imagen');

        const imagenRedimensionada=await redimensionarImagen(imagenInput.files[0]);

        if (!modelo || !nombre || cantidad < 1 || imagenInput.files.length === 0)return;
        const formData=new FormData();
        formData.append('modelo', modelo);
        formData.append('nombre', nombre);
        formData.append('cantidad', cantidad);
        formData.append('imagen', imagenRedimensionada);

        await fetch(`${API_BASE}/stock`,{
            method: 'POST',
            body: formData,
        });
        e.target.reset();
    })
})