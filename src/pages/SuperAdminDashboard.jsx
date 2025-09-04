@@ .. @@
   // Redirect if not superadmin
   useEffect(() => {
-    if (user && user.role !== 'SUPERADMIN') {
+    if (user && user.role === 'ALUMNI') {
       navigate('/profile');
       toast.error('Access denied. Superadmin privileges required.');
+    } else if (user && user.role === 'ADMIN') {
+      navigate('/admin');
+      toast.error('Access denied. Superadmin privileges required.');
+    } else if (user && user.role !== 'SUPERADMIN') {
+      navigate('/');
+      toast.error('Access denied. Superadmin privileges required.');
     }
   }, [user, navigate]);