import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword, deleteAccount } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const { user, refreshUser, logout } = useAuth();
    const Navigate = useNavigate();
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await updateProfile(form);
            await refreshUser();
            console.log("Update profile response:", response);
            alert("Profile updated successfully");
        } catch (err) {
            console.error("Update profile error:", err);
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwords);
            alert("Password changed successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Password change failed");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;
        try {
            await deleteAccount();
            await logout();
            Navigate("/register");
        } catch (err) {
            alert(err.response?.data?.message || "Account deletion failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded">
            <h2 className="text-2xl font-bold mb-4">Account</h2>

            <form onSubmit={handleUpdate} className="space-y-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded w-full" />
                <button className="bg-blue-600 text-white px-3 py-2 rounded">Update Profile</button>
            </form>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-2">
                <input type="password" placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="border p-2 rounded w-full" />
                <input type="password" placeholder="New password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="border p-2 rounded w-full" />
                <button className="bg-yellow-500 px-3 py-2 rounded">Change Password</button>
            </form>

            <div className="mt-6">
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-3 py-2 rounded">Delete Account</button>
            </div>
        </div>
    );
}