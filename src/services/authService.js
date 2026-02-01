export function login(email, senha) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "vendedor@revisao.com" && senha === "revisao123") {
        resolve({
          token: "fake-jwt-token",
          user: {
            nome: "Vendedor Teste",
            email: email
          }
        });
      } else {
        reject("Credenciais inválidas");
      }
    }, 1000);
  });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
