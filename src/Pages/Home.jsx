import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://privatereporeadmegen.onrender.com";

function Home() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  
  const login = () => {
    window.location.href =
      "https://privatereporeadmegen.onrender.com/oauth2/authorization/github";
  };

//   useEffect(() => {
//   const params = new URLSearchParams(window.location.search);

//   if (params.get("login") === "success") {
//     axios
//       .get(`${API}/api/user`, { withCredentials: true })
//       .then((res) => {
//         setUser(res.data);
//         setIsLoggedIn(true);
//       })
//       .catch(() => {
//         setIsLoggedIn(false);
//       });
//   }
// }, []);


  useEffect(() => {
    if (!isLoggedIn) return;

    console.log("LOGIN:", user.login);

    axios
      .get(`${API}/private-repo`, { withCredentials: true })
      .then((res) => {
        setRepos(res.data);
      });
  }, [isLoggedIn]);

  
  const generate = async () => {
    if (!selectedRepo) {
      alert("Select a repository");
      return;
    }

    console.log(selectedRepo);

    try {
      setLoading(true);
      console.log(selectedRepo);

      const res = await axios.post(

        `${API}/private-repo/${user.login}/${selectedRepo}/generate-readme`,

        { snippet: " " },

        { withCredentials: true }
      );

      setReadme(res.data);
    } 
    catch (err) {
        console.error(err);
        alert("Error generating README");
    } 
    finally {
        setLoading(false);
    }
  };

  const handleCopy = async () => {
  if (!readme) return;

  await navigator.clipboard.writeText(readme);
  setCopied(true);

  setTimeout(() => setCopied(false), 2000);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    
    {/* TOP BAR */}
    <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
      <h1 className="text-xl font-semibold tracking-tight">
        AI README
      </h1>

      {isLoggedIn && (
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">{user?.login}</span>
        </div>
      )}
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      
      {/* LEFT PANEL */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        
        <h2 className="text-lg font-medium mb-4">Setup</h2>

        {!isLoggedIn ? (
          <button
            onClick={login}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition"
          >
            Connect GitHub
          </button>
        ) : (
          <>
            {/* REPO SELECT */}
            <label className="text-sm text-slate-400 mb-2 block">
              Repository
            </label>

            <select
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-white/20"
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="">Select repository</option>
              {repos.map((repo) => (
                <option key={repo.name} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>

            {/* GENERATE BUTTON */}
            <button
              disabled={!selectedRepo || loading}
              onClick={generate}
              className="w-full mt-4 py-3 rounded-xl font-medium 
                bg-gradient-to-r from-indigo-500 to-purple-600 
                hover:opacity-90 disabled:opacity-40 transition"
            >
              {loading ? "Generating..." : "Generate README"}
            </button>

            {/* SMALL INFO */}
            <p className="text-xs text-slate-500 mt-4">
              AI-generated README based on your repository content.
            </p>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Output</h2>

          {readme && (
            <button
              onClick={() => navigator.clipboard.writeText(readme)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Copy
            </button>
          )}
        </div>

        {/* OUTPUT BOX */}
        <textarea
          value={readme}
          readOnly
          placeholder="Your generated README will appear here..."
          className="flex-1 w-full p-4 rounded-xl bg-black/40 border border-white/10 text-sm text-slate-200 resize-none focus:outline-none"
        />
      </div>
    </div>
  </div>
);
}

export default Home;