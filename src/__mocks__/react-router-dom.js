// Mock for react-router-dom
import React from "react";

// Global mock state to control active routes
let mockActiveRoute = null;

export const setMockActiveRoute = (route) => {
  mockActiveRoute = route;
};

export const NavLink = ({ children, className, to, ...props }) => {
  const isActive = mockActiveRoute === to;
  const classNames =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <a
      className={classNames}
      href={to}
      data-testid={`nav-link-${to}`}
      {...props}
    >
      {children}
    </a>
  );
};

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const MemoryRouter = ({ children }) => <div>{children}</div>;
export const Router = ({ children }) => <div>{children}</div>;
export const Route = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
