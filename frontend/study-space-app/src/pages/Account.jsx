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
        <div style={{ maxWidth: 640, margin: "2rem auto" }}>
            <h1 className="page-title">Account</h1>

            <div className="study-card mt-2">
                <form onSubmit={handleUpdate} className="form">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <button className="btn">Update Profile</button>
                </form>

                <form onSubmit={handleChangePassword} className="form" style={{ marginTop: 12 }}>
                    <input type="password" placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                    <input type="password" placeholder="New password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                    <button className="btn ghost">Change Password</button>
                </form>

                <div style={{ marginTop: 12 }}>
                    <button onClick={handleDeleteAccount} className="btn" style={{ background: "var(--danger)" }}>Delete Account</button>
                </div>
            </div>
        </div>
    );
}
