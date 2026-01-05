import { useEffect, useRef, useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { UserSelection } from "./components/UserSelection";
import { AccessibilityFab } from "./components/AccessibilityFab";

export type UserType = "employee" | "citizen" | "admin" | null;

function pathFromState(isLoggedIn: boolean, userType: UserType) {
  if (!isLoggedIn || !userType) return "/";
  if (userType === "admin") return "/admin";
  if (userType === "employee") return "/employee";
  if (userType === "citizen") return "/citizen";
  return "/";
}

function stateFromPath(pathname: string): { isLoggedIn: boolean; userType: UserType } {
  if (pathname === "/admin") return { isLoggedIn: true, userType: "admin" };
  if (pathname === "/employee") return { isLoggedIn: true, userType: "employee" };
  if (pathname === "/citizen") return { isLoggedIn: true, userType: "citizen" };
  return { isLoggedIn: false, userType: null };
}

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // για να μην κρατάει το login screen στο history όταν κάνεις login
  const prevIsLoggedIn = useRef(isLoggedIn);

  // 1) initial load: URL -> state
  useEffect(() => {
    const s = stateFromPath(window.location.pathname);
    setIsLoggedIn(s.isLoggedIn);
    setUserType(s.userType);

    window.history.replaceState(s, "", window.location.pathname + window.location.search);
    prevIsLoggedIn.current = s.isLoggedIn;
  }, []);

  // 2) state -> URL/history
  useEffect(() => {
    const newPath = pathFromState(isLoggedIn, userType);
    const current = window.location.pathname;

    if (newPath === current) {
      prevIsLoggedIn.current = isLoggedIn;
      return;
    }

    const justLoggedIn = prevIsLoggedIn.current === false && isLoggedIn === true;
    const justLoggedOut = prevIsLoggedIn.current === true && isLoggedIn === false;

    if (justLoggedIn || justLoggedOut) {
      window.history.replaceState({ isLoggedIn, userType }, "", newPath);
    } else {
      window.history.pushState({ isLoggedIn, userType }, "", newPath);
    }

    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, userType]);

  // 3) Back/Forward: URL -> state
  useEffect(() => {
    const onPopState = () => {
      const s = stateFromPath(window.location.pathname);
      setIsLoggedIn(s.isLoggedIn);
      setUserType(s.userType);
      prevIsLoggedIn.current = s.isLoggedIn;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
    window.history.replaceState({ isLoggedIn: false, userType: null }, "", "/");
  };

  if (!userType || !isLoggedIn) {
    return (
      <>
        <UserSelection onSelectUser={setUserType} onLogin={setIsLoggedIn} />
        <AccessibilityFab />
      </>
    );
  }

  return (
    <>
      {userType === "employee" && <EmployeeDashboard onLogout={handleLogout} />}
      {userType === "citizen" && <CitizenDashboard onLogout={handleLogout} />}
      {userType === "admin" && <AdminDashboard onLogout={handleLogout} />}

      {/* Floating accessibility sphere */}
      <AccessibilityFab />
    </>
  );
}
