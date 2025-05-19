<!-- src/components/CalendarContent.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { use_calendar_store } from '@/stores/MonthSelector'

const calendar = use_calendar_store()
const { visible_months } = storeToRefs(calendar)
const month_names = calendar.month_names
</script>

<template>
  <div class="calendar_carousel">
    <button type="button" class="arrow" @click="calendar.go_to_prev_month">
      &lt;
    </button>

    <div class="month_slider">
      <div
        v-for="(month, index) in visible_months"
        :key="index"
        class="month_item"
      >
        <p id="year" :class="{ active: index === 1, faded: index !== 1 }">
          {{ month.year }}
        </p>
        <p id="month" :class="{ active: index === 1, faded: index !== 1 }">
          {{ month_names[month.month] }}
        </p>
      </div>
    </div>

    <button type="button" class="arrow" @click="calendar.go_to_next_month">
      &gt;
    </button>
  </div>
</template>

<style scoped>
.calendar_carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.month_slider {
  display: flex;
  width: 350px;
  overflow: hidden;
  justify-content: space-around;
}
.month_item {
  width: 100px;
  text-align: center;
  opacity: 0.6;
  transform: scale(0.9);
  transition: all 0.5s ease;
}
#year {
  font-size: 30px;
  margin: 0px;
  padding: 0px;
}
#month {
  font-size: 45px;
}
.faded {
  opacity: 0.7;
}
#year.faded {
  font-size: 20px;
  margin-top: 30px;
}
#month.faded {
  font-size: 35px;
}
.active {
  font-weight: bold;
  opacity: 1;
  transform: scale(1.1);
}
.arrow {
  font-size: 3rem;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--color-point-1);
  transition: transform 0.2s ease;
}
.arrow:hover {
  transform: scale(1.2);
}
</style>
