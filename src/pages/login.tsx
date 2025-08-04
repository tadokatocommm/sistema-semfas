import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface UnitType {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  name: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('admin@shelter.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitType, setSelectedUnitType] = useState('');
  
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        const response = await fetch('/api/units/types');
        const data = await response.json();
        setUnitTypes(data);
      } catch (err) {
        setError('Não foi possível carregar os tipos de unidade.');
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchUnitTypes();
  }, []);

  useEffect(() => {
    if (!selectedUnitType) {
      setUnits([]);
      return;
    }

    const fetchUnits = async () => {
      setIsLoadingUnits(true);
      try {
        const response = await fetch(`/api/units?typeId=${selectedUnitType}`);
        const data = await response.json();
        setUnits(data);
      } catch (err) {
        setError('Não foi possível carregar as unidades específicas.');
      } finally {
        setIsLoadingUnits(false);
      }
    };
    fetchUnits();
  }, [selectedUnitType]);


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
              <select
                id="unit-type"
                value={selectedUnitType}
                onChange={(e) => setSelectedUnitType(e.target.value)}
                disabled={isLoadingTypes}
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">{isLoadingTypes ? 'Carregando...' : 'Selecione o tipo'}</option>
                {unitTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="specific-unit" className="text-sm font-bold text-gray-600 tracking-wide">
                Unidade Específica
              </label>
              <select
                id="specific-unit"
                disabled={!selectedUnitType || isLoadingUnits}
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">{isLoadingUnits ? 'Carregando...' : 'Selecione a unidade'}</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
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
