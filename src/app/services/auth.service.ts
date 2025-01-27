import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async getUserRole(uid: string): Promise<string> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.data()?.['role'] || 'user';
  }

  async isAdmin(uid: string): Promise<boolean> {
    const role = await this.getUserRole(uid);
    return role === 'admin';
  }
}