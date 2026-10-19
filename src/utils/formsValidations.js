// Validaciones para el formulario.

function returnCustomAlert(mensaje){
	return `
	<small class="d-block mt-1" style="color: var(--bs-warning); font-size: 0.75rem;"><i class="bi bi-exclamation-triangle-fill"></i> ${mensaje}</small>`
}

function generateAlert(esValido, input, mensaje) {
	const padre = input.closest('div');
	let alerta = padre.querySelector('.alerta-validacion');

	if (!esValido) {
				// Crear la alerta si no existe.
				if (!alerta) {
					alerta = document.createElement('div');
					alerta.classList.add('alerta-validacion');
					padre.appendChild(alerta);
					input.classList.add('border')
					input.classList.add('border-warning')
				}
			
				alerta.innerHTML = returnCustomAlert(
					mensaje
				);

				return false;
			}
			//  elimina la alerta
			if (alerta) {
				input.classList.remove('border')
				input.classList.remove('border-warning')
				alerta.remove();
			}
			// Agrega indicador de input correcto.
			input.classList.add('border')
			input.classList.add('border-success')
			return true;
}

export function titleValidation(element) {
	const input = element;
	if (!input) return;

	const validar = () => {
		const esValido = input.value.length <= 50 && input.value.length > 0;
        // Cambiar a agregar un elemento abajo del input.
		const mensaje = "El asunto no puede exceder los 50 caracteres, ni estar vacio."
		return generateAlert(esValido, input, mensaje);
	};

	input.addEventListener("change", validar);
	return validar;
}


export function descriptionValidation(element) {
	const input = element;
	if (!input) return;

	const validar = () => {
		const esValido = input.value.length <= 500 && input.value.length > 0;
        // Cambiar a agregar un elemento abajo del input.
		const mensaje = "El asunto no puede exceder los 500 caracteres, ni estar vacio."
		return generateAlert(esValido, input, mensaje);
	};

	input.addEventListener("change", validar);
	return validar;
}

export function timeValidation(campo) {
	const input = getElement(campo, "#asunto");
	if (!input) return;

	const validar = () => {
		const esValido = input.value !== 'Selecciona un asunto';
        const mensaje = 'Seleccione un asunto.'
		// Agrega Alerta
		return generateAlert(esValido, input, mensaje)
	};

	input.addEventListener("change", validar);
	return validar;
}
