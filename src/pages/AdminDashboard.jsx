@@ .. @@
   // Redirect if not admin or superadmin
   useEffect(() => {
-    if (user && !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
+    if (user && user.role === 'ALUMNI') {
       navigate('/profile');
       toast.error('Access denied. Admin privileges required.');
+    } else if (user && !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
+      navigate('/');
+      toast.error('Access denied. Admin privileges required.');
     }
   }, [user, navigate]);