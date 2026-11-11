// Coach-specific destinations require a coach session, which is separate from the
// regular DelphiaFit member session. The backend enforces the role on every request.
export function getCoachMenuItems(coachSignedIn) {
  const items = [
    {
      label: coachSignedIn ? "Coach Hub" : "Coach Hub Login",
      path: coachSignedIn ? "/coach-dashboard" : "/coach-login"
    },
    { label: "My Coach", path: "/my-coach" }
  ];

  if (coachSignedIn) {
    items.push(
      { label: "My Clients", path: "/client-management" },
      { label: "Plan Builder", path: "/plan-builder" },
      { label: "Drill Library", path: "/drill-library" },
      { label: "Coach Messages", path: "/coach-messaging" }
    );
  }

  return items;
}
