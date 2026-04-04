// @ts-nocheck

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* =====================================================
   ADD NEW ISSUE (FROM ReportIssuePage)
   ===================================================== */

export const addIssue = async (data) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      urgency,
      urgencyScore,
      aiAnalysis,
      votes,
      status,
      userEmail,
      imageUrl,
      address, // ✅ already destructured
    } = data;

    const docRef = await addDoc(collection(db, "issues"), {
      // 🔑 CORE FIELDS
      issueType: title,
      description,
      latitude,
      longitude,
      address: address || "", // ✅ FIX ADDED

      // 🔥 AI + PRIORITY
      urgency,
      urgencyScore,
      aiAnalysis,

      // 🔥 TRACKING
      votes: votes ?? 1,
      status: status ?? "open",

      // 👤 USER
      createdBy: userEmail,
      userEmail: userEmail,

      // 🖼 IMAGE
      imageUrl: imageUrl || "",

      // ⏱ TIMESTAMPS
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding issue:", error);
    throw error;
  }
};

/* =====================================================
   GET ALL ISSUES (ADMIN / MAP / HEATMAP)
   ===================================================== */

export const getAllIssues = async () => {
  try {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching issues:", error);
    throw error;
  }
};

/* =====================================================
   GET USER ISSUES (TrackIssuesPage)
   ===================================================== */

export const getUserIssues = async (userEmail) => {
  try {
    const q = query(
      collection(db, "issues"),
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching user issues:", error);
    throw error;
  }
};