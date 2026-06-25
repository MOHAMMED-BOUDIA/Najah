import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useStudentAccess from '../../hooks/useStudentAccess';
import Loader from '../common/Loader';

const StudentRouteGuard = ({ children }) => {
  const { user } = useAuth();
  const { isApproved, loading } = useStudentAccess();

  if (user?.role !== 'student') {
    return children;
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isApproved) {
    return <Navigate to="/instructors" replace />;
  }

  return children;
};

export default StudentRouteGuard;
