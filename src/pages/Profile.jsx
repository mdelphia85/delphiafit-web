import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Profile() {
  const profileColor = "rgb(128, 0, 128)";
  const navigate = useNavigate();
  const { openMenu } = useContext(MenuContext);

  const token = localStorage.getItem("token");

  // FORM STATE
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightUnit, setHeightUnit] = useState("cm");

  const [startingWeight, setStartingWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");

  const [height, setHeight] = useState("");

  const [avatar, setAvatar] = useState(null);

  // ⭐ VERIFY TOKEN + LOAD PROFILE
  useEffect(() => {
    async function verifyAndLoad() {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const verify = await fetch(
          "https://delphiafit-backend-production.up.railway.app/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!verify.ok) {
          navigate("/login");
          return;
        }

        // Load profile
        const res = await fetch(
          "https://delphiafit-backend-production.up.railway.app/profile/get",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (data) {
          setName(data.name || "");
          setDob(data.dob || "");
          setWeightUnit(data.weight_unit || "kg");
          setHeightUnit(data.height_unit || "cm");
          setStartingWeight(data.starting_weight || "");
          setCurrentWeight(data.current_weight || "");
          setGoalWeight(data.goal_weight || "");
          setHeight(data.height || "");
        }
      } catch (err) {
        navigate("/login");
      }
    }

    verifyAndLoad();
  }, [token, navigate]);

  // AUTO CALCULATIONS
  const totalChanged =
    startingWeight && currentWeight
      ? (parseFloat(currentWeight) - parseFloat(startingWeight)).toFixed(1)
      : "-";

  const bmi = calculateBMI();

  function calculateBMI() {
    if (!currentWeight || !height) return "-";

    let weightKg = parseFloat(currentWeight);
    let heightCm = parseFloat(height);

    if (weightUnit === "lbs") weightKg = weightKg / 2.20462;
    if (heightUnit === "in") heightCm = heightCm * 2.54;

    const heightM = heightCm / 100;
    const bmiValue = weightKg / (heightM * heightM);

    return bmiValue ? bmiValue.toFixed(1) : "-";
  }

  // ⭐ COLOR LOGIC
  function getWeightColor() {
    if (!startingWeight || !currentWeight) return profileColor;

    const start = parseFloat(startingWeight);
    const current = parseFloat(currentWeight);

    if (current === start) return "yellow";
    if (current < start) return "lime";
    if (current > start) return "red";

    return profileColor;
  }

  // AVATAR HANDLERS
  function handleUpload(e) {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  }

  function handleCamera() {
    alert("Camera capture not implemented yet");
  }

  function clearAvatar() {
    setAvatar(null);
  }

  // ⭐ SAVE PROFILE
  async function saveProfile() {
    const payload = {
      name,
      dob,
      weight_unit: weightUnit,
      height_unit: heightUnit,
      starting_weight: startingWeight,
      current_weight: currentWeight,
      goal_weight: goalWeight,
      height
    };

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/profile/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (data.success) {
        console.log("Profile saved");
        navigate("/login");
      } else {
        console.log("Profile save failed:", data.message);
      }
    } catch (err) {
      console.log("Server error saving profile:", err);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: profileColor,
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        gap: "20px",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* LEFT COLUMN */}
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <Input label="Name" value={name} onChange={setName} color={profileColor} />

          <Input label="Date of Birth" type="date" value={dob} onChange={setDob} color={profileColor} />

          <Selector
            label="Weight Unit"
            options={["kg", "lbs"]}
            value={weightUnit}
            onChange={setWeightUnit}
            color={profileColor}
          />

          <Input label="Starting Weight" value={startingWeight} onChange={setStartingWeight} color={profileColor} />

          <Input label="Current Weight" value={currentWeight} onChange={setCurrentWeight} color={profileColor} />

          <Input label="Target Weight" value={goalWeight} onChange={setGoalWeight} color={profileColor} />

          <Display label="Total Changed" value={totalChanged} color={getWeightColor()} />

          <Selector
            label="Height Unit"
            options={["cm", "in"]}
            value={heightUnit}
            onChange={setHeightUnit}
            color={profileColor}
          />

          <Input label="Height" value={height} onChange={setHeight} color={profileColor} />

          <Display label="Body Mass Index" value={bmi} color={profileColor} />

          <p
            onClick={saveProfile}
            style={{
              color: profileColor,
              fontSize: "20px",
              cursor: "pointer",
              marginTop: "15px",
              textAlign: "left"
            }}
          >
            Save Profile
          </p>
        </div>

        <div
          onClick={openMenu}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            color: profileColor,
            textDecoration: "underline",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Return to Menu
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div
        style={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "10px"
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0 }}>
          {name || "Your Name"} / Your Profile
        </h2>

        <div style={{ textAlign: "center" }}>
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "10px",
                objectFit: "cover",
                border: `2px solid ${profileColor}`
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "10px",
                border: `2px solid ${profileColor}`,
                backgroundColor: "#111",
                margin: "0 auto"
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <Button label="Upload" onClick={() => document.getElementById("avatarInput").click()} color={profileColor} />
          <Button label="Camera" onClick={handleCamera} color={profileColor} />
          <Button label="Clear" onClick={clearAvatar} color={profileColor} />
        </div>

        <input id="avatarInput" type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />

        <div style={{ marginTop: "10px" }}>
          <h3 style={{ marginBottom: "10px" }}>Conversion Formulas</h3>
          <p>kg → lb: lb = kg × 2.20462</p>
          <p>lb → kg: kg = lb ÷ 2.20462</p>
          <p>cm → in: in = cm ÷ 2.54</p>
          <p>in → cm: cm = in × 2.54</p>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Input({ label, value, onChange, color, type = "text" }) {
  return (
    <div>
      <p style={{ margin: "0 0 4px 0" }}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "18px",
          borderRadius: "6px",
          border: `2px solid ${color}`,
          backgroundColor: "#111",
          color
        }}
      />
    </div>
  );
}

function Selector({ label, options, value, onChange, color }) {
  return (
    <div>
      <p style={{ margin: "0 0 4px 0" }}>{label}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "18px",
          borderRadius: "6px",
          border: `2px solid ${color}`,
          backgroundColor: "#111",
          color
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ color: "black" }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Display({ label, value, color }) {
  return (
    <div>
      <p style={{ margin: "0 0 4px 0" }}>{label}</p>
      <div
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: `2px solid ${color}`,
          backgroundColor: "#111",
          fontSize: "18px",
          color: color,
          fontWeight: "600"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Button({ label, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        border: `2px solid ${color}`,
        cursor: "pointer",
        fontSize: "16px"
      }}
    >
      {label}
    </div>
  );
}
