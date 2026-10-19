export function charCountingHTML(elemento, textarea, maxCaracteres) {

    if (!elemento || !textarea) return;

    const remaining = maxCaracteres - textarea.value.length
    elemento.textContent = String(remaining);
}