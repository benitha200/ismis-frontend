// 'use client';

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// function Login() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });

//   // For development - hardcoded credentials
//   const devCredentials = {
//     email: 'admin@example.com',
//     password: 'admin123'
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Development login check
//     if (formData.email === devCredentials.email && 
//         formData.password === devCredentials.password) {
//       // Store some dummy auth token
//       localStorage.setItem('isAuthenticated', 'true');
//       localStorage.setItem('user', JSON.stringify({ 
//         name: 'Admin User', 
//         email: formData.email, 
//         role: 'admin' 
//       }));
      
//       // Redirect to dashboard
//       navigate('/dashboard');
//     } else {
//       alert('Invalid credentials! Use admin@example.com / admin123');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <img src="/logo/logo.svg" alt="MINISPORTS" className="h-16 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-900">MIS - MINISPORTS</h1>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-8">
//           <h2 className="text-xl font-semibold mb-2">Login to continue</h2>
//           <p className="text-gray-500 mb-6">Welcome back, enter your credentials to continue</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   {showPassword ? 
//                     <EyeOff className="w-5 h-5 text-gray-400" /> : 
//                     <Eye className="w-5 h-5 text-gray-400" />
//                   }
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Login
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-500">
//             Don't have an account?{' '}
//             <a href="#" className="text-blue-600 hover:underline">
//               Contact us
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login; 

'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../constants/const';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Create an axios instance with custom config
    const axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await axiosInstance.post('auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Assuming the API returns a token and user info
      const { token, user } = response.data;

      // Store authentication details
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // More detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error processing login. Please try again.');
      }
      console.error('Login error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo/logo.svg" alt="MINISPORTS" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">MIS - MINISPORTS</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-2">Login to continue</h2>
          <p className="text-gray-500 mb-6">Welcome back, enter your credentials to continue</p>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5 text-gray-400" /> : 
                    <Eye className="w-5 h-5 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;