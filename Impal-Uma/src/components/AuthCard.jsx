export default function AuthCard({ title, children }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}