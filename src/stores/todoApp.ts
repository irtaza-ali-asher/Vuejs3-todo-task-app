import { defineStore } from 'pinia'


interface State {
  todo: items
}

interface items {
  overDue: Array<item>
  outstanding: Array<item>
  compeleted: Array<item>
}

interface item {
  name: string,
  expDate: string | Date,
  description: string,
  completed: boolean
}

export const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: (): State => {
    return {
      // all these properties will have their type inferred automatically
      todo: {
        overDue: [
          {
            name: 'Moms Birthday',
            expDate: getPrevDate(),
            description: 'Get preset and cards',
            completed: false
          }
        ],
        outstanding: [
          {
            name: 'Moms Birthday',
            expDate: getCurrentDate(),
            description: 'Get preset and cards',
            completed: false
          }
        ],
        compeleted: [
          {
            name: 'Moms Birthday',
            expDate:  getCurrentDate(),
            description: 'Get preset and cards',
            completed: true
          }
        ],
      }

      
    }
  },

  getters: {
    getTodoList: (state) => state.todo
  },

  actions: {
    async addItem(data:any) {
      let tempArr = this.todo.outstanding;
      tempArr.push(data);
      this.todo.outstanding = tempArr;
    },

    async completeTask(i:any) {
      this.todo.compeleted.push(this.todo.outstanding[i]);
      const totalLength = this.todo.compeleted.length;
      this.todo.compeleted[totalLength - 1].completed = true;
      this.todo.outstanding.splice(i,1);
    },

    async moveTasksToOverDue(i:number) {
      this.todo.overDue.push(this.todo.outstanding[i]);
      const totalLength = this.todo.compeleted.length;
      this.todo.compeleted[totalLength - 1].completed = false;
      this.todo.outstanding.splice(i,1);
    }
  }
})

function getPrevDate(): Date {
  const date = new Date();
  const day = date.getDate() - 1;
  return new Date(date.setDate(day));
}

function getCurrentDate(): Date {
  const date = new Date();
  const day = date.getDate();
  return new Date(date.setDate(day));
}
