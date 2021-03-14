import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'
import { Image as VanImage,Tab, Tabs,Swipe, SwipeItem,Lazyload,Badge, Sidebar, SidebarItem,Collapse, CollapseItem, Card ,Tag ,Button, Form , Field,Checkbox, CheckboxGroup,Stepper,SwipeCell,SubmitBar  } from 'vant';



createApp(App)
  .use(Swipe).use(SwipeItem).use(Lazyload,{
    loading: require('./assets/images/default.png')
  }).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
  .use(Tab).use(Tabs).use(Card).use(VanImage).use(Tag).use(Button).use(Form)
  .use(Field).use(Checkbox).use(CheckboxGroup).use(Stepper).use(SwipeCell)
  .use(SubmitBar)
  .use(store).use(router).mount('#app')

