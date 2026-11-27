import { statsController } from "./statsController.js";
import { EVENTS, on } from "../../utils/events.js";

// Define componente <tasks-stats>
class Stats extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <article class="d-flex flex-column gap-3 w-100 stats">
                <div>
                    <h5 class="fw-bold m-0">Reportes de score</h5>
                    <small>Comparativa de tareas hechas vs no hechas.</small>
                </div>

                <div class="row g-3 m-0">
                    <div class="col-12 col-md-4 ps-md-0">
                        <div class="stat-card rounded p-3 h-100">
                            <small class="stat-label text-uppercase fw-bold">Hechas hoy</small>
                            <p class="stat-value m-0" data-stats-done>0</p>
                            <small class="stat-text" data-stats-done-text></small>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="stat-card rounded p-3 h-100">
                            <small class="stat-label text-uppercase fw-bold">No hechas hoy</small>
                            <p class="stat-value m-0" data-stats-not-done>0</p>
                            <small class="stat-text" data-stats-not-done-text></small>
                        </div>
                    </div>

                    <div class="col-12 col-md-4 pe-md-0">
                        <div class="stat-card rounded p-3 h-100">
                            <small class="stat-label text-uppercase fw-bold">Score del día</small>
                            <p class="stat-value m-0" data-stats-score>0%</p>
                            <div class="progress stat-progress my-1" role="progressbar" aria-label="Score del día"
                                aria-valuemin="0" aria-valuemax="100">
                                <div class="progress-bar stat-progress-bar" data-stats-bar style="width: 0%"></div>
                            </div>
                            <small class="stat-text" data-stats-score-text></small>
                        </div>
                    </div>
                </div>
            </article>`

        this.render()

        // Actualiza las estadisticas cuando se crea o cambia una tarea.
        this.offTaskCreated = on(EVENTS.TASK_CREATED, () => this.render())
        this.offTaskUpdated = on(EVENTS.TASK_UPDATED, () => this.render())
    }

    disconnectedCallback() {
        this.offTaskCreated?.()
        this.offTaskUpdated?.()
    }

    render() {
        statsController(this)
    }
}

customElements.define('tasks-stats', Stats)
