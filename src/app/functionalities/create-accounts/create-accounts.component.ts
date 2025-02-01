import { Component, NgZone, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, getDocs } from '@angular/fire/firestore';

interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  department: string;
  customDepartment?: string;
  adminLevel: string;
  customAdminLevel?: string;
}

@Component({
  selector: 'app-create-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-accounts.component.html',
  styleUrl: './create-accounts.component.css'
})
export class CreateAccountsComponent implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  private router = inject(Router);

  selectedType: 'worker' | 'admin' | null = null;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  formSubmitted: boolean = false;
  showCustomDepartment: boolean = false;
  showCustomAdminLevel: boolean = false;
  existingUsernames: string[] = [];
  departments: string[] = ['desarrollo', 'diseño', 'marketing', 'ventas', 'otro'];
  adminLevels: string[] = ['1', '2', '3', 'otro'];

  accountData: AccountData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    department: '',
    customDepartment: '',
    adminLevel: '',
    customAdminLevel: ''
  };

  constructor() {} // Constructor vacío ya que usamos inject()

  ngOnInit() {
    this.ngZone.run(() => {
      this.initializeData();
    });
  }

  private async initializeData() {
    await Promise.all([
      this.loadExistingUsernames(),
      this.loadCustomDepartmentsAndLevels()
    ]);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  selectAccountType(type: 'worker' | 'admin'): void {
    this.ngZone.run(() => {
      this.selectedType = type;
      this.formSubmitted = false;
      
      if (type === 'worker') {
        this.accountData.adminLevel = '';
        this.accountData.customAdminLevel = '';
      } else if (type === 'admin') {
        this.accountData.department = '';
        this.accountData.customDepartment = '';
      }
    });
  }

  private async loadExistingUsernames() {
    return this.ngZone.runTask(async () => {
      try {
        const usersRef = collection(this.firestore, 'Usuario');
        const querySnapshot = await getDocs(usersRef);
        this.existingUsernames = querySnapshot.docs
          .map(doc => doc.data()['Username'])
          .filter(username => username);
      } catch (error) {
        console.error('Error loading usernames:', error);
      }
    });
  }

  private async loadCustomDepartmentsAndLevels() {
    return this.ngZone.runTask(async () => {
      try {
        const customRef = collection(this.firestore, 'CustomFields');
        const querySnapshot = await getDocs(customRef);
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data['Tipo'] === 'Departamento' && !this.departments.includes(data['Valor'])) {
            this.departments = [...this.departments, data['Valor']];
          }
          if (data['Tipo'] === 'NivelAdmin' && !this.adminLevels.includes(data['Valor'])) {
            this.adminLevels = [...this.adminLevels, data['Valor']];
          }
        });
      } catch (error) {
        console.error('Error loading custom fields:', error);
      }
    });
  }

  private async saveCustomField(type: string, value: string) {
    return this.ngZone.runTask(async () => {
      try {
        const customRef = collection(this.firestore, 'CustomFields');
        await setDoc(doc(customRef), {
          Tipo: type === 'department' ? 'Departamento' : 'NivelAdmin',
          Valor: value,
          FechaCreacion: new Date()
        });
      } catch (error) {
        console.error('Error saving custom field:', error);
        throw error;
      }
    });
  }

  private async isUsernameAvailable(username: string): Promise<boolean> {
    return !this.existingUsernames.includes(username);
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid || !this.selectedType) return;
    
    this.formSubmitted = true;
    
    if (!(await this.isUsernameAvailable(this.accountData.username))) {
      this.errorMessage = 'Este nombre de usuario ya está en uso';
      this.showErrorMessage = true;
      this.formSubmitted = false;
      setTimeout(() => {
        this.showErrorMessage = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    return this.ngZone.runTask(async () => {
      try {
        this.isLoading = true;
        this.errorMessage = '';

        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          this.accountData.email,
          this.accountData.password
        );

        let finalDepartment = this.accountData.department;
        if (this.accountData.department === 'otro' && this.accountData.customDepartment) {
          finalDepartment = this.accountData.customDepartment;
          await this.saveCustomField('department', finalDepartment);
          if (!this.departments.includes(finalDepartment)) {
            this.departments = [...this.departments, finalDepartment];
          }
        }

        let finalAdminLevel = this.accountData.adminLevel;
        if (this.accountData.adminLevel === 'otro' && this.accountData.customAdminLevel) {
          finalAdminLevel = this.accountData.customAdminLevel;
          await this.saveCustomField('adminLevel', finalAdminLevel);
          if (!this.adminLevels.includes(finalAdminLevel)) {
            this.adminLevels = [...this.adminLevels, finalAdminLevel];
          }
        }

        const userData = {
          Nombre: `${this.accountData.firstName} ${this.accountData.lastName}`,
          Correo: this.accountData.email,
          IdUsuario: userCredential.user.uid,
          Foto_Perfil: '',
          Rol: this.selectedType,
          Telefono: this.accountData.phone || '',
          Departamento: finalDepartment,
          NivelAdmin: finalAdminLevel,
          Username: this.accountData.username,
          FechaCreacion: new Date()
        };

        await setDoc(doc(this.firestore, 'Usuario', userCredential.user.uid), userData);
        
        this.existingUsernames.push(this.accountData.username);
        this.showSuccessMessage = true;
        
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);

        this.resetForm();
        form.resetForm();

      } catch (error: any) {
        console.error('Error detallado:', error);
        this.showErrorMessage = true;
        
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Este correo electrónico ya está registrado. Por favor, use otro correo.';
        } else {
          this.errorMessage = `Error al crear la cuenta: ${error.message}`;
        }
        
        setTimeout(() => {
          this.showErrorMessage = false;
          this.errorMessage = '';
        }, 3000);
      } finally {
        this.isLoading = false;
        this.formSubmitted = false;
      }
    });
  }

  resetForm(): void {
    this.ngZone.run(() => {
      this.accountData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        department: '',
        customDepartment: '',
        adminLevel: '',
        customAdminLevel: ''
      };
      this.showCustomDepartment = false;
      this.showCustomAdminLevel = false;
      this.formSubmitted = false;
      this.selectedType = null;
    });
  }

  goBack(): void {
    this.router.navigate(['/admin1']);
  }

  onDepartmentChange(event: any): void {
    this.ngZone.run(() => {
      this.showCustomDepartment = event.target.value === 'otro';
      if (event.target.value !== 'otro') {
        this.accountData.customDepartment = '';
      }
    });
  }

  onAdminLevelChange(event: any): void {
    this.ngZone.run(() => {
      this.showCustomAdminLevel = event.target.value === 'otro';
      if (event.target.value !== 'otro') {
        this.accountData.customAdminLevel = '';
      }
    });
  }
}