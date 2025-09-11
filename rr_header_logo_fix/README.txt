# Header logo fix
Copy these into your project:

- `public/logo.png`  (logo you sent, renamed to logo.png)
- `public/style.css` (header sizing updated)

Header HTML should have:

<header class="brand">
  <div class="brand__bar"></div>
  <div class="container brand__wrap">
    <img class="brand__logo" src="/logo.png" alt="RR logo">
    <div class="brand__text">
      <h1>RR</h1>
      <p>Privado, seguro y de confianza</p>
    </div>
  </div>
  <div class="brand__bar brand__bar--bottom"></div>
</header>
