import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "./firebase-config";

const db = getFirestore(app)

const addSiteFirestore = async (site) => {
    console.log('Adding site to Firestore');
    try {
        await setDoc(doc(db, "sites", site.id), {
            name: site.name,
            tags: site.tags,
        });
        console.log('Collection updated successfully');
    } catch (error) {
        console.error('Error updating collection:', error);
    }
}

export { addSiteFirestore };