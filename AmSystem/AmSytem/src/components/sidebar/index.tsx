import { Link } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const menuList = [
    {
      group: "Cadastros",
      items: [
        {
          key: 1,
          link: "/paises",
          text: "Países",
          icon: <Map />,
        },
        {
          key: 2,
          link: "/estados",
          text: "Estados",
          icon: <MapPinned />,
        },
        {
          key: 3,
          link: "/cidades",
          text: "Cidades",
          icon: <MapPin />,
        },
        {
          key: 4,
          link: "/clientes",
          text: "Clientes",
          icon: <Heart />,
        },
        {
          key: 5,
          link: "/fornecedores",
          text: "Fornecedores",
          icon: <Truck />,
        },
        {
          key: 6,
          link: "/produtos",
          text: "Produtos",
          icon: <Barcode />,
        },
        {
          key: 7,
          link: "/funcionarios",
          text: "Funcionários",
          icon: <User />,
        },
        {
          key: 8,
          link: "/condicoesPagamentos",
          text: "Condições de Pagamentos",
          icon: <WalletCards />,
        },
        {
          key: 9,
          link: "/formasPagamentos",
          text: "Formas de Pagamentos",
          icon: <CreditCard />,
        },
        {
          key: 10,
          link: "/categorias",
          text: "Categorias",
          icon: <Layers3 />,
        },
        {
          key: 11,
          link: "/unidadesMedidas",
          text: "Unidades de Medidas",
          icon: <Ruler />,
        },
      ],
    },
  ];

  return (
    <div className="w-[300px] min-w-[300px] border-r min-h-screen p-4 flex flex-col gap-4">
      <UserItem />
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((option: any, optionKey: number) => (
                  <Link
                    to={option.link}
                    key={option}
                    onClick={() => setSelectedItem(option.link)}
                    className="!hover:bg-none"
                  >
                    <CommandItem
                      key={optionKey}
                      className="flex gap-2 curor-pointer"
                      // className={`hover:bg-none flex gap-2 cursor-pointer ${
                      //   selectedItem === option.link
                      //     ? "bg-blue-500 text-white"
                      //     : ""
                      // }`}
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
