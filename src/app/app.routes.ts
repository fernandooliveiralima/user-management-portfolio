import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("@/pages/home/home").then(m => m.Home)
  },
  {
    path: "create-post",
    loadComponent: () => import("@/pages/create-post/create-post").then(m => m.CreatePost)
  }
];
