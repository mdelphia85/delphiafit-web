import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TextAction from "./TextAction.jsx";
import { apiRequest, hasSession } from "../utils/api.js";
import { createIdempotencyKey } from "../utils/idempotency.js";
import { formatNutrient, NUTRIENT_LABELS, normalizeBarcode, portionNutrients } from "../utils/foodScanner.js";

const GREEN = "#10b981";

function getLogAttempt(fingerprint) {
  const email = localStorage.getItem("userEmail")?.trim().toLowerCase();
  const storageKey = email ? JSON.stringify(["nutrition-scanner-pending", email, fingerprint]) : null;
  let key;
  if (storageKey) {
    try {
      const storedKey = sessionStorage.getItem(storageKey);
      if (/^[a-f0-9]{32}$/.test(storedKey ?? "")) {
        key = storedKey;
      } else {
        key = createIdempotencyKey();
        sessionStorage.setItem(storageKey, key);
      }
    } catch {
      // The in-memory attempt still supports retries if tab storage is unavailable.
    }
  }
  return { fingerprint, key: key || createIdempotencyKey(), storageKey };
}

function clearLogAttempt(storageKey) {
  if (!storageKey) return;
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // Storage cleanup must not turn a confirmed write into a reported failure.
  }
}

const field = {
  display: "block", width: "100%", marginTop: 6, boxSizing: "border-box",
  padding: 11, borderRadius: 7, color: "#fff", background: "#151515",
  border: "1px solid #555"
};
const panel = { background: "#111", padding: 16, borderRadius: 10, marginBottom: 16 };
const action = { color: GREEN, display: "inline-block", padding: "7px 0", marginRight: 14 };
const DETECT_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"];

function ScoreOverview({ product }) {
  // Old beta responses are not eligible for the production display.
  const score = product.delphiafit_score_0_100;
  const rated = product.score_status === "standard-derived" && Number.isFinite(score);
  const methodology = product.score_methodology || {};
  const grade = ["a", "b", "c", "d", "e"].includes(product.nutri_score_grade)
    ? product.nutri_score_grade.toUpperCase() : null;
  return (
    <section style={panel} aria-label="Nutrition rating">
      <h3 style={{ color: GREEN, marginTop: 0 }}>Nutrition profile</h3>
      {rated ? (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#aaa" }}>Provider Nutri-Score</div>
            <strong style={{ fontSize: 35, color: GREEN }}>{grade}</strong>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#aaa" }}>DelphiaFit grade index</div>
            <strong style={{ fontSize: 35, color: GREEN }}>{score} / 100</strong>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 23, fontWeight: 700, color: "#ccc" }}>Unrated</p>
      )}
      <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.5 }}>
        {rated
          ? "Based on the Nutri-Score grade reported by Open Food Facts. "
            + "The 0–100 index displays five grade levels; it is not a separate health assessment."
          : product.score_note || "Insufficient trustworthy information to display a rating."}
      </p>
      {rated && (
        <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.5 }}>
          A Nutri-Score grade summarizes certain nutritional characteristics.
          It does not assess food safety, allergens, additives, portion size, or personal dietary needs.
          Compare similar products rather than using the index as an absolute judgment of health.
        </p>
      )}
      {!rated && grade && <p style={{ color: "#aaa", fontSize: 12 }}>
        Open Food Facts lists Nutri-Score {grade}, but DelphiaFit withheld its numeric index
        because one or more data-quality checks did not pass.
      </p>}
      {!rated && Array.isArray(product.score_unrated_reasons) && product.score_unrated_reasons.length > 0 && (
        <ul style={{ paddingLeft: 20, color: "#bbb", fontSize: 13 }}>
          {product.score_unrated_reasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      )}
      {methodology.version === "1.0" && (
        <details>
          <summary style={{ color: GREEN, cursor: "pointer", padding: "8px 0" }}>Rating method and limitations</summary>
          <p style={{ fontSize: 13, color: "#ddd", lineHeight: 1.5 }}>{methodology.formula}</p>
          <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>{methodology.limits}</p>
          <p style={{ fontSize: 12, color: "#aaa" }}>
            Reference: <a href={methodology.standard_url} target="_blank" rel="noreferrer" style={{ color: GREEN }}>
              Santé publique France — Nutri-Score methodology
            </a>.
            Product grades come from the community-maintained Open Food Facts record,
            which may not identify which revision of the Nutri-Score calculation was used.
          </p>
        </details>
      )}
    </section>
  );
}

