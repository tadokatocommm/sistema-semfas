import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
  userId: string;
  email: string;
  unitName: string;
  unitTypeName: string;
  iat: number;
  exp: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token inválido:", error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);


  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Bem-vindo ao Dashboard!
        </h1>
        <div className="p-6 border-t border-gray-200">
          <p className="text-lg"><span className="font-bold">Usuário:</span> {user.email}</p>
          <p className="text-lg"><span className="font-bold">Tipo de Unidade:</span> {user.unitTypeName}</p>
          <p className="text-lg"><span className="font-bold">Unidade Específica:</span> {user.unitName}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            router.push('/login');
          }}
          className="w-full p-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Sair (Logout)
        </button>
      </div>
    </div>
  );
}
