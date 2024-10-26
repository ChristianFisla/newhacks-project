import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "./firebase-config";

const db = getFirestore(app)

const addUserFirestore = async (site) => {
    try {
        await setDoc(doc(db, "sites", "test"), {
            name: "site.name"
        });
        console.log('Collection updated successfully');
    } catch (error) {
        console.error('Error updating collection:', error);
    }
}

export { addUserFirestore };
