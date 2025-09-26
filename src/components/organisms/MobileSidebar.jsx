import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
const menuItems = [
    { icon: "LayoutDashboard", label: "Dashboard", path: "/" },
    { icon: "BookOpen", label: "Courses", path: "/courses" },
    { icon: "Users", label: "Students", path: "/students" },
    { icon: "GraduationCap", label: "Teachers", path: "/teachers" },
    { icon: "FileText", label: "Assignments", path: "/assignments" },
    { icon: "Calculator", label: "GPA Calculator", path: "/gpa" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="GraduationCap" size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        StudySync
                      </h1>
                      <p className="text-xs text-slate-500">Academic Manager</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20 shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            size={20} 
                            className={isActive ? "text-primary" : "text-slate-500"} 
                          />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Student</p>
                    <p className="text-xs text-slate-500 truncate">Academic Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;