function ProductDetails({ product }) {
  const nutrition = product.nutrition_per_100g_or_100ml || {};
  const per = product.nutrition_unit ? "100 " + product.nutrition_unit : "100 g or 100 ml (unit unverified)";
  return (
    <section aria-label="Product details">
      <section style={panel}>
        <h3 style={{ color: GREEN, marginTop: 0 }}>{product.product_name || "Unknown product"}</h3>
        {product.brands && <p style={{ color: "#ccc" }}>{product.brands}</p>}
        <p style={{ fontSize: 12, color: "#aaa" }}>Barcode: {product.barcode} · Quantity: {product.quantity || "Not listed"}</p>
        <p style={{ fontSize: 13, color: "#ccc" }}>
          Serving description on provider record: {product.serving_size || "Not available"}.
          This does not automatically set the amount you consumed.
        </p>
        <p style={{ fontSize: 13, color: "#bbb" }}>
          Source: <a href={product.source?.url} target="_blank" rel="noreferrer" style={{ color: GREEN }}>
            Open Food Facts product record
          </a>. Community-contributed information may be inaccurate or incomplete.
          Verify ingredients and allergens against the physical package.
        </p>
      </section>
      <ScoreOverview product={product} />
      <section style={panel}>
        <h3 style={{ color: GREEN, marginTop: 0 }}>Nutrition facts</h3>
        <p style={{ fontSize: 13, color: "#aaa" }}>All values are reported per {per}, not per serving.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10 }}>
          {NUTRIENT_LABELS.map(([key, label, unit]) => (
            <div key={key} style={{ padding: 10, border: "1px solid #333", borderRadius: 7 }}>
              <div style={{ fontSize: 12, color: "#bbb" }}>{label}</div>
              <strong>{formatNutrient(nutrition[key], unit)}</strong>
            </div>
          ))}
        </div>
        <p style={{ color: "#aaa", fontSize: 12 }}>
          Reported data completeness: {product.data_completeness_percent ?? 0}%.
          Missing values were not treated as zero.
        </p>
      </section>
      <section style={panel}>
        <h3 style={{ color: GREEN, marginTop: 0 }}>Ingredients and allergen information</h3>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 14 }}>
          {product.ingredients_text || "Ingredient list not reported."}
        </p>
        <p><strong>Listed allergens:</strong> {product.allergens?.length ? product.allergens.join(", ") : "Not reported"}</p>
        <p><strong>May contain traces:</strong> {product.traces?.length ? product.traces.join(", ") : "Not reported"}</p>
        <p><strong>Reported additives:</strong> {product.additives?.length ? product.additives.join(", ") : "Not reported"}</p>
        <p role="note" style={{ color: "#f3c78c", fontSize: 13 }}>
          Missing allergy data does NOT mean allergen-free. Always check the product packaging,
          especially if you have allergies or dietary restrictions.
        </p>
      </section>
    </section>
  );
}

