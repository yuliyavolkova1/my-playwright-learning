import { test } from "@playwright/test";

const user = {
  email: "standard_user@test.com",
  password: "secret_sauce",
};

test("данные пользователя выводятся верно", async () => {
  const { email, password } = user;
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("URL:", `https://staging.example.com/login`);
});