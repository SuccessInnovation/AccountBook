<script setup>
import FeautureSlider from '@/components/start/FeautureSlider.vue'
</script>

<template>
  <div class="StartPage">
    <section>
      <div class="wrap_content">
        <div class="introduction_box">
          <div class="introduction_innerbox">
            <h1>배추</h1>
            <p>
              그 어디에서도 경험하지 못한 <br /><strong
                >실속 그 자체 온라인 가계부 배추!</strong
              >
            </p>
            <p>오늘도 <strong>배추</strong>하세요~</p>
          </div>
        </div>
        <div class="function_slide">
          <FeautureSlider />
          <!-- <h2>제공하는 기능들 보여주는 슬라이드 (아래 > 위 슬라이드)</h2> -->
        </div>
      </div>
      <router-link to="login" class="start-button-box">시작하기</router-link>
    </section>
  </div>
</template>

<style scoped>
/* 전체 래핑 */
.StartPage,
.wrap_content,
.introduction_box,
h1 {
  overflow: visible;
}
.StartPage {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
section {
  justify-items: center;
}
.wrap_content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width: 1000px;
  max-height: 560px;
  padding: 3rem;
  background-color: var(--box-bg-color);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
h1 {
  position: relative;
  font-size: 80px;
  margin-bottom: 2rem;
  margin-top: 0;
  color: var(--color-font-main);
  font-weight: 600;
}
h1::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 0;
  width: 140px;
  height: 220px;
  background-image: url('../img/cabbage/logo1.svg');
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
}
p {
  color: #706d54;
  font-size: 16px;
}

/* 좌측 소개 박스 */
.introduction_box {
  flex: 1 1 400px;
  text-align: left;
  justify-items: center;
}
.introduction_innerbox {
  width: 350px;
}
/* 우측 기능 슬라이드 */
.function_slide {
  flex: 1 1 400px;
  width: 430px;
  height: 445px;
  border-radius: 10px;
  padding: 1rem;
  background-color: #f3f7f1;
  align-content: center;
  text-align: justify;
}

/* 시작 버튼 스타일 */
.start-button-box {
  position: fixed;
  top: 87%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 360px;
  height: 60px;
  line-height: 60px;
  background-color: var(--btn-main-color);
  border-radius: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  color: white;
  font-weight: 500;
  font-size: 30px;

  text-decoration: none;
  transition: background-color 0.3s;
}

.start-button-box:hover {
  background-color: var(--color-brown-light);
}

@keyframes slide-up {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
