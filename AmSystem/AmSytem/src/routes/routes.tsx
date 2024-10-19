import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { PaisesPage } from "../pages/paisesPage/index.tsx";
import { EstadosPage } from "../pages/estadosPage/index.tsx";
import { CidadesPage } from "../pages/cidadesPage/index.tsx";
import { ClientesPage } from "../pages/clientesPage/index.tsx";
import { FornecedoresPage } from "@/pages/fornecedoresPage/index.tsx";
import { ProdutosPage } from "@/pages/produtosPage/index.tsx";
import { FuncionariosPage } from "@/pages/funcionarioPage/index.tsx";
import { CondicoesPagamentosPage } from "@/pages/condicoesPagamentosPage/index.tsx";
import { FormasPagamentosPage } from "@/pages/formasPagamentosPage/index.tsx";
import { CategoriasPage } from "@/pages/categoriasPage/index.tsx";
import { UnidadesMedidasPage } from "@/pages/unidadeMedidaPage/index.tsx";
import { ComprasPage } from "@/pages/comprasPage/index.tsx";
import ContasPagarPage from "@/pages/contasPagarPage/index.tsx";
import VendasPage from "@/pages/vendasPage/index.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "paises", element: <PaisesPage /> },
      { path: "estados", element: <EstadosPage /> },
      { path: "cidades", element: <CidadesPage /> },
      { path: "clientes", element: <ClientesPage /> },
      { path: "fornecedores", element: <FornecedoresPage /> },
      { path: "produtos", element: <ProdutosPage /> },
      { path: "funcionarios", element: <FuncionariosPage /> },
      { path: "condicoesPagamentos", element: <CondicoesPagamentosPage /> },
      { path: "formasPagamentos", element: <FormasPagamentosPage /> },
      { path: "categorias", element: <CategoriasPage /> },
      { path: "unidadesMedidas", element: <UnidadesMedidasPage /> },
      { path: "compras", element: <ComprasPage /> },
      { path: "contasPagar", element: <ContasPagarPage /> },
      { path: "vendas", element: <VendasPage /> },
    ],
  },
]);
