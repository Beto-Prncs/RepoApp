import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

interface AccountData {
 firstName: string;
 lastName: string;
 email: string;
 phone: string;
 username: string;
 password: string;
 department: string;
 adminLevel: string;
}

@Component({
 selector: 'app-create-accounts',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './create-accounts.component.html',
 styleUrl: './create-accounts.component.css'
})
export class CreateAccountsComponent {
 selectedType: 'worker' | 'admin' | null = null;
 showPassword: boolean = false;
 isLoading: boolean = false;
 showSuccessMessage: boolean = false;
 showErrorMessage: boolean = false;

 accountData: AccountData = {
   firstName: '',
   lastName: '',
   email: '',
   phone: '',
   username: '',
   password: '',
   department: '',
   adminLevel: ''
 };

 constructor(
   private router: Router,
   private auth: Auth,
   private firestore: Firestore
 ) {}

 selectAccountType(type: 'worker' | 'admin'): void {
   this.selectedType = type;
 }

 togglePasswordVisibility(): void {
   this.showPassword = !this.showPassword;
 }

 async onSubmit(form: NgForm): Promise<void> {
   if (form.invalid || !this.selectedType) return;

   try {
     this.isLoading = true;
     const userCredential = await createUserWithEmailAndPassword(
       this.auth,
       this.accountData.email,
       this.accountData.password
     );

     await setDoc(doc(this.firestore, 'Usuario', userCredential.user.uid), {
       Nombre: `${this.accountData.firstName} ${this.accountData.lastName}`,
       Correo: this.accountData.email,
       IdUsuario: userCredential.user.uid,
       Foto_Perfil: '',
       Rol: this.selectedType,
       Telefono: this.accountData.phone,
       Departamento: this.accountData.department || null,
       NivelAdmin: this.accountData.adminLevel || null,
       Username: this.accountData.username
     });

     this.showSuccessMessage = true;
     setTimeout(() => {
       this.showSuccessMessage = false;
     }, 3000);

     this.resetForm();
     form.resetForm();

   } catch (error) {
     console.error('Error al crear la cuenta:', error);
     this.showErrorMessage = true;
     setTimeout(() => {
       this.showErrorMessage = false;
     }, 3000);
   } finally {
     this.isLoading = false;
   }
 }

 resetForm(): void {
   this.accountData = {
     firstName: '',
     lastName: '',
     email: '',
     phone: '',
     username: '',
     password: '',
     department: '',
     adminLevel: ''
   };
 }

 goBack(): void {
   this.router.navigate(['/admin1']);
 }
}