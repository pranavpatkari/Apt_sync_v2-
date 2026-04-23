import { useState } from "react";
import useAuth       from "./hooks/useAuth";
import useApartment  from "./hooks/useApartment";
import useItems      from "./hooks/useItems";
import usePayments   from "./hooks/usePayments";
import Setup         from "./pages/Setup";
import MainLayout    from "./layout/MainLayout";
import Dashboard     from "./pages/Dashboard";
import Items         from "./pages/Items";
import Stats         from "./pages/Stats";
import Profile       from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // 1. Firebase auth (source of truth)
  const { user, loading: authLoading, login, logout } = useAuth();

  // 2. Apartment scoped to this user
  const {
    apartment, apartments, loading: aptLoading, error: aptError,
    createApartment, joinApartment, switchApartment, refreshApartment
  } = useApartment(user);

  // 3. Items + payments scoped to active apartment
  const { items, addItem, updateItem, deleteItem } = useItems(apartment?.id);
  const { payments, addPayment }                   = usePayments(apartment?.id);

  // ── loading screen ──────────────────────────────────────
  if (authLoading || (user && aptLoading)) {
    return (
      <div style={{
        height: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "#0a0a0a", color: "white", fontSize: 18
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
          <p>Loading AptSync...</p>
        </div>
      </div>
    );
  }

  // ── not logged in or no apartment → setup ───────────────
  if (!user || !apartment) {
    return (
      <Setup
        user={user}
        login={login}
        apartments={apartments}
        createApartment={createApartment}
        joinApartment={joinApartment}
        switchApartment={switchApartment}
        aptError={aptError}
      />
    );
  }

  const members = apartment.members || [];

  return (
    <MainLayout
      setPage={setPage}
      currentPage={page}
      user={user}
      apartment={apartment}
      apartments={apartments}
      switchApartment={switchApartment}
      onLogout={logout}
    >
      {page === "dashboard" && (
        <Dashboard
          items={items}
          members={members}
          apartment={apartment}
          onRefresh={refreshApartment}
        />
      )}
      {page === "items" && (
        <Items
          items={items}
          addItem={addItem}
          updateItem={updateItem}
          deleteItem={deleteItem}
          user={user}
          members={members}
        />
      )}
      {page === "stats" && (
        <Stats items={items} members={members} payments={payments} />
      )}
      {page === "profile" && (
        <Profile user={user} items={items} />
      )}
    </MainLayout>
  );
}
