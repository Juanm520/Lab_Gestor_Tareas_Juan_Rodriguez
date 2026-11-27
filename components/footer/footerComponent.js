// Componente <main-footer>
class Footer extends HTMLElement {

    connectedCallback() {
        const year = new Date().getFullYear()

        this.innerHTML = `
            <div class="main-footer border rounded px-3 py-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="footer-icon d-flex align-items-center justify-content-center rounded" aria-hidden="true">
                        <!-- Icono calendario -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="17" rx="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                        </svg>
                    </span>
                    <small>© ${year} Gestor de tareas · Juan M Rodríguez Lanza &lt;JuanM520&gt;</small>
                </div>
                <ul class="nav gap-3">
                <li class="nav-item"><a class="footer-link" href="#">Contacto</a></li>
                <li class="nav-item"><a class="footer-link" href="#">Privacidad</a></li>
                <li class="nav-item"><a class="footer-link" href="#">Acerca de</a></li>
                </ul>
            </div>`
    }
}

customElements.define('main-footer', Footer)
