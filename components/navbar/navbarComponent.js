const sessionActived = true

const btnTasksHTML = `<div class="justify-content-end"> <a class="btn btn-sm nav-btn" href="#" data-all-tasks>Ver todas las tareas</a> </div>`
const listUserActionsHTML = `<div class="justify-content-end" id="main_navbar_links"> <ul class="navbar-nav gap-md-3"><li class="nav-item"><a class="nav-link" href="#">Login</a></li> <li class="nav-item"><a class="nav-link" href="#">Registro</a></li></ul></div>`

// Define componente <main-navbar>
class Navbar extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-md navbar-dark border rounded px-3 py-2 mt-2 mb-2 main-navbar">
                <div class="container-fluid">
                    <picture>
                        <img class="logo" src="./assets/img/logo.png">
                    </picture>
                    ${sessionActived ?
                btnTasksHTML : listUserActionsHTML
            }
                </div>
            </nav>`
    }
}

customElements.define('main-navbar', Navbar)
