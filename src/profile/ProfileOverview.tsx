import type { AuthUser } from '../contexts/AuthContext';

interface ProfileOverviewProps {
    user: AuthUser;
    orderCount: number;
}

export function ProfileOverview({ user, orderCount }: ProfileOverviewProps) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center uppercase shadow-md shadow-indigo-600/20">
            {user.username.charAt(0) || 'U'}
            </div>
            <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>{user.username}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Active Member
                </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email || `${user.username}@example.com`}
            </p>
            </div>
        </div>

        <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Orders</span>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
            {orderCount}
            </span>
        </div>
        </div>
    );
    }

export default ProfileOverview;