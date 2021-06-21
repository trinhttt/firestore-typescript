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
        await user.set(newUser)//??return or not
    } catch (error) {
        throw error
    }
}

export const deleteUserInFirestore = async (userDoc: UserRecord) => {
    try {
        const user = db.collection('users').doc(userDoc.uid)
        return await user.delete()
    }
    catch (error) {
        throw error
    }
}

export const deleteEntries = async (userDoc: UserRecord) => {
    try {
        const entryRef = db.collection('entries')
        const entries = await entryRef.where('userId', '==', userDoc.uid).get()

        entries.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            doc.ref.delete()
        });
    }
    catch (error) {
        throw error
    }
}