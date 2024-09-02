import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
