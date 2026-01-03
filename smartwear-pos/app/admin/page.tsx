export default function AdminDashboard() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-10 rounded-xl shadow-xl">
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome, Administrator. Restricted Access Area.</p>
                <p className="text-sm text-slate-400 mt-4">This page is protected by RBAC Middleware.</p>
            </div>
        </div>
    )
}
