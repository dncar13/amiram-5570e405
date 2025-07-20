import React from 'react';

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Account Settings</h1>
        <div className="grid gap-6">
          <div className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
            <p className="text-muted-foreground">Manage your profile settings and preferences here.</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Subscription</h2>
            <p className="text-muted-foreground">View and manage your subscription details.</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Study Preferences</h2>
            <p className="text-muted-foreground">Customize your learning experience and study settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;