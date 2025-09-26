import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
        <ApperIcon name="User" size={18} className="text-white" />
      </div>
      <button
        onClick={logout}
        className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

const getPageTitle = () => {
switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/courses":
        return "Courses";
      case "/students":
return "Students";
      case "/teachers":
        return "Teachers";
      case "/departments":
        return "Departments";
      case "/assignments":
        return "Assignments";
      case "/gpa":
        return "GPA Calculator";
      default:
        return "StudySync";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome back to your academic dashboard
                </p>
</div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                  <ApperIcon name="Bell" size={20} />
                </button>
                <LogoutButton />
              </div>
            </div>
          </header>
          
          {/* Desktop Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            
<div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <ApperIcon name="Bell" size={20} />
              </button>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />

        {/* Mobile Main Content */}
        <main className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;