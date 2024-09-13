<template>
  <v-container class="">
    <v-row no-gutters>
      <v-col>
        <v-container class="">
          <v-row no-gutters>
            <v-col cols="9">
              <h2>To Do</h2>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="7">
              <v-responsive class="task-name">
                <v-text-field
                  density="compact"
                  :class="{'err': showErr}"
                  single-line
                  hide-details
                  variant="solo"
                  placeholder="Task Name*"
                  v-model="todoItem.name"
                ></v-text-field>
              </v-responsive>
            </v-col>
            <v-col>
              <v-text-field
                placeholder="mm/dd/yyyy"
                max-width="368"
                type="date"
                single-line
                hide-details
                variant="solo"
                density="compact"
                v-model="todoItem.expDate"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-responsive class="" max-width="344">
                <v-btn
                  prepend-icon="mdi-plus"
                  @click="addTodoItem"
                  color="blue-grey-darken-2"
                >
                  <template v-slot:prepend>
                    <v-icon color="white"></v-icon>
                  </template>
                  Add
                </v-btn>
              </v-responsive>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="9">
              <v-responsive max-width="749">
                <v-textarea
                  label="Description(Optional)"
                  variant="solo"
                  v-model="todoItem.description"
                ></v-textarea>
              </v-responsive>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <h3>
          Overdue <span> {{ GetOutDueTaskCount }} </span>
        </h3>
        <div class="exp-dates">
          <todo-item
            v-for="(item, index) in GetTodoItemsList.overDue"
            :index="index"
            taskType="overDue"
            :disabled="true"
            :item="item"
          />
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <h3>
          Outstanding <span> {{ GetOutStandingTaskCount }} </span>
        </h3>
        <div>
          <todo-item
            v-for="(item, index) in GetTodoItemsList.outstanding"
            taskType="outstanding"
            @markComplete="markTaskCompleted"
            :disabled="false"
            :index="index"
            :item="item"
          />
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <h3>
          Completed <span> {{ GetCompletedTaskCount }} </span>
        </h3>
        <div>
          <todo-item
            v-for="(item, index) in GetTodoItemsList.compeleted"
            taskType="compeleted"
            :disabled="true"
            :index="index"
            :item="item"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import TodoItem from '../components/TodoItem.vue'
import { ref, computed, reactive, onMounted } from 'vue'
import { useStore } from '../stores/todoApp'

const store = useStore();

let todoItem = reactive({
  name : '',
  description: '',
  expDate: getDefaultDate(),
})

  let showErr = ref(false)


  onMounted(() => {
    watchDates()
  })

function addTodoItem(): boolean | void {
  if (!todoItem.name) {
    showErr.value = true as any;
    return false;
  }
  showErr = false as any;
  store.addItem(JSON.parse(JSON.stringify(todoItem)));
  resetValues();
}

function markTaskCompleted(i:number): void {
  store.completeTask(i);
}

function resetValues(): void {
  Object.assign(todoItem, {  name : '',
  description: '',
  expDate: getDefaultDate()})
}

const GetTodoItemsList = computed(() => {
  return store.todo;
})

const GetOutDueTaskCount = computed(() => {
  return store.todo.overDue?.length;
})

const GetOutStandingTaskCount = computed(() => {
  return store.todo.outstanding?.length;
})

const GetCompletedTaskCount = computed(() => {
  return store.todo.compeleted?.length;
})


function watchDates(): void {
    setInterval(()=>{
      store.todo.outstanding.forEach((x, i)=>{
          if ((new Date(x.expDate).setHours(0,0,0,0) !== new Date().setHours(0,0,0,0)) && new Date(x.expDate) < new Date()) {
              store.moveTasksToOverDue(i)
          }
      })
      console.log('called')
    },10000)
}

function getDefaultDate(): Date {
  const date = new Date();
  const day = date.getDate() + 4;
  return new Date(date.setDate(day));
}
</script>
