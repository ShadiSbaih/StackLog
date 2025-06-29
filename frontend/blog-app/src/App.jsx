import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import BlogLandingPage from "./Pages/Blog/components/BlogLandingPage";
import BlogPostView from "./Pages/Blog/components/BlogPostView";
import PostByTags from "./Pages/Blog/components/PostByTags";
import SearchPosts from "./Pages/Blog/components/SearchPosts";
import AdminLogin from "./Pages/Admin/components/AdminLogin";
import Dashboard from "./Pages/Admin/components/Dashboard";
import BlogPosts from "./Pages/Admin/components/BlogPosts";
import BlogPostEditor from "./Pages/Admin/components/BlogPostEditor";
import Comments from "./Pages/Admin/components/Comments";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider from "./context/userContext";

function App() {
  return (
    <UserProvider>
    <div >
      <Router>
        <Routes>
          {/* Default Route*/}
          <Route path="/" element={<BlogLandingPage />} />
          <Route path="/:slug" element={<BlogPostView />} />
          <Route path="/tag/:tagName" element={<PostByTags />} />
          <Route path="/search" element={<SearchPosts />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/posts" element={<BlogPosts />} />
            <Route path="/admin/create" element={<BlogPostEditor />} />
            <Route path="/admin/edit/:postSlug" element={<BlogPostEditor isEdit={true} />} />
            <Route path="/admin/comments" element={<Comments />} />
          </Route>

          {/* Public Admin Login Route */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
        </Routes>
      </Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#00be78',
            color: '#fff',
          },
        }}
      />
    </div>
    </UserProvider>
  )
}

export default App