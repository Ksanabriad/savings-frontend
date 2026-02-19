import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente reutilizable para barras de filtrado.
 * Usa content projection para permitir filtros personalizados.
 */
@Component({
    selector: 'app-filter-bar',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    template: `
    <div class="filter-bar">
      <!-- Área para filtros personalizados -->
      <ng-content select="[filters]"></ng-content>
      
      <!-- Acciones de filtrado -->
      <div class="filter-actions">
        <button 
          mat-raised-button 
          color="warn" 
          (click)="onClear()"
          class="btn-clear">
          <mat-icon>clear</mat-icon>
          Limpiar
        </button>
        
        <!-- Acciones adicionales personalizadas -->
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .filter-bar {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 24px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
    }

    .filter-actions {
      display: flex;
      gap: 12px;
      margin-left: auto;
      align-items: center;
    }

    .filter-actions button {
      height: 56px;
    }

    .btn-clear {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class FilterBarComponent {
    @Output() clear = new EventEmitter<void>();

    onClear() {
        this.clear.emit();
    }
}
