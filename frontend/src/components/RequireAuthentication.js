import { Navigate, useLocation } from 'react-router-dom'


const RequireAuthentication = ({ children }) => {
    const token = localStorage.getItem('access') || ''
  
    const location = useLocation()
  
    return token ? (
      children
    ) : (
      <Navigate to="/login" replace state={{ previousLocation: location }} />
    )
  }
  
  export default RequireAuthentication