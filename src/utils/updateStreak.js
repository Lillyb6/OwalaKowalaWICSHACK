import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
}

export async function updateUserStreak(uid) {
  if (!uid) return;

  const statsRef = doc(db, "users", uid, "stats", "main");
  const today = getLocalDateKey();
  const yesterday = getYesterdayKey();

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(statsRef);

    if (!snap.exists()) {
      transaction.set(statsRef, {
        streakCount: 1,
        longestStreak: 1,
        lastActiveDate: today,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const data = snap.data();
    const lastActiveDate = data.lastActiveDate || null;
    const currentStreak = data.streakCount || 0;
    const longestStreak = data.longestStreak || 0;

    if (lastActiveDate === today) {
      return;
    }

    let newStreak = 1;

    if (lastActiveDate === yesterday) {
      newStreak = currentStreak + 1;
    }

    transaction.set(
      statsRef,
      {
        streakCount: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        lastActiveDate: today,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
}