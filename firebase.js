// firebase-config.js
// Central place to initialize Firebase. Every auth page imports { auth } from here
// so there's only one spot to paste your real project keys.
//
// Get these values from: Firebase Console > Project settings > General > Your apps > SDK setup and configuration
 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALdkHWF2iFVxOIkP9ISk-59ljiqbD7zWs",
  authDomain: "arcticmkt-35b28.firebaseapp.com",
  projectId: "arcticmkt-35b28",
  storageBucket: "arcticmkt-35b28.firebasestorage.app",
  messagingSenderId: "932609364114",
  appId: "1:932609364114:web:d6a930de9ac59cb8dcd64b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);








// RULES FOR FIRESTORE
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {

//     // Check whether the currently logged-in user is an admin
//     function isAdmin() {
//       return request.auth != null
//         && exists(
//           /databases/$(database)/documents/admins/$(request.auth.uid)
//         );
//     }

//     // USERS
//     match /users/{userId} {

//       allow read: if request.auth != null
//                   && (
//                     request.auth.uid == userId
//                     || isAdmin()
//                     // Lets referrals.html show a user the people who signed
//                     // up with their referral link. Note: this exposes the
//                     // whole referred user's document to the referrer at the
//                     // Firestore level — referrals.html only displays name
//                     // and signup date, but a technically savvy referrer
//                     // could inspect the raw query response and see more
//                     // (email, phone, balance). If that's a real concern,
//                     // move referral-safe fields into a separate, smaller
//                     // "public profile" document instead of relying on the
//                     // client to just not render the rest.
//                     || resource.data.referredBy == request.auth.uid
//                   );

//       // Account creation (registration) — the new doc's uid must match the
//       // signed-in user creating it.
//       allow create: if request.auth != null && request.auth.uid == userId;

//       // Updates: a user can edit their own profile, but CANNOT touch
//       // "balance" or "suspended" themselves — except that a balance
//       // DECREASE is allowed, since that's how withdrawing/enrolling in a
//       // plan deducts from their own wallet. Balance can only ever be
//       // INCREASED by an admin (e.g. approving a deposit or refunding a
//       // rejected withdrawal). Admins can change anything.
//       allow update: if request.auth != null && (
//         isAdmin()
//         || (
//           request.auth.uid == userId
//           && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['suspended'])
//           && (
//             !request.resource.data.diff(resource.data).affectedKeys().hasAny(['balance'])
//             || request.resource.data.balance < resource.data.balance
//           )
//         )
//       );

//       allow delete: if isAdmin();
//     }

//     // ADMINS
//     match /admins/{uid} {
//       allow read: if request.auth != null && request.auth.uid == uid;
//       allow write: if false; // only ever added via the Firebase Console
//     }

//     // CONTENT
//     match /content/{itemId} {
//       allow write: if isAdmin();
//       allow read: if request.auth != null;
//     }

//     // TICKETS
//     // A user can open their own ticket, read it back, and append their own
//     // reply messages (but never change status, priority, or anyone else's
//     // fields — only admins can do that, via admin-tickets.html).
//     match /tickets/{ticketId} {
//       allow create: if request.auth != null
//         && request.resource.data.requesterUid == request.auth.uid
//         && request.resource.data.status == 'open';

//       allow read: if request.auth != null
//         && (resource.data.requesterUid == request.auth.uid || isAdmin());

//       allow update: if isAdmin()
//         || (
//           request.auth != null
//           && request.auth.uid == resource.data.requesterUid
//           && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['messages', 'updatedAt'])
//         );

//       allow delete: if isAdmin();
//     }

//     // BROADCASTS
//     // Admin-authored messages, either to "all" users or to one specific
//     // user (targetUid). Only admins can send; a user can read a broadcast
//     // if it's addressed to everyone or specifically to them.
//     match /broadcasts/{broadcastId} {
//       allow create, update, delete: if isAdmin();
//       allow read: if request.auth != null
//         && (resource.data.type == 'all' || resource.data.targetUid == request.auth.uid || isAdmin());
//     }

//     // REFERRAL BONUSES
//     // A record of each referral bonus an admin has credited, so
//     // admin-referrals.html can show what's already been paid (and avoid
//     // double-crediting), and referrals.html can show the referrer their
//     // total. Only admins write these; a user can read ones where they're
//     // the referrer.
//     match /referralBonuses/{bonusId} {
//       allow create, update, delete: if isAdmin();
//       allow read: if request.auth != null
//         && (resource.data.referrerUid == request.auth.uid || isAdmin());
//     }

//     // DEPOSITS
//     // A user can create their own pending deposit request. They can never
//     // edit or delete it afterward — only an admin can move it to
//     // approved/rejected (admin-deposits.html).
//     match /deposits/{depositId} {
//       allow create: if request.auth != null
//         && request.resource.data.uid == request.auth.uid
//         && request.resource.data.status == 'pending'
//         && request.resource.data.amount is number
//         && request.resource.data.amount > 0;

//       allow read: if request.auth != null
//         && (resource.data.uid == request.auth.uid || isAdmin());

//       allow update, delete: if isAdmin();
//     }

//     // WITHDRAWALS
//     // A user can create their own pending withdrawal request, but only for
//     // an amount that does not exceed their CURRENT wallet balance at the
//     // moment of the request (checked here via get(), as a second layer on
//     // top of the client-side check).
//     match /withdrawals/{withdrawalId} {
//       allow create: if request.auth != null
//         && request.resource.data.uid == request.auth.uid
//         && request.resource.data.status == 'pending'
//         && request.resource.data.amount is number
//         && request.resource.data.amount > 0
//         && request.resource.data.amount <= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.balance;

//       allow read: if request.auth != null
//         && (resource.data.uid == request.auth.uid || isAdmin());

//       allow update, delete: if isAdmin();
//     }

//     // SAVINGS PLANS
//     // Admin-managed; any signed-in user can read them (to browse on
//     // plans.html), only admins can create/edit/delete them.
//     match /plans/{planId} {
//       allow read: if request.auth != null;
//       allow write: if isAdmin();
//     }

//     // ENROLLMENTS
//     // A user can enroll themselves in an active plan, for an amount within
//     // that plan's min/max AND within their current wallet balance. This is
//     // self-service (no admin approval step) since it's just moving the
//     // user's own already-verified funds from "wallet" into "a plan."
//     match /enrollments/{enrollmentId} {
//       allow create: if request.auth != null
//         && request.resource.data.uid == request.auth.uid
//         && request.resource.data.amount is number
//         && request.resource.data.amount > 0
//         && request.resource.data.amount <= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.balance
//         && request.resource.data.amount >= get(/databases/$(database)/documents/plans/$(request.resource.data.planId)).data.min
//         && request.resource.data.amount <= get(/databases/$(database)/documents/plans/$(request.resource.data.planId)).data.max;

//       allow read: if request.auth != null
//         && (resource.data.uid == request.auth.uid || isAdmin());

//       allow update, delete: if isAdmin();
//     }

//     // KYC SUBMISSIONS
//     // A user can submit their own KYC document (once created, they can't
//     // edit or delete it — only resubmit as a NEW document if rejected).
//     // Only admins can change status (admin-kyc.html).
//     match /kycSubmissions/{submissionId} {
//       allow create: if request.auth != null
//         && request.resource.data.uid == request.auth.uid
//         && request.resource.data.status == 'pending';

//       allow read: if request.auth != null
//         && (resource.data.uid == request.auth.uid || isAdmin());

//       allow update, delete: if isAdmin();
//     }

//     // Everything else is denied by default — Firestore rules are "deny
//     // unless explicitly allowed," so any collection without a match block
//     // above (including one you add later) is inaccessible until you add
//     // a rule for it here.
//   }
// }




// RULES FOR STORAGE

// rules_version = '2';

// // Firebase Storage rules — separate from firestore.rules. Apply these under
// // Firebase Console > Storage > Rules (NOT the Firestore Rules tab).
// //
// // This mirrors the isAdmin() pattern from firestore.rules, but Storage rules
// // use firestore.get() (not the bare get() used in Firestore rules) to look
// // up a Firestore document from within a Storage rule.

// service firebase.storage {
//   match /b/{bucket}/o {

//     function isAdmin() {
//       return request.auth != null
//         && firestore.exists(
//           /databases/(default)/documents/admins/$(request.auth.uid)
//         );
//     }

//     // KYC documents, one folder per user: kyc/{uid}/{filename}
//     // - The owner can upload their own documents and read them back.
//     // - Admins can read (and delete, e.g. after processing) any of them.
//     // - Nobody can overwrite another user's folder.
//     match /kyc/{userId}/{fileName} {
//       allow read: if request.auth != null
//         && (request.auth.uid == userId || isAdmin());

//       allow write: if request.auth != null
//         && request.auth.uid == userId
//         // Basic sanity limits: 10 MB max, images or PDFs only.
//         && request.resource.size < 10 * 1024 * 1024
//         && request.resource.contentType.matches('image/.*|application/pdf');

//       allow delete: if isAdmin();
//     }

//     // Everything else denied by default.
//   }
// }
