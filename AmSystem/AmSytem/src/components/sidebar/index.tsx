import { Link, useLocation } from "react-router-dom";
import { Command, CommandList, CommandGroup, CommandItem } from "../ui/command";
import UserItem from "./userItem";
import {
  Map,
  MapPin,
  MapPinned,
  User,
  Truck,
  Barcode,
  Heart,
  Layers3,
  WalletCards,
  CreditCard,
  Ruler,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react";
import { useState } from "react";
import "./style.css";

export function Sidebar() {
  const location = useLocation();
  const menuList = [
    {
      group: "Cadastros",
      items: [
        {
          link: "/paises",
          text: "Países",
          icon: <Map />,
        },
        {
          link: "/estados",
          text: "Estados",
          icon: <MapPinned />,
        },
        {
          link: "/cidades",
          text: "Cidades",
          icon: <MapPin />,
        },
        {
          link: "/clientes",
          text: "Clientes",
          icon: <Heart />,
        },
        {
          link: "/fornecedores",
          text: "Fornecedores",
          icon: <Truck />,
        },
        {
          link: "/funcionarios",
          text: "Funcionários",
          icon: <User />,
        },
        {
          link: "/produtos",
          text: "Produtos",
          icon: <Barcode />,
        },

        {
          link: "/condicoesPagamentos",
          text: "Condições de Pagamentos",
          icon: <WalletCards />,
        },
        {
          link: "/formasPagamentos",
          text: "Formas de Pagamentos",
          icon: <CreditCard />,
        },
        {
          link: "/categorias",
          text: "Categorias",
          icon: <Layers3 />,
        },
        {
          link: "/unidadesMedidas",
          text: "Unidades de Medidas",
          icon: <Ruler />,
        },
      ],
    },
    {
      group: "Movimentações",
      items: [
        {
          link: "/compras",
          text: "Compras",
          icon: <ShoppingCart />,
        },
        {
          link: "/contasPagar",
          text: "Contas a Pagar",
          icon: <ShoppingCart />,
        },
        {
          link: "/vendas",
          text: "Vendas",
          icon: <BadgeDollarSign />,
        },
        {
          link: "/contasReceber",
          text: "Contas a Receber",
          icon: <BadgeDollarSign />,
        },
      ],
    },
  ];

  return (
    <div className="w-[300px] min-w-[300px] border-r min-h-screen p-4 flex flex-col gap-4">
      <UserItem />
      <div className="grow">
        <Command>
          <CommandList className="max-h-full">
            {menuList.map((menu: any) => (
              <CommandGroup key={menu.group} heading={menu.group}>
                {menu.items.map((option: any) => (
                  <Link
                    key={option.link}
                    to={option.link}
                    // className={`${location.pathname === option.link ? "!text-green-500 !bg-green-500" : "text-black"} bg-transparent`}
                  >
                    <CommandItem
                      aria-selected={location.pathname === option.link}
                      aria-multiselectable="false"
                      aria-disabled="true"
                      className={`${location.pathname === option.link ? "!text-black !bg-green-300" : "!bg-transparent text-black"} `}
                    >
                      {option.icon}
                      {option.text}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
