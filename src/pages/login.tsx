import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function LoginPage() {
  const [email, setEmail] = useState('admin@smfas.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no login');
      }

      localStorage.setItem('authToken', data.token);

      router.push('/dashboard'); 

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Sistema SMFAS</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Sistema Integrado SMFAS</h1>
            <p className="text-gray-500">Secretaria Municipal da Família e Assistência Social</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="unit-type" className="text-sm font-bold text-gray-600 tracking-wide">
                Tipo de Unidade
              </label>
              <input
                id="unit-type"
                type="text"
                value="ABRIGO"
                readOnly
                className="w-full p-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="specific-unit" className="text-sm font-bold text-gray-600 tracking-wide">
                Unidade Específica
              </label>
              <input
                id="specific-unit"
                type="text"
                value="ABRIGO NÚBIA MARQUES"
                readOnly
                className="w-full p-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 tracking-wide">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-600 tracking-wide">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full p-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}