<template>
  <div class="item">
    <div>
      <v-checkbox
        :label="item.name"
        color="indigo"
        v-model="CheckboxVal"
        @click="$emit('markComplete', index)"
        :value="true"
        :disabled="disabled"
        :false-value="false"
        :true-value="true"
      ></v-checkbox>
      <p>{{item.description}}</p>
    </div>
    <div>
      <p class="date" :class="{'disabled': disabled}">
        {{ format(item.expDate) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'

const props = defineProps(['item', 'disabled', 'index', 'taskType'])
const { item, disabled, index, taskType } = toRefs(props)

 function format(date: Date): string {
    return `${new Date(date).toLocaleDateString('default', { month: 'short' })} ${new Date(date).getDate()}, ${new Date(date).getFullYear()}`;
 }


 const CheckboxVal = computed(() => {
  return taskType as any === 'outstanding' ? false : item?.value.completed
})
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

.item {
  display: flex;
  justify-content: space-between;
}

.date {
  font-size: 14px;
  color: #667085;
  text-align: right;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (max-width: 950px) {
  .item {
    display: block!important;
  }
}
</style>
