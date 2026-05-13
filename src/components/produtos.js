import berco from "../img/images/berco.jpg";
import tapete from "../img/images/tapete.jpg";

export const produtos = [
  {
    id: 1,
    nome: "Berço Portátil",
    descricao: "Conforto e segurança para o bebê.",
    idade: "0-6 meses",
    imagem: berco,
    precos: {
      3: 60,
      7: 90,
      15: 140,
      30: 200,
    },
  },
  {
    id: 2,
    nome: "Tapete de Atividades",
    descricao: "Estimula coordenação motora.",
    idade: "0-6 meses",
    imagem: tapete,
    precos: {
      3: 50,
      7: 80,
      15: 120,
      30: 180,
    },
  },
];