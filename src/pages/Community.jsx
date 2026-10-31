import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "purple";

export default function Community() {
  const { setMenuOpen } = useContext(MenuContext);
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFeed() {
    setLoading(true);
    setError("");
    try {
      const feed = await apiRequest("/social/posts");
      setPosts(Array.isArray(feed) ? feed : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load community posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/social/posts"), apiRequest("/community/profiles")])
      .then(([feed, members]) => {
        if (active) {
          setPosts(Array.isArray(feed) ? feed : []);
          setProfiles(Array.isArray(members) ? members : []);
        }
      })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load community."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function toggleFollow(profile) {
    try {
      await apiRequest(`/community/follows/${profile.id}`, { method: profile.following ? "DELETE" : "POST" });
      setProfiles((rows) => rows.map((row) => row.id === profile.id ? { ...row, following: !profile.following } : row));
    } catch (requestError) {
      setError(requestError.message || "Unable to update follow status.");
    }
  }

  async function handlePost(event) {
    event.preventDefault();
    if (!text.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      await apiRequest(`/social/posts?content=${encodeURIComponent(text.trim())}`, { method: "POST" });
      setText("");
      await loadFeed();
    } catch (requestError) {
      setError(requestError.message || "Unable to publish your post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReaction(post) {
    setError("");
    try {
      await apiRequest(`/social/posts/${post.id}/reactions?reaction_type=like`, { method: "POST" });
      await loadFeed();
    } catch (requestError) {
      setError(requestError.message || "Unable to save reaction.");
    }
  }

  async function handleComment(post) {
    const content = (drafts[post.id] || "").trim();
    if (!content) return;
    setError("");
    try {
      await apiRequest(`/social/posts/${post.id}/comments?content=${encodeURIComponent(content)}`, { method: "POST" });
      setDrafts((previous) => ({ ...previous, [post.id]: "" }));
      await loadFeed();
    } catch (requestError) {
      setError(requestError.message || "Unable to add comment.");
    }
  }

  function countLikes(reactions) {
    return reactions.filter((reaction) => reaction.reaction_type === "like").length;
  }

  return (
    <main style={{ minHeight: "100vh", width: "100vw", backgroundColor: "black", padding: "20px 20px 90px", boxSizing: "border-box", color: "white" }}>
      <section style={{ maxWidth: "760px", margin: "0 auto" }}>
        <h1 style={{ color: COLOR, fontSize: "28px" }}>Community</h1>
        <section style={{ marginBottom: "18px" }}>
          <h2 style={{ color: COLOR, fontSize: "20px" }}>Community members</h2>
          {profiles.length === 0 ? <p>No other members to follow yet.</p> : profiles.map((profile) => <div key={profile.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", padding: "10px 12px", marginBottom: "6px", borderRadius: "8px" }}><span>{profile.name}</span><button type="button" onClick={() => toggleFollow(profile)} style={{ background: profile.following ? "transparent" : COLOR, color: profile.following ? COLOR : "#000", border: `1px solid ${COLOR}`, borderRadius: "999px", padding: "6px 12px", cursor: "pointer" }}>{profile.following ? "Following" : "Follow"}</button></div>)}
        </section>
        <form onSubmit={handlePost} style={{ background: "#111", border: `1px solid ${COLOR}`, borderRadius: "12px", padding: "14px", marginBottom: "18px" }}>
          <label htmlFor="community-post" style={{ display: "block", marginBottom: "8px" }}>Share something</label>
          <textarea id="community-post" value={text} onChange={(event) => setText(event.target.value)} maxLength={5000} rows={3} style={{ width: "100%", boxSizing: "border-box", resize: "vertical", background: "#000", color: "white", border: "1px solid #333", borderRadius: "8px", padding: "10px" }} />
          <button type="submit" disabled={saving || !text.trim()} style={{ marginTop: "10px", background: COLOR, border: 0, borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Posting..." : "Post"}</button>
        </form>
        {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
        {loading ? <p>Loading community...</p> : posts.length === 0 ? <p>No community posts yet. Start the conversation.</p> : posts.map((post) => (
          <article key={post.id} style={{ background: "#111", border: "1px solid #333", borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
            <div style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px" }}>Member {post.user_id} | {post.created_at ? new Date(post.created_at).toLocaleString() : ""}</div>
            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{post.content}</p>
            <button type="button" onClick={() => handleReaction(post)} style={{ background: "transparent", border: `1px solid ${COLOR}`, color: COLOR, borderRadius: "999px", padding: "5px 10px", cursor: "pointer" }}>Like {countLikes(post.reactions || [])}</button>
            <div style={{ marginTop: "12px" }}>
              {(post.comments || []).map((comment) => <p key={comment.id} style={{ background: "#000", padding: "8px", borderRadius: "6px" }}><strong style={{ color: COLOR }}>Member {comment.user_id}: </strong>{comment.content}</p>)}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input aria-label={`Comment on post ${post.id}`} value={drafts[post.id] || ""} onChange={(event) => setDrafts((previous) => ({ ...previous, [post.id]: event.target.value }))} maxLength={2000} placeholder="Write a comment..." style={{ flex: 1, minWidth: 0, background: "#000", color: "white", border: "1px solid #333", borderRadius: "8px", padding: "8px" }} />
                <button type="button" onClick={() => handleComment(post)} disabled={!(drafts[post.id] || "").trim()} style={{ background: COLOR, border: 0, borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>Comment</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: COLOR, background: "black", border: 0, textDecoration: "underline", fontSize: "18px", cursor: "pointer" }}>Return to Menu</button>
    </main>
  );
}