/** One embedded section of Nutrition Pro. Looking up a barcode never logs a meal. */
export default function FoodScanner({ avoid = [], diet = "none" }) {
  const [input, setInput] = useState("");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("100");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(() => hasSession());
  const [logBusy, setLogBusy] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [logged, setLogged] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const mediaRef = useRef(null);
  const animationRef = useRef(null);
  const activeRef = useRef(false);
  const pendingLookup = useRef(false);
  const logLock = useRef(false);
  const logAttempt = useRef(null);

  const stopCamera = useCallback(() => {
    activeRef.current = false;
    if (animationRef.current !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((track) => track.stop());
      mediaRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
  }, []);

  useEffect(() => () => {
    // Clean up camera without retaining an active stream after navigation.
    activeRef.current = false;
    if (animationRef.current !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animationRef.current);
    }
    if (mediaRef.current) mediaRef.current.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    let current = true;
    if (!hasSession()) return undefined;
    apiRequest("/nutrition-scanner/history", { timeoutMs: 9000 })
      .then((rows) => { if (current) setHistory(Array.isArray(rows) ? rows : []); })
      .catch(() => { if (current) setStatus("Scan history is temporarily unavailable."); })
      .finally(() => { if (current) setHistoryLoading(false); });
    return () => { current = false; };
  }, []);

  async function lookup(value) {
    if (pendingLookup.current || logLock.current) return;
    const code = normalizeBarcode(value);
    if (!code) {
      setError("Enter an 8–14 digit EAN or UPC barcode.");
      return;
    }
    pendingLookup.current = true;
    stopCamera();
    setInput(code);
    setProduct(null);
    setLogged(false);
    logAttempt.current = null;
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const found = await apiRequest("/nutrition-scanner/product/" + code, { timeoutMs: 14000 });
      setProduct(found);
      setStatus("Product loaded. Nothing has been logged as consumed.");
    } catch (err) {
      setError(err.status === 404
        ? "Product not found in Open Food Facts. Check the barcode or use manual food tracking."
        : err.status === 429
          ? "Product lookup is temporarily busy. Please retry later."
          : err.message || "Unable to look up this product.");
    } finally {
      pendingLookup.current = false;
      setLoading(false);
    }
  }

  async function startCamera() {
    setError("");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera access requires HTTPS and browser camera permission. Enter the barcode manually instead.");
      return;
    }
    if (!("BarcodeDetector" in window)) {
      setError("This browser does not support live barcode detection yet. Enter the printed EAN/UPC digits manually.");
      return;
    }
    try {
      const formats = await window.BarcodeDetector.getSupportedFormats();
      const supported = DETECT_FORMATS.filter((format) => formats.includes(format));
      if (!supported.length) {
        setError("Your browser camera cannot decode grocery barcodes. Enter the barcode manually.");
        return;
      }
      const detector = new window.BarcodeDetector({ formats: supported });
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }, audio: false
      });
      mediaRef.current = media;
      activeRef.current = true;
      setScanning(true);
      const video = videoRef.current;
      if (!video) { stopCamera(); return; }
      video.srcObject = media;
      await video.play();
      const loop = async () => {
        if (!activeRef.current || pendingLookup.current) return;
        try {
          const barcodes = await detector.detect(video);
          const match = barcodes.find((item) => normalizeBarcode(item.rawValue));
          if (match && !logLock.current) {
            await lookup(match.rawValue);
            return;
          }
        } catch {
          // A dropped camera frame is expected; keep scanning.
        }
        if (activeRef.current) animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } catch (err) {
      stopCamera();
      setError(err.name === "NotAllowedError"
        ? "Camera permission was denied. Enable it in your browser settings or enter the barcode manually."
        : "Camera could not start. Use manual barcode entry instead.");
    }
  }

  async function saveHistory() {
    if (!product || historyBusy) return;
    setHistoryBusy(true);
    setError("");
    try {
      const saved = await apiRequest("/nutrition-scanner/history", {
        method: "POST", body: { barcode: product.barcode }
      });
      setHistory((old) => [saved, ...old.filter((item) => item.id !== saved.id)].slice(0, 50));
      setStatus("Barcode saved to your private scan history.");
    } catch (err) {
      setError(err.message || "Could not save scan history.");
    } finally { setHistoryBusy(false); }
  }

  async function deleteHistory(id) {
    if (historyBusy) return;
    setHistoryBusy(true);
    try {
      await apiRequest("/nutrition-scanner/history/" + id, { method: "DELETE" });
      setHistory((old) => old.filter((item) => item.id !== id));
      setStatus("Scan removed from your history.");
    } catch (err) { setError(err.message || "Unable to remove scan."); }
    finally { setHistoryBusy(false); }
  }

  const portion = portionNutrients(product, quantity);

  async function logFood() {
    if (!portion || !product || logBusy || logged || logLock.current) return;
    logLock.current = true;
    setLogBusy(true);
    setError("");
    try {
      const fingerprint = JSON.stringify({ barcode: product.barcode, quantity: Number(quantity), nutrition: portion });
      if (logAttempt.current?.fingerprint !== fingerprint) {
        logAttempt.current = getLogAttempt(fingerprint);
      }
      await apiRequest("/nutrition/", {
        method: "POST", body: portion, timeoutMs: 12000,
        headers: { "Idempotency-Key": logAttempt.current.key }
      });
      clearLogAttempt(logAttempt.current.storageKey);
      logAttempt.current = null;
      setLogged(true);
      setStatus("Food logged once to today's nutrition totals, including calories, protein, carbs and fat.");
    } catch (err) {
      setError("The food log could not be confirmed. Check today's nutrition totals before trying again. " +
        (err.message || ""));
    } finally {
      setLogBusy(false);
      logLock.current = false;
    }
  }

  function submitBarcode(event) {
    event.preventDefault();
    lookup(input);
  }

  const possibleAvoid = Array.isArray(avoid)
    ? avoid.filter((term) => product?.allergens?.some((item) => item.toLowerCase().includes(term.toLowerCase())))
    : [];

  return (
    <section aria-label="Food barcode scanner" style={{ display: "grid", gap: 14 }}>
      <div style={panel}>
        <h2 style={{ color: GREEN, marginTop: 0 }}>Scan &amp; analyze food</h2>
        <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.6 }}>
          Scan a packaged food barcode or enter its digits. Product details come from Open Food Facts.
          Looking up a product does not log food as eaten or share your food diary.
        </p>
        {!hasSession() && <p><Link style={{ color: GREEN }} to="/login">Sign in to use the scanner</Link></p>}
        <form onSubmit={submitBarcode} style={{ display: "grid", gap: 10 }}>
          <label>EAN / UPC barcode
            <input aria-label="EAN / UPC barcode" type="text" value={input}
              onChange={(e) => setInput(e.target.value)} inputMode="numeric"
              autoComplete="off" maxLength={20} placeholder="For example, 12 or 13 digits" style={field}/>
          </label>
          <div>
            <TextAction submit disabled={loading || logBusy} style={action}>{loading ? "Looking up…" : "Look up product"}</TextAction>
            {scanning
              ? <TextAction onClick={stopCamera} style={action}>Stop camera</TextAction>
              : <TextAction onClick={startCamera} disabled={loading || logBusy} style={action}>Scan with camera</TextAction>}
          </div>
        </form>
        <div style={{ display: scanning ? "block" : "none", marginTop: 12 }}>
          <video ref={videoRef} playsInline muted autoPlay
            aria-label="Live camera barcode scanner"
            style={{ display: "block", width: "100%", borderRadius: 8, maxHeight: 260 }} />
          <p style={{ color: "#bbb", fontSize: 12 }}>Align the product barcode within the camera view.</p>
        </div>
        <p style={{ color: "#999", fontSize: 12 }}>
          Camera decoding is available only in supporting browsers. Manual entry works everywhere.
        </p>
        {error && <p role="alert" style={{ color: "#fca5a5" }}>{error}</p>}
        {status && <p role="status" style={{ color: "#a7f3d0" }}>{status}</p>}
      </div>

      {product && (
        <>
          <ProductDetails product={product} />
          {possibleAvoid.length > 0 && <p role="alert" style={{ color: "#f6c98a" }}>
            Your avoidance preferences may apply: {possibleAvoid.join(", ")}. Check the package before consuming.
          </p>}
          {diet !== "none" && <p style={{ color: "#aaa", fontSize: 12 }}>
            Your {diet} preference has not been verified for this product. Review its ingredients.
          </p>}
          <section style={panel}>
            <h3 style={{ color: GREEN, marginTop: 0 }}>Log food actually consumed</h3>
            <p style={{ color: "#bbb", fontSize: 13 }}>
              Only log when you've eaten it. Enter the amount in {product.nutrition_unit || "the product's measured unit"}.
              This adds one entry to your existing daily nutrition totals.
            </p>
            <label>Amount consumed {product.nutrition_unit ? "(" + product.nutrition_unit + ")" : "(unit unavailable)"}
              <input type="number" aria-label="Amount consumed" min="0.1" max="5000" step="0.1" disabled={logBusy || logged}
                value={quantity} onChange={(event) => setQuantity(event.target.value)} style={field}/>
            </label>
            {portion && <p style={{ color: "#ccc", fontSize: 13 }}>
              Estimated: {portion.calories} kcal · {portion.protein} g protein · {portion.carbs} g carbs · {portion.fats} g fat
            </p>}
            {!portion && <p style={{ color: "#f6c98a", fontSize: 13 }}>
              The serving unit or required macro data is missing. To avoid misleading totals,
              automatic logging is unavailable. Use the existing nutrition tracker with the package label.
            </p>}
            <TextAction disabled={!portion || logBusy || logged} onClick={logFood} style={action}>
              {logBusy ? "Saving…" : logged ? "Logged to today's totals" : "Log consumed amount"}
            </TextAction>
          </section>
          <div style={panel}>
            <h3 style={{ color: GREEN, marginTop: 0 }}>Keep this scan?</h3>
            <p style={{ color: "#bbb", fontSize: 13 }}>
              Only the barcode is stored in your private scan history, not your diet, location, or a public post.
            </p>
            <TextAction disabled={historyBusy} onClick={saveHistory} style={action}>Save barcode to history</TextAction>
          </div>
        </>
      )}
      <section style={panel}>
        <h3 style={{ color: GREEN, marginTop: 0 }}>Your saved scans</h3>
        {historyLoading && <p>Loading scan history…</p>}
        {!historyLoading && history.length === 0 && <p style={{ color: "#aaa" }}>No saved barcodes yet.</p>}
        {history.map((record) => (
          <div key={record.id} style={{ borderTop: "1px solid #333", padding: "10px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <TextAction onClick={() => lookup(record.barcode)} disabled={loading || logBusy} style={action}>{record.barcode}</TextAction>
            <span style={{ color: "#999", fontSize: 12 }}>{record.scanned_at ? new Date(record.scanned_at).toLocaleDateString() : ""}</span>
            <TextAction disabled={historyBusy} onClick={() => deleteHistory(record.id)} style={{ color: "#f3c98a" }}>
              Remove
            </TextAction>
          </div>
        ))}
      </section>
      <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6 }}>
        Open Food Facts data is released under the ODbL. Food product, ingredient and additive details
        are community-contributed and may be incomplete. This is not an allergy screening, food-safety,
        or medical advice service. We cannot guarantee that an unlabeled product is safe.
      </p>
    </section>
  );
}
