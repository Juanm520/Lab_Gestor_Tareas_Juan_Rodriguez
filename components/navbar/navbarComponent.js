// Define componente <main-navbar>
class Navbar extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-md navbar-dark border rounded px-3 py-2 mt-2 mb-2 main-navbar">
                <div class="container-fluid p-0 gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <a class="navbar-brand m-0 nav-icon d-flex align-items-center justify-content-center rounded" href="#" aria-label="Inicio">
                            <!-- Icono calendario -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="17" rx="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                            </svg>
                        </a>
                        <a class="btn btn-sm nav-btn" href="#" data-all-tasks>Ver todas las tareas</a>
                    </div>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main_navbar_links"
                        aria-controls="main_navbar_links" aria-expanded="false" aria-label="Mostrar menú">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-end" id="main_navbar_links">
                        <ul class="navbar-nav gap-md-3">
                            <li class="nav-item"><a class="nav-link" href="#">Login</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Registro</a></li>
                        </ul>
                    </div>
                </div>
            </nav>`
    }
}

customElements.define('main-navbar', Navbar)
