import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function updateUserSubscription(userId, subscriptionStatus) {
  try {
    await setDoc(doc(db, 'users', userId), {
      subscriptionStatus: subscriptionStatus,
      subscriptionDate: new Date().toISOString()
    }, { merge: true });
    console.log('User subscription updated successfully');
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

export async function getUserSubscriptionStatus(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().subscriptionStatus;
    } else {
      return 'free'; // Default to free if no subscription info found
    }
  } catch (error) {
    console.error('Error getting user subscription status:', error);
    throw error;
  }
}