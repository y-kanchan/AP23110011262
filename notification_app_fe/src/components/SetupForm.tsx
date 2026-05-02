// src/components/SetupForm.tsx

import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Loader2, Mail, User, Phone, Github, Hash, Key } from "lucide-react";

export function SetupForm() {
  const { registerUserAction, enterMockMode } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const formData = new FormData(event.currentTarget);
    const registrationPayload = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      mobileNo: formData.get("mobileNo") as string,
      githubUsername: formData.get("githubUsername") as string,
      rollNo: formData.get("rollNo") as string,
      accessCode: formData.get("accessCode") as string,
    };

    try {
      await registerUserAction(registrationPayload);
    } catch (error: any) {
      setSubmissionError(error.message || "Registration failed. Please check your details.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card animate-in">
        <div className="setup-header">
          <div className="setup-logo">
            <Mail size={32} color="currentColor" />
          </div>
          <h1>Welcome to Priority Inbox</h1>
          <p>Please complete your registration to access your notifications.</p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input name="name" type="text" placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> College Email</label>
              <input name="email" type="email" placeholder="your_email@srmap.edu.in" required />
            </div>

            <div className="form-group">
              <label><Phone size={16} /> Mobile Number</label>
              <input name="mobileNo" type="tel" placeholder="Mobile Number" required />
            </div>

            <div className="form-group">
              <label><Github size={16} /> GitHub Username</label>
              <input name="githubUsername" type="text" placeholder="Github Username" required />
            </div>

            <div className="form-group">
              <label><Hash size={16} /> Roll Number</label>
              <input name="rollNo" type="text" placeholder="APXXXXXXXXXXX" required />
            </div>

            <div className="form-group">
              <label><Key size={16} /> Access Code</label>
              <input name="accessCode" type="text" placeholder="Enter your access code" required />
            </div>
          </div>

          {submissionError && <div className="form-error">{submissionError}</div>}

          <div className="setup-actions">
            <button type="submit" className="setup-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registering...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>

            <button
              type="button"
              className="setup-skip"
              onClick={enterMockMode}
              disabled={isSubmitting}
            >
              Skip for now (Mock Data)
            </button>
          </div>
        </form>

        <p className="setup-footer">
          Registration will provide your Client ID and Secret automatically.
        </p>
      </div>
    </div>
  );
}
