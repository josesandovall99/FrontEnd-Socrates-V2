import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `


<div class="log">
<main class="login-container">
        <div class="left-panel">
            <div class="header">
                <h1>Aplicacion Socrates</h1>
                <a class="official-tag" href="https://servinetcomunicaciones-sas.com/">Pagina Oficial</a>
            </div>
            <!-- Background image is handled in CSS -->
        </div>
        
        <div class="right-panel">
            <img src="../assets/servinet.png" alt="Servinet Logo" class="logo">
            
            <div class="welcome-section">
                <h2>Bienvenido</h2>
                <p>Empleado de Servinet</p>
            </div>
            
            <form class="login-form"(ngSubmit)="login()">
                <div class="form-group">
                    <input type="text" id="username" placeholder="Nombre de Usuario" [(ngModel)]="numeroDocumento" name="numeroDocumento" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" placeholder="Contraseña" [(ngModel)]="password" name="password" required>
                </div>
                <button type="submit" class="login-button">Ingresar</button>
            </form>
            
            <div class="social-links">
                <a href="#" aria-label="Facebook"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png" alt="Facebook"></a>
                <a href="#" aria-label="Instagram"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png" alt="Instagram"></a>
                <a href="#" aria-label="Twitter"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023_%28white%29.png/600px-X_logo_2023_%28white%29.png" alt="X (Twitter)"></a>
                <a href="#" aria-label="LinkedIn"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png" alt="LinkedIn"></a>
            </div>
        </div>
    </main>
</div>

`,
    styles: [`
    .log {
    --primary-blue: #1e2875;
    --secondary-blue: #38b6ff;
    --text-dark: #333;
    --text-light: #666;
    --white: #fff;
    --input-bg: #f8f9fa;
    --button-hover: #1a237e;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

body {
    min-height: 100vh;
    display: flex;
    background-color: var(--white);
}

.login-container {
    display: flex;
    width: 100%;
    max-width: 1500px;
    margin: auto;
    height: 100vh;
}

.left-panel {
    flex: 1;
    background-image: url('/assets/background.png');
    background-size: cover;
    background-position: center;
    padding: 2rem;
    position: relative;
    color: var(--white);
    margin: 1rem;
    margin-left:1px;
    overflow: hidden;
    border-radius: 30px;
    clip-path: path('M0,30 C0,13.4315 13.4315,0 30,0 L90%,0 C95%,0 100%,13.4315 100%,30 L95%,100% C90%,100% 80%,100% 70%,100% L30,100% C13.4315,100% 0,86.5685 0,70 L0,30');
}

.left-panel::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: inherit;
    z-index: -1;
    border-radius: inherit;
}

.header {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: 1;
}

.header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: white
}

.official-tag {
    background-color: var(--white);
    color: var(--primary-blue);
    padding: 0.25rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    margin-left: 45%
}

.right-panel {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}

.logo {
    width: 200px;
    height: auto;
    margin-bottom: 2rem;
}

.welcome-section {
    text-align: center;
    margin-bottom: 2rem;
}

.welcome-section h2 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.welcome-section p {
    color: var(--text-light);
    font-size: 1.125rem;
}

.login-form {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: var(--input-bg);
    font-size: 1rem;
}

.form-group input::placeholder {
    color: var(--text-light);
}

.login-button {
    width: 100%;
    padding: 1rem;
    background-color: var(--primary-blue);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: var(--button-hover);
}

.social-links {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f0f2f5;
    transition: transform 0.3s ease;
}

.social-links a:hover {
    transform: translateY(-2px);
}

.social-links img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
    }
    
    .left-panel {
        height: 200px;
        margin: 0;
        border-radius: 0 0 30px 30px;
        clip-path: path('M0,0 L100%,0 L100%,70% C100%,86.5685 86.5685,100% 70%,100% L30%,100% C13.4315,100% 0,86.5685 0,70% L0,0');
    }
    
    .right-panel {
        padding: 2rem 1rem;
    }
    
    .welcome-section h2 {
        font-size: 2rem;
    }
}
    `]
})
export class LoginComponent {
    numeroDocumento: string = '123456789';
    password: string = '123456789';
    message: string = '';

    constructor(private authService: AuthService, private router: Router) { }
    /*
      login() {//LOGIN CON 123
        // Verifica si el username y el password son "123"
        if (this.numeroDocumento === '123456789' && this.password === '123456789') {
          // Simula una respuesta exitosa del servidor
          const response = {
            message: 'Login successful',
            userType: 'admin'  // Puedes cambiar a 'student' o 'teacher' según necesites
          };
      
          localStorage.setItem('authToken', 'true'); // Guarda el token
          localStorage.setItem('userType', response.userType); // Guarda el tipo de usuario
      
          // Actualiza el estado de autenticación en AuthService
          this.authService.updateAuthStatus(true);
      
          // Redirige al dashboard adecuado según el tipo de usuario
          if (response.userType === 'admin') {
            this.router.navigate(['/empleado-dashboard']);
          } else if (response.userType === 'Secretaria') {
            this.router.navigate(['/solicitud-servicio']);
          }
        } else {
          // Si las credenciales son incorrectas
          this.message = 'Credenciales ERRONEAS';
        }
      }
  */

      
    //LOGIN CON TIPOS DE CARGO
    login() {
        this.authService.login(this.numeroDocumento, this.password).subscribe(
            response => {
                console.log(response.message)
                console.log(response.userType)
                if (response.message === 'Login successful') {
                    localStorage.setItem('authToken', 'true'); // Guarda el token
                    localStorage.setItem('userType', response.userType); // Guarda el tipo de usuario

                    // Actualiza el estado de autenticación en AuthService
                    this.authService.updateAuthStatus(true);

                    // Redirige al dashboard adecuado según el tipo de usuario
                    if (response.userType === 'administrador') {
                        this.router.navigate(['/empleado-dashboard']);
                    } else if (response.userType === 'secretaria') {
                        this.router.navigate(['/solicitudservicio']);
                    }
                } else {
                    this.message = 'Credenciales ERRONEAS';
                }
            },
            error => {
                console.error('Error:', error);
                this.message = 'Error en el servidor o credenciales incorrectas.';
            }
        );
    }


    isPasswordVisible: boolean = false;

    togglePassword(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

}