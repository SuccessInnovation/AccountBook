<script setup>
import FeautureSlider from '@/components/FeautureSlider.vue'
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
            <br />
            <p>오늘도 <strong>배추</strong>하세요</p>
          </div>
        </div>
        <div class="function_slide">
          <FeautureSlider />
          <!-- <h2>제공하는 기능들 보여주는 슬라이드 (아래 > 위 슬라이드)</h2> -->
        </div>
      </div>
      <div class="start-button-box">
        <router-link to="login">시작하기</router-link>
        <!-- <router-link to="home">홈으로</router-link> -->
      </div>
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
  background-color: var(--color-point-4);
  display: flex;
  align-items: center;
  justify-content: center;
}
section {
  justify-items: center;
}
h1 {
  position: relative;
  font-size: 100px;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--color-font-main);
}
h1::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: -3px;
  width: 120px;
  height: 200px;
  background-image: url('../img/cabbage/logo1.png');
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
}
p {
  color: var(--color-brown-dark);
}
/* 좌우 콘텐츠 배치 */
.wrap_content {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;

  align-items: center;

  margin: 0 auto;
  max-width: 960px;
  padding: 3rem;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* 좌측 소개 박스 */
.introduction_box {
  flex: 1 1 400px;
  text-align: left;
  justify-items: center;
}
.introduction_innerbox {
  width: 350px;
  /* border: 1px solid black; */
}
/* 우측 기능 슬라이드 */
.function_slide {
  flex: 1 1 400px;
  width: 500px;
  height: 500px;
  border-radius: 10px;
  padding: 1rem;
  background-color: lightgray;
  align-content: center;
  text-align: justify;
}

/* 시작 버튼 박스 (가운데 정렬) */
.start-button-box {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 3rem;
}

/* 시작 버튼 스타일 */
.start-button-box {
  width: 300px;
  padding: 1rem 2rem;
  background-color: var(--color-point-1); /* 배추 연두색 느낌 */
  color: white;
  font-weight: bold;
  border-radius: 12px;
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
