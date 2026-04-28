export default function AuthCard({ title, children }) {
    return (
        <div className="auth-wrapper">
        <div className="auth-card">

            {title && <h1>{title}</h1>}

            <div className="auth-body">
            {children}
            </div>

        </div>
        </div>
    );
}
