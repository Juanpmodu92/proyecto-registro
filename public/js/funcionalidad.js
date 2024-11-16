
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.style.display = 'block';
        
        if (response.ok) {
            mensajeDiv.className = 'mensaje success';
            mensajeDiv.textContent = data.message;
            document.getElementById('registroForm').reset();
        } else {
            mensajeDiv.className = 'mensaje error';
            mensajeDiv.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.style.display = 'block';
        mensajeDiv.className = 'mensaje error';
        mensajeDiv.textContent = 'Error al procesar el registro';
    }
});
