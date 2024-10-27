import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "./firebase-config";

const db = getFirestore(app);

const getAllSitesFirestore = async () => {
    console.log('Getting all sites from Firestore');
    try {
        const querySnapshot = await getDocs(collection(db, "sites"));
        const sites = [];
        querySnapshot.forEach((doc) => {
            sites.push({ id: doc.id, ...doc.data() });
        });
        console.log('Sites retrieved successfully');
        return sites;
    } catch (error) {
        console.error('Error getting sites:', error);
        return [];
    }
};

export { getAllSitesFirestore };