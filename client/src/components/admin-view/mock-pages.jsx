import React, { useState, useEffect } from "react";
import { User, Mail, FileText, Send, Check, Trash2, Edit2, Plus, ShieldCheck, X, BookOpen, Clock, Settings, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// ==========================================
// 1. DYNAMIC USERS VIEW (PREMIUM)
// ==========================================
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Customer");
  const { toast } = useToast();

  const defaultUsers = [
    { name: "Admin User", email: "admin@woodasa.com", role: "Admin", date: "Jul 12, 2026", status: "Active" },
    { name: "Regular User", email: "user@woodasa.com", role: "Customer", date: "Jul 11, 2026", status: "Active" },
    { name: "John Doe", email: "john@example.com", role: "Customer", date: "Jul 05, 2026", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", role: "Customer", date: "Jun 28, 2026", status: "Suspended" },
  ];

  useEffect(() => {
    const localUsers = localStorage.getItem("woodasaUsers");
    if (localUsers) {
      setUsers(JSON.parse(localUsers));
    } else {
      localStorage.setItem("woodasaUsers", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  const saveUsersToStorage = (updated) => {
    localStorage.setItem("woodasaUsers", JSON.stringify(updated));
    setUsers(updated);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser = {
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Active",
    };

    const updated = [newUser, ...users];
    saveUsersToStorage(updated);
    
    // Reset Form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Customer");
    setIsAddOpen(false);

    toast({
      title: "User Added Successfully",
      description: `${newUser.name} is now registered.`
    });
  };

  const handleToggleStatus = (email) => {
    const updated = users.map(u => {
      if (u.email === email) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        toast({
          title: `User ${nextStatus}`,
          description: `${u.name} status updated to ${nextStatus}.`
        });
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsersToStorage(updated);
  };

  const handleDeleteUser = (email) => {
    const updated = users.filter(u => u.email !== email);
    saveUsersToStorage(updated);
    toast({
      title: "User Deleted",
      variant: "destructive"
    });
  };

  const handleRoleChange = (email, newRole) => {
    const updated = users.map(u => u.email === email ? { ...u, role: newRole } : u);
    saveUsersToStorage(updated);
    toast({
      title: "Role Updated",
      description: `User role changed to ${newRole}.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans-premium">
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-950">Users Management</h2>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mt-1">Manage admin team and registered customers</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <UserPlus size={14} /> Add User
        </button>
      </div>

      {/* Add User Dialog Sheet Overlay (Premium Glassmorphic) */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 font-sans-premium">
            <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3 mb-5">
              <h3 className="font-display font-bold text-lg text-zinc-950">Register New User</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. John Miller"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Security Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70 cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors mt-2"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Users List Data Table (Premium Glassmorphic) */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/60 border-b border-zinc-200/80 text-[10px] md:text-xs uppercase tracking-wider font-semibold text-zinc-400">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-zinc-950 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100/80 border border-zinc-200/50 flex items-center justify-center text-zinc-500">
                      <User size={16} />
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 border border-zinc-200 focus:outline-none focus:border-zinc-800 cursor-pointer"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">{user.date}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(user.email)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                        user.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      }`}
                      title="Click to toggle status"
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. DYNAMIC MESSAGES VIEW (PREMIUM)
// ==========================================
export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();

  const defaultMessages = [
    {
      _id: "msg-1",
      sender: "Amit Sharma",
      email: "amit@example.com",
      subject: "Custom Furniture Design",
      body: "Hello Woodasa team, do you accept custom designs for dining tables? I have specific dimensions and would love a custom walnut wood build.",
      date: "Jul 12, 2026 at 4:12 PM",
      read: false,
    },
    {
      _id: "msg-2",
      sender: "Priya Patel",
      email: "priya@example.com",
      subject: "Order Shipping Status",
      body: "My order #1004 has not arrived yet. Could you check the tracking link? It shows pending updates.",
      date: "Jul 10, 2026 at 11:30 AM",
      read: true,
    },
  ];

  useEffect(() => {
    const localMsg = localStorage.getItem("woodasaMessages");
    if (localMsg) {
      setMessages(JSON.parse(localMsg));
    } else {
      localStorage.setItem("woodasaMessages", JSON.stringify(defaultMessages));
      setMessages(defaultMessages);
    }
  }, []);

  const saveMessagesToStorage = (updated) => {
    localStorage.setItem("woodasaMessages", JSON.stringify(updated));
    setMessages(updated);
  };

  const handleMarkRead = (id) => {
    const updated = messages.map(m => m._id === id ? { ...m, read: true } : m);
    saveMessagesToStorage(updated);
    toast({
      title: "Marked Read",
    });
  };

  const handleDeleteMessage = (id) => {
    const updated = messages.filter(m => m._id !== id);
    saveMessagesToStorage(updated);
    toast({
      title: "Message Deleted",
      variant: "destructive"
    });
  };

  const handleSendReply = (idx) => {
    if (!replyText.trim()) return;

    toast({
      title: "Reply Dispatched",
      description: `Reply sent successfully to ${messages[idx].email}.`
    });

    const updated = messages.map((m, i) => i === idx ? { ...m, read: true } : m);
    saveMessagesToStorage(updated);

    setReplyText("");
    setReplyIndex(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans-premium">
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-950">Inbox</h2>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mt-1">Customer inquiries and support tickets</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={msg._id} className={`p-6 rounded-2xl border transition-all ${msg.read ? "bg-white/70 backdrop-blur-md border-white/80 shadow-sm" : "bg-[#d9a014]/5 border-[#d9a014]/20 shadow-md"}`}>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-zinc-900 text-lg flex items-center gap-2">
                    {msg.sender}
                    {!msg.read && <span className="w-2.5 h-2.5 rounded-full bg-[#d9a014] animate-pulse" title="New Message"></span>}
                  </h3>
                  <span className="text-xs text-zinc-400">{msg.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{msg.date}</span>
                  <button 
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-zinc-950 text-sm mb-1">{msg.subject}</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">{msg.body}</p>
              </div>

              {replyIndex === idx ? (
                <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-zinc-200/60 animate-in slide-in-from-top-3 duration-200 space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder={`Compose email response to ${msg.sender}...`}
                    className="w-full p-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-800 resize-none font-sans-premium"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => setReplyIndex(null)}
                      className="px-3 py-1.5 border border-zinc-200 text-zinc-700 text-xs font-bold uppercase rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSendReply(idx)}
                      className="px-3 py-1.5 bg-[#d9a014] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#c49012] flex items-center gap-1.5 transition-colors"
                    >
                      <Send size={10} /> Send Response
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setReplyIndex(idx)}
                    className="px-4 py-2 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Reply
                  </button>
                  {!msg.read && (
                    <button 
                      onClick={() => handleMarkRead(msg._id)}
                      className="px-4 py-2 border border-border bg-white text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2"
                    >
                      <Check size={14} /> Mark Read
                    </button>
                  )}
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="py-20 border border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 bg-white/70 backdrop-blur-md">
            <Mail size={32} className="mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider">Inbox is completely clean!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. DYNAMIC BLOG VIEW (PREMIUM)
// ==========================================
export function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Craftsmanship");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const defaultBlogs = [
    { _id: "b-1", title: "The Art of Wooden Crafting", author: "woodasa_artisan", date: "Jul 10, 2026", category: "Craftsmanship" },
    { _id: "b-2", title: "Sustainable Home Decor Ideas", author: "eco_living", date: "Jul 08, 2026", category: "Eco-living" },
    { _id: "b-3", title: "Why Bamboo Toothbrushes are Better", author: "health_guru", date: "Jun 30, 2026", category: "Daily Habits" },
  ];

  useEffect(() => {
    const localBlogs = localStorage.getItem("woodasaBlogs");
    if (localBlogs) {
      setBlogs(JSON.parse(localBlogs));
    } else {
      localStorage.setItem("woodasaBlogs", JSON.stringify(defaultBlogs));
      setBlogs(defaultBlogs);
    }
  }, []);

  const saveBlogsToStorage = (updated) => {
    localStorage.setItem("woodasaBlogs", JSON.stringify(updated));
    setBlogs(updated);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setCategory("Craftsmanship");
    setContent("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditId(blog._id);
    setTitle(blog.title);
    setAuthor(blog.author);
    setCategory(blog.category);
    setContent(blog.content || "Placeholder content detailing " + blog.title);
    setIsModalOpen(true);
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!title || !author) return;

    if (editId) {
      const updated = blogs.map(b => b._id === editId ? { ...b, title, author, category, content } : b);
      saveBlogsToStorage(updated);
      toast({
        title: "Blog Post Updated",
      });
    } else {
      const newPost = {
        _id: "blog-" + Date.now(),
        title,
        author,
        category,
        content,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      };
      const updated = [newPost, ...blogs];
      saveBlogsToStorage(updated);
      toast({
        title: "Blog Post Published",
      });
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (id) => {
    const updated = blogs.filter(b => b._id !== id);
    saveBlogsToStorage(updated);
    toast({
      title: "Blog Post Deleted",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans-premium">
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-950">Blog Posts</h2>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mt-1">Manage articles published on the Woodasa journal</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* Edit/Create Modal (Premium Glassmorphic) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 font-sans-premium">
            <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3 mb-5">
              <h3 className="font-display font-bold text-lg text-zinc-950">{editId ? "Edit Journal Article" : "Write Journal Article"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Article Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Minimalist Interiors"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Author Handle</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. woodasa_creator"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70 cursor-pointer"
                >
                  <option value="Craftsmanship">Craftsmanship</option>
                  <option value="Eco-living">Eco-living</option>
                  <option value="Daily Habits">Daily Habits</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Article Body Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Write your article copy here..."
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 resize-none bg-white/70"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors mt-2"
              >
                {editId ? "Save Article" : "Publish Article"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Active Posts (Premium Glassmorphic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((post) => (
            <div key={post._id} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-white/40 transition-all duration-300 ease-out">
              <div className="p-6">
                <span className="text-xs uppercase tracking-wider font-bold text-[#d9a014]">{post.category}</span>
                <h3 className="font-display font-bold text-zinc-950 text-xl mt-2 leading-snug">{post.title}</h3>
                <p className="text-[10px] text-zinc-400 mt-4 flex items-center gap-1.5">
                  <Clock size={12} />
                  By <span className="font-semibold text-zinc-600">{post.author}</span> | {post.date}
                </p>
              </div>
              <div className="px-6 py-4 bg-zinc-50/60 border-t border-zinc-100 flex justify-between gap-3">
                <button 
                  onClick={() => handleOpenEdit(post)}
                  className="px-3 py-1.5 border border-zinc-200 bg-white text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-1 flex-1 shadow-sm"
                >
                  <Edit2 size={10} /> Edit
                </button>
                <button 
                  onClick={() => handleDeletePost(post._id)}
                  className="px-3 py-1.5 border border-red-200 bg-white text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-1 flex-1 shadow-sm"
                >
                  <Trash2 size={10} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 border border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 bg-white/70 backdrop-blur-md">
            <BookOpen size={32} className="mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. DYNAMIC NEWSLETTER VIEW (PREMIUM)
// ==========================================
export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubEmail, setNewSubEmail] = useState("");
  
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const { toast } = useToast();

  const defaultSubscribers = [
    { email: "john@example.com", date: "Jul 12, 2026", status: "Active" },
    { email: "jane@example.com", date: "Jul 10, 2026", status: "Active" },
    { email: "priya@example.com", date: "Jul 09, 2026", status: "Unsubscribed" },
  ];

  useEffect(() => {
    const localSubs = localStorage.getItem("woodasaSubscribers");
    if (localSubs) {
      setSubscribers(JSON.parse(localSubs));
    } else {
      localStorage.setItem("woodasaSubscribers", JSON.stringify(defaultSubscribers));
      setSubscribers(defaultSubscribers);
    }
  }, []);

  const saveSubsToStorage = (updated) => {
    localStorage.setItem("woodasaSubscribers", JSON.stringify(updated));
    setSubscribers(updated);
  };

  const handleAddSubscriber = (e) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;

    if (subscribers.some(s => s.email === newSubEmail.trim())) {
      toast({
        title: "Email Registered",
        description: "This email is already in the list.",
        variant: "destructive"
      });
      return;
    }

    const newSub = {
      email: newSubEmail.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Active"
    };

    const updated = [newSub, ...subscribers];
    saveSubsToStorage(updated);
    setNewSubEmail("");
    toast({
      title: "Subscriber Added",
    });
  };

  const handleToggleSubStatus = (email) => {
    const updated = subscribers.map(s => {
      if (s.email === email) {
        const nextStatus = s.status === "Active" ? "Unsubscribed" : "Active";
        return { ...s, status: nextStatus };
      }
      return s;
    });
    saveSubsToStorage(updated);
    toast({
      title: "Status Changed",
    });
  };

  const handleDeleteSubscriber = (email) => {
    const updated = subscribers.filter(s => s.email !== email);
    saveSubsToStorage(updated);
    toast({
      title: "Subscriber Removed",
      variant: "destructive"
    });
  };

  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!subject || !bodyText) return;

    const activeSubs = subscribers.filter(s => s.status === "Active");
    if (activeSubs.length === 0) {
      toast({
        title: "No Subscribers",
        description: "There are no active newsletter subscribers to email.",
        variant: "destructive"
      });
      return;
    }

    const sentCampaigns = JSON.parse(localStorage.getItem("woodasaNewslettersSent") || "[]");
    const newCampaign = {
      id: "camp-" + Date.now(),
      subject,
      bodyText,
      sentCount: activeSubs.length,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem("woodasaNewslettersSent", JSON.stringify([newCampaign, ...sentCampaigns]));

    toast({
      title: "Campaign Dispatched",
      description: `Emailed "${subject}" successfully to ${activeSubs.length} active subscribers.`
    });

    setSubject("");
    setBodyText("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans-premium">
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-950">Newsletter Campaigns</h2>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mt-1">Manage subscribers and compose email newsletters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Subscriber list (Premium Glassmorphic) */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-zinc-950 text-lg">Subscriber Directory</h3>
            
            {/* Add Subscriber Mini Form */}
            <form onSubmit={handleAddSubscriber} className="flex gap-2">
              <input
                type="email"
                required
                value={newSubEmail}
                onChange={(e) => setNewSubEmail(e.target.value)}
                placeholder="Add subscriber email..."
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-800 bg-white/80"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/60 border-b border-zinc-200/80 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  <th className="p-4 pl-6">Subscriber Email</th>
                  <th className="p-4">Subscribed Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
                {subscribers.length > 0 ? (
                  subscribers.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-zinc-900 flex items-center gap-2">
                        <Mail size={14} className="text-zinc-400" />
                        {sub.email}
                      </td>
                      <td className="p-4">{sub.date}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleSubStatus(sub.email)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            sub.status === "Active" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                              : "bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200"
                          }`}
                          title="Click to toggle status"
                        >
                          {sub.status}
                        </button>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          className="p-1 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-zinc-400">No subscribers in directory.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compose Newsletter (Premium Glassmorphic) */}
        <div className="space-y-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 h-fit">
          <h3 className="font-display font-bold text-zinc-950 text-lg flex items-center gap-2">
            <FileText size={18} className="text-zinc-800" />
            Compose Newsletter
          </h3>
          
          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Sustainable Crafts this Summer"
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 bg-white/70"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">Email Body Content</label>
              <textarea
                rows={5}
                required
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Type your newsletter copy here..."
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 resize-none bg-white/70"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={14} /> Send Newsletter
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
