// Validaciones para formularios.
// Evita la escritura de listeners de los inputs. 
// Solo implementar listener en submit.

function returnCustomAlert(mensaje) {
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

		return
	}
	//  Elimina la alerta
	if (alerta) {
		input.classList.remove('border')
		input.classList.remove('border-warning')
		alerta.remove();
	}
	// Agrega indicador de input correcto.
	input.classList.add('border')
	input.classList.add('border-success')
	return
}

export function titleValidation(element) {
	const input = element;
	if (!input) return;

	const validar = () => {
		const esValido = input.value.length <= 50 && input.value.length > 0;
		// Cambiar a agregar un elemento abajo del input.
		const mensaje = "El asunto no puede exceder los 50 caracteres, ni estar vacio."
		generateAlert(esValido, input, mensaje);
		return esValido
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
		generateAlert(esValido, input, mensaje);
		return esValido
	};

	input.addEventListener("change", validar);
	return validar;
}

export function priorityValidation(form) {
	const input = form;
	if (!input) return;

	const radioBtns = input.querySelectorAll('input[type="radio"]')

	const validar = () => {
		const priority = new FormData(input).get('priority');
		const esValido = priority !== null;
		const mensaje = 'Seleccione una prioridad.'
		// Agrega Alerta
		generateAlert(esValido, radioBtns[0], mensaje)
		return esValido
	};

	radioBtns.forEach(buttom => {
		buttom.addEventListener('change', () => validar())
	});

	return validar
}

export function timeValidation(element) {
	const input = element
	if (!input) return;

	const validar = () => {
		const esValido = input.value !== '';
		const mensaje = 'Debe ingresar una hora de finalización.'
		// Agrega Alerta
		generateAlert(esValido, input, mensaje)
		return esValido
	};

	input.addEventListener("change", validar);
	return validar;
}

export function submitValidations(listValidations, form) {
	// Lista de las validaciones
	const validations = listValidations
	const validar = () => {
		// Itera la lista para obtener las validaciones.
		const isValidateList = validations.map((validation) => validation())
		// Valida la lista de validaciones. Si alguno es falso, no es valido.
		const esValido = !isValidateList.some(validation => validation === false)
		const mensaje = 'Complete todos los datos antes de enviar.'

		// Agrega Alerta
		generateAlert(esValido, form, mensaje)

		return esValido
	};

	return validar
}
