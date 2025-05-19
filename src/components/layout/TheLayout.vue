<script></script>

<template>
  <div class="wrapper">
    <header class="box header">
      <slot name="header"></slot>
    </header>
    <aside class="box sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <section class="box content">
      <slot name="content"></slot>
    </section>
    <footer class="box footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.sidebar {
  grid-area: sidebar;
}
.header {
  grid-area: header;
  z-index: 1500;
}
.content {
  grid-area: content;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}
.footer {
  grid-area: footer;
}
.wrapper {
  display: grid;
  grid-gap: 0px;
  grid-template-rows: 100px repeat(4, 50px) 1fr 80px; /* header, (snb) main, footer */
  grid-template-columns: repeat(4, 50px) 1fr; /* snb, content */
  grid-template-areas:
    'header header header header header'
    'sidebar sidebar sidebar sidebar content'
    'sidebar sidebar sidebar sidebar content'
    'sidebar sidebar sidebar sidebar content'
    'sidebar sidebar sidebar sidebar content'
    'sidebar sidebar sidebar sidebar content'
    'sidebar sidebar sidebar sidebar footer';
}
.box {
  background-color: #fff;
  font-size: 100%;
}
/* 테블렛 화면 */
@media screen and (min-width: 768.01px) and (max-width: 992px) {
  .wrapper {
    grid-template-areas:
      'header header header header header'
      'sidebar content content content content'
      'sidebar content content content content'
      'sidebar content content content content'
      'sidebar content content content content'
      'sidebar content content content content'
      'sidebar footer footer footer footer';
  }
}
/* 모바일 화면 */
@media screen and (max-width: 768px) {
  .wrapper {
    grid-template-areas:
      'header header header header header'
      'sidebar sidebar sidebar sidebar sidebar'
      'content content content content content'
      'content content content content content'
      'content content content content content'
      'content content content content content'
      'footer footer footer footer footer';
  }
}
</style>
