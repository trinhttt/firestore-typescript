import { db } from "../../config/firebase";
import { EventContext, } from "firebase-functions";
import { Entry } from "../../interfaces/entry";
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

const updateURLOnEntry = async (objectMetadata: ObjectMetadata, context: EventContext) => {
    const imageUrl = objectMetadata.mediaLink
    const batch = db.batch()
    try {
        const entries = await db
            .collection('entries')
            .where('imageUrl', '==', imageUrl)
            .get()

        const entryObject: Entry = {
            imageUrl: undefined
        }
        entries.forEach((entry: any) => batch.update(entry, entryObject))
        await batch.commit()
    }
    catch (error) {
        console.log(error);
    }
}

export default updateURLOnEntry