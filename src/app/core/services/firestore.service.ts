import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FireStoreService {
  constructor(private firestore: Firestore) {}

  async getCollection(collectionPath: string): Promise<any[]> {
    const usersCollection: CollectionReference = collection(
      this.firestore,
      collectionPath
    );
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersList;
  }

  async createDocument(docPath: string, data: any) {
    const docRef = doc(this.firestore, docPath);
    await setDoc(docRef, data);
  }

  async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  async getDocument(docPath: string) {
    const docRef = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  async updateDocument(collectionPath: string, data: any) {
    const docRef = doc(this.firestore, collectionPath);
    await setDoc(docRef, data, { merge: true });
    // await updateDoc(docRef, data);
  }

  async deleteDocument(docPath: string) {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }
}