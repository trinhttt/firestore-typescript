import { db } from "../../config/firebase";
import { User } from "../../interfaces/user";
import { UserRecord } from 'firebase-functions/lib/providers/auth';

export const createUserInFirestore = async (userDoc: UserRecord) => {
    try {
        let newUser: User = {
            userId: userDoc.uid,
            email: userDoc.email,
            createdAt: new Date().toISOString(),
        }
        const user = db.collection('users').doc()
        return await user.set(newUser)//??return or not
    } catch (error) {
        throw error
    }
}

export const deleteUserInFirestore = async (userDoc: UserRecord) => {
    try {
        //userDoc.uid
        const userRef = db.collection('users')
        const users = await userRef.where('userId', '==', userDoc.uid).get()
        users.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            doc.ref.delete()//??doc.ref
          });
    }
    catch (error) {
        throw error
    }
}