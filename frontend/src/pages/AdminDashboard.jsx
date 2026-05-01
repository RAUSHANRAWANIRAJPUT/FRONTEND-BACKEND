import React, { useEffect, useState } from 'react';
import { Users, Trash2, Shield, AlertTriangle, NotebookPen, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../lib/api';
import { getDefaultPageForRole } from '../lib/auth';

const AdminDashboard = ({ setActivePage, user }) => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setActivePage('auth');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only admins can open the admin dashboard.');
      setActivePage(getDefaultPageForRole(user.role));
      return;
    }

    loadAdminData();
  }, [user, setActivePage]);

  const getErrorMessage = (error, fallbackMessage) => (
    error.response?.data?.message || fallbackMessage
  );

  const loadAdminData = async () => {
    try {
      setIsRefreshing(true);
      const [usersResponse, notesResponse] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getNotes(),
      ]);

      setUsers(usersResponse.data.users || []);
      setNotes(notesResponse.data.notes || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load admin dashboard'));

      if (error.response?.status === 401) {
        setActivePage('auth');
        return;
      }

      if (error.response?.status === 403) {
        setActivePage('dashboard');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminApi.deleteUser(userId);
      toast.success('User deleted successfully');
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser._id !== userId));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete user'));
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      setUsers((currentUsers) => currentUsers.map((currentUser) => (
        currentUser._id === userId ? { ...currentUser, role: newRole } : currentUser
      )));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update user role'));
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note from the admin dashboard?')) return;

    try {
      await adminApi.deleteNote(noteId);
      toast.success('Note deleted successfully');
      setNotes((currentNotes) => currentNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete note'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1930] text-white">
        <div className="text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1930] text-white p-8 overflow-y-auto w-full pt-20 lg:pt-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-10 w-10 text-[#efc45d]" />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-[#c8b78f]">Manage users, roles, and notes with protected admin APIs.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadAdminData}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(212,166,58,0.18)] bg-[#17233c] px-4 py-2 text-sm font-semibold text-[#efc45d] transition-colors hover:bg-[#1c2a47] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh data
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[#17233c] p-5 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9d8f6e]">Total Users</p>
            <p className="mt-3 text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[#17233c] p-5 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9d8f6e]">Admins</p>
            <p className="mt-3 text-3xl font-bold text-white">{users.filter((currentUser) => currentUser.role === 'admin').length}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[#17233c] p-5 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9d8f6e]">Saved Notes</p>
            <p className="mt-3 text-3xl font-bold text-white">{notes.length}</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[#17233c] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#efc45d] flex items-center gap-2">
              <Users size={20} /> Registered Users ({users.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2d3a54] text-[#a6bbaea]">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-[#2d3a54]/50 hover:bg-[#1c2a47] transition-colors">
                    <td className="p-4 text-white font-medium">{u.name}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-[#efc45d]/20 text-[#efc45d]' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleToggleRole(u._id, u.role)}
                        disabled={u._id === user.id} // prevent self-demotion
                        className="p-2 rounded-lg bg-[#2d3a54] text-white hover:bg-[#efc45d] hover:text-[#0d1930] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Toggle Role"
                      >
                        <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u._id === user.id} // prevent self-deletion
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400">
                      <AlertTriangle className="mx-auto mb-2 opacity-50" size={24} />
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(212,166,58,0.16)] bg-[#17233c] p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#efc45d]">
              <NotebookPen size={20} /> Notes Management ({notes.length})
            </h2>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2d3a54] p-8 text-center text-gray-400">
                <AlertTriangle className="mx-auto mb-2 opacity-50" size={24} />
                No notes found.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#2d3a54] bg-[#111a2e] p-5 md:flex-row md:items-start md:justify-between"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                      <span className="rounded-full bg-[rgba(239,196,93,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#efc45d]">
                        {note.type}
                      </span>
                    </div>
                    <p className="max-w-3xl text-sm leading-6 text-[#c7d0e0]">{note.content}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                    Delete note
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
