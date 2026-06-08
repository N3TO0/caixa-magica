
export const apiMockUpdateAccount = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("📡 Enviado para backend:", data);

      // simula sucesso 90%
      Math.random() > 0.1
        ? resolve({ status: 200 })
        : reject(new Error("Erro no servidor"));
    }, 1500);
  });
};