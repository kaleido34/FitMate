import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { apiUrl } from '../config'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🚀 Starting signup request...');
      const response = await fetch(apiUrl('/api/user/signup'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const json = await response.json()
      console.log('📦 Response data:', json);

      if (!response.ok) {
        setIsLoading(false)
        setError(json.error)
      }
      if (response.ok) {
        // save the user to local storage
        localStorage.setItem('user', JSON.stringify(json))

        // update the auth context
        dispatch({type: 'LOGIN', payload: json})

        // update loading state
        setIsLoading(false)
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      setIsLoading(false)
      setError('Network error - could not connect to server')
    }
  }

  return { signup, isLoading, error }
}