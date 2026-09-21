// adminAuth.js
// Shared guard for every admin-*.html page. An "admin" here is just a regular
// Firebase Auth user whose uid also has a document in the "admins" Firestore
// collection — there's no self-serve admin signup, so accounts only end up
// admins by someone manually adding that document (e.g. from the Firebase
// Console, or a trusted internal tool). Anyone signed in who ISN'T in that
// collection is signed out and bounced back to admin-login.html.
//
// Firestore rules should mirror this — e.g.:
//   match /admins/{uid} {
//     allow read: if request.auth != null && request.auth.uid == uid;
//     allow write: if false; // only add admins via the Firebase Console
//   }

import { auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Call this at the top of every protected admin page.
// onReady(user, adminData) fires only once the admin check has passed.
export function requireAdmin(onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = 'admin-login.html';
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'admins', user.uid));
      if (!snap.exists()) {
        await signOut(auth);
        window.location.href = 'admin-login.html?denied=1';
        return;
      }
      onReady(user, snap.data());
    } catch (err) {
      console.error('Admin check failed:', err);
      await signOut(auth);
      window.location.href = 'admin-login.html?denied=1';
    }
  });
}

export async function adminLogout() {
  await signOut(auth);
  window.location.href = 'admin-login.html';
}

export function initials(nameOrEmail) {
  if (!nameOrEmail) return '—';
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Fills in the topbar bell badge and the per-link sidebar badges with counts
// of pending deposits/withdrawals and matured (unpaid) enrollments. Call this
// after requireAdmin() succeeds, on every admin page (they all carry the same
// markup: #bellBadge, #depositsBadge, #withdrawalsBadge, #maturedBadge).
export async function loadNotificationBadges() {
  try {
    const depositsQ = query(collection(db, 'deposits'), where('status', '==', 'pending'));
    const withdrawalsQ = query(collection(db, 'withdrawals'), where('status', '==', 'pending'));
    const activeEnrollQ = query(collection(db, 'enrollments'), where('status', '==', 'active'));

    const [depositsCount, withdrawalsCount, activeEnrollSnap] = await Promise.all([
      getCountFromServer(depositsQ).then(s => s.data().count),
      getCountFromServer(withdrawalsQ).then(s => s.data().count),
      getDocs(activeEnrollQ)
    ]);

    // Maturity depends on startedAt + term, which isn't something Firestore
    // can filter on directly, so this counts matured ones client-side.
    const now = Date.now();
    const maturedCount = activeEnrollSnap.docs.filter(d => {
      const e = d.data();
      if (!e.startedAt?.toDate) return false;
      const maturityMs = e.startedAt.toDate().getTime() + Number(e.term || 0) * 86400000;
      return now >= maturityMs;
    }).length;

    const total = depositsCount + withdrawalsCount + maturedCount;
    const bellBadge = document.getElementById('bellBadge');
    if (bellBadge) {
      bellBadge.textContent = total > 99 ? '99+' : total;
      bellBadge.style.display = total > 0 ? 'flex' : 'none';
    }

    const depositsBadge = document.getElementById('depositsBadge');
    if (depositsBadge) {
      depositsBadge.textContent = depositsCount;
      depositsBadge.classList.toggle('show', depositsCount > 0);
    }

    const withdrawalsBadge = document.getElementById('withdrawalsBadge');
    if (withdrawalsBadge) {
      withdrawalsBadge.textContent = withdrawalsCount;
      withdrawalsBadge.classList.toggle('show', withdrawalsCount > 0);
    }

    const maturedBadge = document.getElementById('maturedBadge');
    if (maturedBadge) {
      maturedBadge.textContent = maturedCount;
      maturedBadge.classList.toggle('show', maturedCount > 0);
    }
  } catch (err) {
    console.error('Failed to load notification badges:', err);
  }
}






// adminAuth.js
// Shared guard for every admin-*.html page. An "admin" here is just a regular
// Firebase Auth user whose uid also has a document in the "admins" Firestore
// collection — there's no self-serve admin signup, so accounts only end up
// admins by someone manually adding that document (e.g. from the Firebase
// Console, or a trusted internal tool). Anyone signed in who ISN'T in that
// collection is signed out and bounced back to admin-login.html.
//
// Firestore rules should mirror this — e.g.:
//   match /admins/{uid} {
//     allow read: if request.auth != null && request.auth.uid == uid;
//     allow write: if false; // only add admins via the Firebase Console
//   }

// import { auth, db } from "../firebase.js";
// import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// // Call this at the top of every protected admin page.
// // onReady(user, adminData) fires only once the admin check has passed.
// export function requireAdmin(onReady) {
//   onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//       window.location.href = './admin-login.html';
//       return;
//     }
//     try {
//       const snap = await getDoc(doc(db, 'admins', user.uid));
//       if (!snap.exists()) {
//         await signOut(auth);
//         window.location.href = './admin-login.html?denied=1';
//         return;
//       }
//       onReady(user, snap.data());
//     } catch (err) {
//       console.error('Admin check failed:', err);
//       await signOut(auth);
//       window.location.href = './admin-login.html?denied=1';
//     }
//   });
// }

// export async function adminLogout() {
//   await signOut(auth);
//   window.location.href = './admin-login.html';
// }

// export function initials(nameOrEmail) {
//   if (!nameOrEmail) return '—';
//   const parts = nameOrEmail.trim().split(/\s+/);
//   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
//   return (parts[0][0] + parts[1][0]).toUpperCase();
// }