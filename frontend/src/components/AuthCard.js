import { motion } from "framer-motion";

function AuthCard({ children }) {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <motion.div
        className="card p-4 shadow"
        style={{ width: "400px" }}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default AuthCard;
