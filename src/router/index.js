import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Assets from '../components/Assets';
import Signup from '../components/Signup';
import Publish from '../components/Publish';
import ArticleForm from '../components/forms/ArticleForm';
import PublicationForm from '../components/forms/PublicationForm';
import store from '../store';

Vue.use(Router);

const AppRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish,
    },
    {
      path: '/assets',
      name: 'assets',
      component: Assets,
    },
    {
      path: '/article',
      name: 'articleForm',
      component: ArticleForm,
    },
    {
      path: '/publication',
      name: 'publicationForm',
      component: PublicationForm,
    },
  ],
});

AppRouter.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/signup' && (!store.getters.user || !store.getters.user.email)) {
    next('/login');
  } else {
    next();
  }
});

export default AppRouter;
