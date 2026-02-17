import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Auth } from './auth';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../models/usuarios.model';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;
  let usuariosService: UsuariosService;

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, UsuariosService]
    });

    service = TestBed.inject(Auth);
    usuariosService = TestBed.inject(UsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ==================== TESTS DE LOGIN ====================

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar sesión correctamente y almacenar las credenciales en localStorage', (done) => {
    const mockUser: Usuario = {
      username: 'testuser',
      email: 'test@example.com',
      password: '',
      perfil: { id: 1, nombre: 'USER' }
    };

    service.login('testuser', 'password123').subscribe(result => {
      expect(result).toBe(true);
      expect(localStorage.getItem('username')).toBe('testuser');
      expect(localStorage.getItem('role')).toBe('USER');
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
    req.flush(mockUser);
  });

  it('debería iniciar sesión como admin y almacenar el rol ADMIN', (done) => {
    const mockAdmin: Usuario = {
      username: 'admin',
      email: 'admin@example.com',
      password: '',
      perfil: { id: 2, nombre: 'ADMIN' }
    };

    service.login('admin', 'password123').subscribe(result => {
      expect(result).toBe(true);
      expect(localStorage.getItem('username')).toBe('admin');
      expect(localStorage.getItem('role')).toBe('ADMIN');
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/login');
    req.flush(mockAdmin);
  });

  it('debería devolver false en caso de fallo de inicio de sesión', (done) => {
    service.login('wronguser', 'wrongpassword').subscribe(result => {
      expect(result).toBe(false);
      expect(localStorage.getItem('username')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/login');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('debería devolver false cuando el inicio de sesión devuelve usuario nulo', (done) => {
    service.login('testuser', 'password123').subscribe(result => {
      expect(result).toBe(false);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/login');
    req.flush(null);
  });

  it('debería manejar el error de inicio de sesión y devolver false', (done) => {
    service.login('testuser', 'password123').subscribe(result => {
      expect(result).toBe(false);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/login');
    req.error(new ErrorEvent('Network error'));
  });

  // ==================== TESTS DE LOGOUT ====================

  it('debería cerrar sesión y limpiar localStorage', () => {
    // Simular usuario logueado
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('role', 'USER');

    service.logout();

    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  // ==================== TESTS DE AUTENTICACIÓN ====================

  it('debería devolver true si el usuario está autenticado', () => {
    localStorage.setItem('username', 'testuser');

    expect(service.isAuthenticated()).toBe(true);
  });

  it('debería devolver false si el usuario no está autenticado', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debería devolver false si el nombre de usuario es una cadena vacía', () => {
    localStorage.setItem('username', '');

    expect(service.isAuthenticated()).toBe(false);
  });

  // ==================== TESTS DE ADMIN ====================

  it('debería devolver true si el usuario es admin', () => {
    localStorage.setItem('role', 'ADMIN');

    expect(service.isAdmin()).toBe(true);
  });

  it('debería devolver false si el usuario no es admin', () => {
    localStorage.setItem('role', 'USER');

    expect(service.isAdmin()).toBe(false);
  });

  it('debería devolver false si no hay rol establecido', () => {
    expect(service.isAdmin()).toBe(false);
  });

  // ==================== TESTS DE GETTERS ====================

  it('debería obtener el rol de localStorage', () => {
    localStorage.setItem('role', 'ADMIN');

    expect(service.getRole()).toBe('ADMIN');
  });

  it('debería devolver null si no hay rol en localStorage', () => {
    expect(service.getRole()).toBeNull();
  });

  it('debería obtener el nombre de usuario de localStorage', () => {
    localStorage.setItem('username', 'testuser');

    expect(service.getUsername()).toBe('testuser');
  });

  it('debería devolver null si no hay nombre de usuario en localStorage', () => {
    expect(service.getUsername()).toBeNull();
  });
});
