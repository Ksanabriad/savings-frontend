import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas: se prerenderizan
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },

  // Rutas dinámicas con parámetros: renderizado en el servidor bajo demanda
  { path: ':username', renderMode: RenderMode.Server },
  { path: ':username/dashboard', renderMode: RenderMode.Server },
  { path: ':username/usuarios', renderMode: RenderMode.Server },
  { path: ':username/finanzas', renderMode: RenderMode.Server },
  { path: ':username/conceptos', renderMode: RenderMode.Server },
  { path: ':username/nueva-finanza', renderMode: RenderMode.Server },
  { path: ':username/editar-finanza/:id', renderMode: RenderMode.Server },
  { path: ':username/new-usuario', renderMode: RenderMode.Server },
  { path: ':username/editar-usuario/:id', renderMode: RenderMode.Server },
  { path: ':username/historial-informes', renderMode: RenderMode.Server },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
