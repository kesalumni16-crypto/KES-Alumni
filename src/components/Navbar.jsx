@@ .. @@
           {/* Auth Section */}
           <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-300">
             {user ? (
               <>
-                {user.role === 'SUPERADMIN' && (
+                {user.role === 'SUPERADMIN' && (
                   <Link 
                     to="/superadmin" 
                     className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                       isActive('/superadmin')
                         ? 'text-red-600 border-b-2 border-red-600'
                         : 'text-gray-700 hover:text-red-600'
                     }`}
                   >
                     <FaUserShield className="mr-2" />
-                    SuperAdmin
+                    SuperAdmin Panel
                   </Link>
                 )}
+                {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
+                  <Link 
+                    to="/admin" 
+                    className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
+                      isActive('/admin')
+                        ? 'text-red-600 border-b-2 border-red-600'
+                        : 'text-gray-700 hover:text-red-600'
+                    }`}
+                  >
+                    <FaCog className="mr-2" />
+                    Admin Panel
+                  </Link>
+                )}
                 <Link 
                   to="/profile" 
                   className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                     isActive('/profile')
                       ? 'text-red-600 border-b-2 border-red-600'
                       : 'text-gray-700 hover:text-red-600'
                   }`}
                 >
                   <FaUser className="mr-2" />
                   Dashboard
                 </Link>
@@ .. @@
               <div className="border-t border-gray-200 pt-4 mt-4">
                 {user ? (
                   <>
-                    {user.role === 'SUPERADMIN' && (
+                    {user.role === 'SUPERADMIN' && (
                       <Link 
                         to="/superadmin" 
                         onClick={() => setIsMobileMenuOpen(false)}
                         className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                           isActive('/superadmin')
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                             : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                         }`}
                       >
                         <FaUserShield className="mr-3" />
-                        SuperAdmin
+                        SuperAdmin Panel
                       </Link>
                     )}
+                    {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
+                      <Link 
+                        to="/admin" 
+                        onClick={() => setIsMobileMenuOpen(false)}
+                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
+                          isActive('/admin')
+                            ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
+                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
+                        }`}
+                      >
+                        <FaCog className="mr-3" />
+                        Admin Panel
+                      </Link>
+                    )}
                     <Link 
                       to="/profile" 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                         isActive('/profile')
                           ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                           : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                       }`}
                     >
                       <FaUser className="mr-3" />
                       Dashboard
                     </Link>